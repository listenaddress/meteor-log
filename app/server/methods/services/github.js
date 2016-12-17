import P from 'bluebird';

Meteor.methods({
  'disconnectGithub': function () {
    return Meteor.users.update(
      Meteor.userId(),
      {$unset: {'services.github': ''}},
      function (error, response) {
        if (error) throw error;
        return response;
      }
    );
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
      if (error) throw error;
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

        Meteor.users.update({_id: Meteor.userId()}, {
          $set: {
            'services.github.repos': integration.repos,
            createdAt: Date.now()
          }
        });
      }));
    }));
  },

  'addRepoHook': function (repo, logId) {
    var user = Meteor.user();
    var GitHub = require('github');
    var github = new GitHub({
      version: '3.0.0'
    });

    github.authenticate({
      type: 'oauth',
      token: user.services.github.accessToken
    });

    var endpoint = process.env.ENDPOINT + '/integrations/' + logId + '/' + user._id;

    if (repo) {
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
      }, Meteor.bindEnvironment(function (error, response) {
        if (error) throw error;
        Meteor.call('IntegrateService', logId, 'github', function (error, integrationId) {
          if (error) throw error;
          var hook = _.pick(response,
                            'type',
                            'id',
                            'events',
                            'config',
                            'updated_at',
                            'last_response');
          hook.repo = repo.name;
          hook.repoOwner = repo.owner.login;
          var updateObj = {userId: user._id, createdAt: new Date(), integrationId: integrationId, hook: hook};

          return Github.insert(updateObj, function (error, response) {
            if (error) throw error;
          });
        });
      }));
    }
  },

  'removeRepoHook': function (hook, integrationId) {
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
      Github.remove({'hook.id': hook.id}, function (error, response) {
        if (error) throw error;
      });

      var github = Github.find({integrationId: integrationId});
      if (github.count() === 0) {
        Integrations.remove({_id: integrationId});
      }
      return;
    }).catch(function (error) {
      if (error) throw error;
    });
  },

  'saveGitHubEvent': function (item, type, logId) {
    // Save message then save event

    console.log('saveGitHubEvent', type);
    var message = {
      service: 'github',
      type: type,
      data: item,
      createdAt: new Date()
    };

    Messages.insert(message, function (error, messageId) {
      if (error) throw error;

      Meteor.call(
        'saveEvent',
        messageId,
        null,
        logId,
        'service_',
        'Messages',
        function (error, response) {
          if (error) throw error;
        }
      );
    });
  }
});
