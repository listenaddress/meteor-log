Meteor.publish('users', function () {
  return Meteor.users.find({}, {fields: {profile: 1, username: 1}});
});

Meteor.publish('usersByUsername', function (username) {
  return Meteor.users.find({username: {$regex: username}}, {fields: {profile: 1, username: 1}});
});

Meteor.publish('usersById', function (userId) {
  return Meteor.users.find({_id: userId}, {fields: {profile: 1, username: 1}});
});

Meteor.publish('userService', function (serviceType) {
  var username = 'services.' + serviceType + '.username';
  var repos = 'services.' + serviceType + '.repos';
  return Meteor.users.find({_id: this.userId}, {fields: {[username]: 1, [repos]: 1}});
});

Meteor.publish('github', function (integrationId) {
  return Github.find({integrationId: integrationId});
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
        return Events.find({logId: logId, hidden: false}, {sort: {createdAt: 1}});
    },
    children: [
      {
        // Find message from event
        find: function (item) {
          return Messages.find({_id: item.messageId});
        },
        children: [
          {
            // Find files from message
            find: function (message, event) {
              return Files.find({messageId: message._id});
            }
          }
        ]
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
          },
          {
            // Find message from event
            find: function (event, notification) {
              return Messages.find({_id: event.messageId});
            }
          },
          {
            // Find log from event
            find: function (event, notification) {
              return Logs.find({_id: event.logId});
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

Meteor.publish('integration', function (logId, serviceType) {
  return Integrations.find({logId: logId, serviceType: serviceType});
});

Meteor.publish('services', function () {
  return Services.find({});
});

Meteor.publish('service', function (serviceType) {
  return Services.find({type: serviceType});
});
