Meteor.publish('users', function () {
  return Meteor.users.find({}, {fields: {profile: 1, username: 1}});
});

Meteor.publish('user', function (username) {
  return Meteor.users.find({username: username}, {fields: {profile: 1, username: 1}});
});

Meteor.publish('userInfo', function (userId) {
  return Meteor.users.find({_id: userId}, {fields: {profile: 1, username: 1}});
});

Meteor.publish('log', function (logId) {
  var log = Logs.find({_id: logId, hidden: false});
  return log;
});

Meteor.publish('logs', function (logId) {
  var logs = Logs.find({hidden: false});
  return logs;
});

Meteor.publish('members', function (logId) {
  return Members.find({logId: logId});
})

Meteor.publish('userLogs', function (userId) {
  return Logs.find({creatorId: userId, privacy: 'public', hidden: false});
});

Meteor.publish('privateUserLogs', function () {
  if (this.userId) {
    return Logs.find({ $and: [ {privacy: 'private'},
                               {accessList: this.userId},
                               {hidden: false} ]
    });
  }
});

Meteor.publishComposite('userEvents', function (userId) {
  return {
    find: function () {
      if (userId)
        return Events.find({userId: userId, hidden: false}, {sort: {createdAt: -1}});
    },
    children: [
      {
        // Find message from event
        find: function (item) {
          return Messages.find({_id: item.messageId});
        }
      }
    ]
  }
});

Meteor.publishComposite('logEvents', function (logId) {
  return {
    find: function () {
      if (logId)
        return Events.find({logId: logId, hidden: false}, {sort: {createdAt: -1}});
    },
    children: [
      {
        // Find message from event
        find: function (item) {
          return Messages.find({_id: item.messageId});
        }
      },
      {
        // Find user of the event
        find: function (item) {
          return Meteor.users.find({_id: item.userId, hidden: false}, {username: 1, profile: 1});
        }
      },
      {
        // Find log of the event
        find: function (item) {
          return Logs.find({_id: item.logId, hidden: false});
        }
      }
    ]
  }
});

Meteor.publishComposite('homeEvents', function () {
  return {
    find: function () {
      return Events.find({hidden: false}, {sort: {createdAt: -1}});
    },
    children: [
      {
        // Find message from event
        find: function (item) {
          return Messages.find({_id: item.messageId});
        }
      },
      {
        // Find user of the event
        find: function (item) {
          return Meteor.users.find({_id: item.userId}, {username: 1, profile: 1});
        }
      },
      {
        // Find log of the event
        find: function (item) {
          return Logs.find({_id: item.logId, hidden: false});
        }
      }
    ]
  }
});

Meteor.publishComposite('notifications', function (userId) {
  return {
    find: function () {
      return Notifications.find({userId: userId});
    },
    children: [
      {
        // Find log from notification
        find: function (notification) {
          return Logs.find({_id: notification.logId});
        }
      },
      {
        // Find event from notification
        find: function (notification) {
          return Events.find({_id: notification.eventId});
        },
        children: [
          {
            // Find user from event
            find: function (event, notification) {
              return Meteor.users.find({_id: event.userId});
            }
          }
        ]
      }
    ]
  }
});

Meteor.publish('integrations', function (logId) {
  return Integrations.find({logId: logId});
});

Meteor.publish('services', function () {
  return Services.find({});
});
