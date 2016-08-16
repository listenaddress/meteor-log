Meteor.publish('notes', function () {
  return Notes.find();
});

Meteor.publish('note', function (id) {
  var note = Notes.findOne({_id: id});
  return [
    Meteor.users.find({_id: note.userId}, {fields: {profile: 1}}),
    Notes.find({_id: id}),
    Comments.find({noteId: id}, {sort: {createdAt: -1}})
  ];
});

Meteor.publish('users', function () {
  return Meteor.users.find({}, {fields: { profile: 1 , username:1}});
});

Meteor.publish('user', function (username) {
  return Meteor.users.find({username: username}, {fields: {profile: 1, username:1}});
});

Meteor.publish('userInfo', function (userId) {
  return Meteor.users.find({_id: userId}, {fields: {profile: 1, username:1}});
});


Meteor.publish('group', function (id) {
  return Groups.find({_id:id});
});

Meteor.publish('groups', function () {
  return Groups.find({});
});

Meteor.publish('log', function (logId) {
  return Logs.find({_id:logId});
});

Meteor.publish('userLogs', function (userId) {
  return Logs.find({creatorId:userId, privacy:'public'});
});

Meteor.publish('privateUserLogs', function () {
  if(this.userId)
    return Logs.find({ $and: [ { privacy: "private" }, {accessList: this.userId} ] });
});


Meteor.publishComposite('notifications', function (id) {
  return {
    find: function () {
      return Notifications.find({userId: id});
    },
    children: [
      {
        // Find note from notification
        find: function(notification) {
          return Notes.find({_id: notification.noteId});
        },
        children: [
          {
            find: function(notification, note) {
              return Meteor.users.find({_id: note.userId}, {fields: { profile: 1 }});
            }
          }
        ]
      },
      {
        // Find comment from notification
        find: function(notification) {
          return Comments.find({_id: notification.commentId});
        },
        children: [
          {
            find: function(notification, comment) {
              return Meteor.users.find({_id: comment.userId}, {fields: { profile: 1 }});
            }
          }
        ]
      }
    ]
  }
});

Meteor.publishComposite('userEvents', function (userId) {
  return {
    find: function () {
      if(userId)
        return Events.find({userId: userId}, {sort: {createdAt: -1}});
    },
    children: [
      {
        // Find message from event
        find: function(item) {
          return Messages.find({_id: item.messageId});
        }
      },
      {
        // Find now from event
        find: function(item) {
          return Nows.find({_id: item.nowId});
        }
      }
    ]
  }
});


Meteor.publishComposite('logEvents', function (logId) {
  return {
    find: function () {
      if(logId)
        return Events.find({logId: logId}, {sort: {createdAt: -1}});
    },
    children: [
      {
        // Find message from event
        find: function(item) {
          return Messages.find({_id: item.messageId});
        }
      },
      {
        // Find now from event
        find: function(item) {
          return Nows.find({_id: item.nowId});
        }
      }
    ]
  }
});


Meteor.publishComposite('groupEvents', function (groupId) {
  return {
    find: function () {
      if(groupId)
        return Events.find({groupId: groupId}, {sort: {createdAt: -1}});
    },
    children: [
      {
        // Find message from event
        find: function(item) {
          return Messages.find({_id: item.messageId});
        }
      },
      {
        // Find now from event
        find: function(item) {
          return Nows.find({_id: item.nowId});
        }
      }
    ]
  }
});

Meteor.publishComposite('homeEvents', function () {
  return {
    find: function () {
        return Events.find({},{sort: {createdAt: -1}});
    },
    children: [
      {
        // Find message from event
        find: function(item) {
          return Messages.find({_id: item.messageId});
        }
      },
      {
        // Find now from event
        find: function(item) {
          return Nows.find({_id: item.nowId});
        }
      }
    ]
  }
});



Meteor.publish('UserNow', function (userId) {
  return Nows.find({userId: userId}, {sort: {createdAt: -1}, limit: 1})
});

Meteor.publish('myNow', function (username) {
  var userId = Meteor.users.findOne({username: username}, {fields: {profile: 1}});
  return Nows.find({userId: userId._id}, {sort: {createdAt: -1}, limit: 1})
});

Meteor.publish('now', function (id) {
  var now = Nows.findOne({_id: id});
  return [
    Meteor.users.find({_id: now.userId}, {fields: {profile: 1, username:1}}),
    Nows.find({_id: id})
  ];
});

Meteor.publish('integrations', function (userId) {
  return Integrations.find({userId: userId});
});
