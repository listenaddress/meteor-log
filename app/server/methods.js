/*  Server Methods  */
var saveFiles = saveFiles;

Meteor.methods({
  'saveMessage': function (message, files, logId) {
    // Find users tagged and add links to their profile
    var usersTaggedPattern = /\B@[a-z0-9_-]+/g;
    var matches = message.match(usersTaggedPattern);
    if (matches && matches.length > 0) {
      _.map(matches, function (item) {
        var username = item.replace('@', '');
        var exists = !!Meteor.users.findOne({username: username});
        if (!exists) return;

        message = message.replace(item, '<a href="/' + username + '">' + item + '</a>');
      });
    }

    var item = {
      userId: Meteor.userId(),
      createdAt: new Date(),
      content: message
    };
    var isMember = Members.findOne({ logId: logId, userId: Meteor.userId() });

    if (!item.userId) {
      throw new Meteor.Error(500,
        'You cannot send messages while you are not connected');
    }

    if (!isMember) {
      throw new Meteor.Error(500,
        'You cannot send messages if you did not join the log');
    }

    return Messages.insert(item, function (error, response) {
      if (error) throw error;

      saveFiles(files, response, logId);

      Meteor.call('saveEvent',
                  response,
                  item.userId,
                  logId,
                  'message_created',
                  'Messages');

      return response;
    });

    // return saveFiles(item).then(Meteor.bindEnvironment(function (value) {
    //   if (value) item.files = value;
    //   console.log('value from saveFiles', value);
    //   return saveMessage(item);
    // })).then(Meteor.bindEnvironment(function (value) {
    //   console.log('value from saveMessage', value);
    //   return saveEvent(value,
    //                    item.userId,
    //                    logId,
    //                    'message_created',
    //                    'Messages');

    // }));
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

    return Events.insert(item, function (error, response) {
      if (error) {
        console.log('error: ', error);
        throw error;
      } else {
        if (hidden) return;

        item._id = response;
        Meteor.call('saveNotifications', logId, item, refType);
        return;
      }
    });
  },

  'saveNotifications': function (logId, event, refType) {
    if (refType === 'Logs') {
      var log = Logs.findOne(logId);
      if (log.creatorId === event.userId) return;

      Meteor.call('saveLogNotifications', logId, event._id);
    }

    if (refType === 'Messages') {
      // Find users tagged and save a notification for them
      var message = Messages.findOne(event.messageId);
      var usersTaggedPattern = /\B@[a-z0-9_-]+/g;
      var matches = message.content.match(usersTaggedPattern);
      if (matches && matches.length > 0) {
        _.map(matches, function (item) {
          var username = item.replace('@', '');
          var user = Meteor.users.findOne({username: username});
          if (!user || user._id === event.userId) return;

          Meteor.call('saveTaggedNotification', username, event._id);
        });
      }
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

  'saveTaggedNotification': function (username, eventId) {
    var user = Meteor.users.findOne({username: username});

    Notifications.insert({
      userId: user._id,
      eventId: eventId,
      createdAt: new Date()
    });
  },

  'markNotificationsAsSeen': function () {
    return Notifications.update({userId: Meteor.userId()},
                                {$unset: {unseen: ''}},
                                {multi: true},

      function (error, response) {
        if (error) throw error;
        return response;
      }
    );
  },

  'markNotificationAsHeard': function (id) {
    return Notifications.update(id, {$set: {heard: true}},
      function (error, response) {
        if (error) throw error;
        return response;
      }
    );
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
  }
});

saveFiles = function (files, messageId, logId) {
  _.map(files, function (item) {
    Files.insert({
      userId: Meteor.userId(),
      messageId: messageId,
      s3Id: item._id,
      secure_url: item.secure_url,
      original_name: item.file.original_name,
      createdAt: new Date()
    }, function (error, response) {
      if (error) throw error;
    });
  });
};
