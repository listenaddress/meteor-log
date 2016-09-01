/*  Server Methods  */

import P from 'bluebird';

Meteor.methods({

  'saveMessage': function (content, logId) {
    var item = {
      userId: Meteor.userId(),
      createdAt: new Date(),
      content: content
    };

    var isMember = Members.findOne({ logId: logId, userId: Meteor.userId() });

    if (item.userId) {
      if (isMember) {
        return Messages.insert(item, function (error, response) {
          if (error) throw error;

          Meteor.call('saveEvent',
                      response,
                      item.userId,
                      logId,
                      'message_created',
                      'Messages');

          return response;
        });
      }

      throw new Meteor.Error(500,
        'You cannot send messages if you did not join the log');
    }

    throw new Meteor.Error(500,
      'You cannot send messages while you are not connected');
  },

  'saveEvent': function (id, userId, logId, type, refType, hidden) {
    var item = {
      type: type,
      createdAt: new Date()
    };

    if (logId) {
      item.logId = logId;
    }

    if (userId) item.userId = userId;
    if (hidden) item.hidden = true;

    if (refType === 'Messages') {
      item.messageId = id;
    }

    if (item.userId || item.groupId) {
      return Events.insert(item, function (error, response) {
        if (error) {
          console.log('error: ', error);
          throw error;
        } else {
          if (hidden) return;

          Meteor.call('saveNotifications', logId, response, item.userId, refType);
          return;
        }
      });
    }
  },

  'saveNotifications': function (logId, eventId, eventUserId, refType) {
    if (refType === 'Logs') {
      var log = Logs.findOne(logId);
      if (log.creatorId === eventUserId) return;

      Meteor.call('saveLogNotifications', logId, eventId);
    }
  },

  'saveLogNotifications': function (logId, eventId) {
    var log = Logs.findOne(logId);

    Notifications.insert({
      userId: log.creatorId,
      logId: logId,
      eventId: eventId,
      createdAt: new Date()
    });
  },

  /*  Log Methods */

  'saveLog': function (item) {
    check(item.name, String);
    item.creatorId = Meteor.userId();
    item.createdAt = new Date();
    item.accessList = [Meteor.userId()];

    if (item.creatorId) {
      return Logs.insert(item, function (error, response) {
        if (error) {
          console.log('error: ', error);
          throw error;
        } else {
          Meteor.call('joinLog', response);
          Meteor.call('saveEvent', response, item.creatorId, response, 'log_created', 'Logs');
          return response;
        }
      });
    }
  },

  'updateLog': function (logId, item) {
    check(item.name, String);
    // check any other update, currently name only

    if (item.name) {
      return Logs.update({_id: logId}, {$set: {name: item.name}},
        function (error, response) {
          if (error) throw error;

          Meteor.call('saveEvent',
                      logId,
                      Meteor.userId(),
                      logId,
                      'log_updated',
                      'Logs',
            function (error, response) {
              if (error) throw error;
            }
          );

          return response;
        }
      );
    }
  },

  'deleteLog': function (logId) {
    return Logs.update({_id: logId}, { $set: {hidden: true} },
      function (error, response) {
        if (error) throw error;

        Meteor.call('saveEvent',
                    logId,
                    Meteor.userId(),
                    logId,
                    'log_deleted',
                    'Logs',
                    true,
          function (error, response) {
            if (error) throw error;

            Events.update({logId: logId}, { $set: {hidden: true} }, {multi: true},
              function (error, response) {
                if (error) throw error;
              }
            );
          }
        );

        return response;
      }
    );
  },

  'joinLog': function (logId) {
    var member = Members.findOne({ logId: logId, userId: Meteor.userId() });
    if (member) throw new Meteor.Error(500,
      'You cannot join a log that you have already joined');

    Members.insert({ logId: logId,
                     userId: Meteor.userId(),
                     createdAt: new Date() },
      function (error, response) {
        if (error) throw error;

        Meteor.call('saveEvent',
                    response,
                    Meteor.userId(),
                    logId,
                    'member_joined_log',
                    'Logs');

        return response;
      }
    );
  },

  'leaveLog': function (logId) {
    var member = Members.findOne({ logId: logId, userId: Meteor.userId() });
    if (!member) throw new Meteor.Error(500, 'You cannot leave a log that you have already left');

    Members.remove({ logId: logId, userId: Meteor.userId() }, function (error, response) {
      if (error) throw error;

      Meteor.call('saveEvent',
                  response,
                  Meteor.userId(),
                  logId,
                  'member_left_log',
                  'Logs',
                  true);

      return response;
    });
  },

  'userExists': function (username) {
    return !!Meteor.users.findOne({username: username});
  },

  'getRepos': function () {
    // Query Github for users' repos
    // Save integration with repos
    var GitHub = require('github');

    var user = Meteor.user();
    var github = new GitHub({
      version: '3.0.0'
    });

    github.authenticate({
      type: 'oauth',
      token: user.services.github.accessToken
    });

    github.repos.getAll({}, Meteor.bindEnvironment(function (error, response) {
      if (error) console.log('error:', error);

      if (response) {
        P.map(response, Meteor.bindEnvironment(function (item) {
          return _.pick(item,
                        'id',
                        'name',
                        'full_name',
                        'html_url',
                        'owner');
        })).then(Meteor.bindEnvironment(function (items) {
          var integration = {
            service: 'github',
            repos: items
          };

          Meteor.call('saveIntegration', integration);
        }));
      }
    }));
  },

  'saveIntegration': function (item) {
    var userId = Meteor.userId();
    var updateObj = {userId: userId, service: 'github'};

    Integrations.upsert(updateObj, {
      // $push: {
      //   repos: item.repos,
      // },
      $set: {
        repos: item.repos,
        createdAt: Date.now()
      }
    });
  },

  'addRepoHook': function (repo, groupId) {
    var user = Meteor.user();
    var endpoint;
    var GitHub = require('github');
    var github = new GitHub({
      version: '3.0.0'
    });

    github.authenticate({
      type: 'oauth',
      token: user.services.github.accessToken
    });

    if (groupId) {
      endpoint = 'http://1217ea69.ngrok.io/integrations/group/' + groupId;
    } else {
      endpoint = 'http://1217ea69.ngrok.io/integrations/' + user._id;
    }

    console.log('adding webhook', repo.id, groupId);
    return github.repos.createHook({
      name: 'web',
      active: true,
      user: repo.owner.login,
      repo: repo.name,
      config: {
        'content_type': 'json',
        'url': endpoint
      },
      events: [
        'commit_comment',
        'create',
        'issues',
        'issue_comment',
        'push'
      ]
    }).then(function (response) {
      var updateObj = {userId: user._id, service: 'github'};
      var hook = _.pick(response,
                        'type',
                        'id',
                        'events',
                        'config',
                        'updated_at',
                        'last_response');

      hook.repo = repo.name;
      hook.repoOwner = repo.owner.login;
      if (groupId) hook.groupId = groupId;

      return Integrations.update(
        updateObj,
        {$push: {'hooks': hook}}
      );
    }).catch(function (error) {
      console.log('error adding repo hook: ', error);
      throw error;
    });
  },
  'removeRepoHook': function (hook, groupId) {
    var user = Meteor.user();
    var GitHub = require('github');
    var github = new GitHub({
      version: '3.0.0'
    });

    github.authenticate({
      type: 'oauth',
      token: user.services.github.accessToken
    });

    return github.repos.deleteHook({
      user: hook.repoOwner,
      repo: hook.repo,
      id: hook.id
    }).then(function (response) {
      var updateObj = {userId: user._id, service: 'github'};

      if (groupId) {
        updateObj.groupId = groupId;
      }

      return Integrations.update(
        updateObj,
        {$pull: {hooks: {id: hook.id}}}
      );
    }).catch(function (error) {
      console.log('error removing github webhook:', error);
      throw error;
    });
  },

  'saveGitHubEvent': function (item, type, userId, groupId) {
    // Save message then save event

    console.log('saveGitHubEvent', type, userId, groupId);
    var message = {
      service: 'github',
      type: type,
      data: item,
      createdAt: new Date()
    };

    if (userId) message.userId = userId;

    Messages.insert(message, function (error, response) {
      if (error) {
        console.log('error saving message: ', error);
        throw error;
      } else {
        Meteor.call('saveEvent', response, userId, groupId, 'message_created', 'Messages');
        return response;
      }
    });
  }
});
