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
  return Meteor.users.find({}, {fields: { profile: 1 }});
});

Meteor.publish('user', function (userId) {
  if (!this.userId) return this.ready();

  return [
    Meteor.users.find({_id: userId}, {fields: {profile: 1}}),
    Nows.find({userId: userId})
  ];
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

Meteor.publish('nows', function () {
  return Nows.find();
});

Meteor.publish('now', function (id) {
  var now = Nows.findOne({_id: id});
  return [
    Meteor.users.find({_id: now.userId}, {fields: {profile: 1}}),
    Nows.find({_id: id})
  ];
});
