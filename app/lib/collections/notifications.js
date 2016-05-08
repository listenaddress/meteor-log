Notifications = new Mongo.Collection('notifications');

var Schemas = {};

Schemas.Notification = new SimpleSchema({
  userId: {
    type: String
  },
  noteId: {
    type: String
  },
  commentId: {
    type: String
  },
  action: {
    type: String
  },
  createdAt: {
    type: Date
  }
});

Notifications.attachSchema(Schemas.Notification);

if (Meteor.isServer) {
  Notifications.allow({
    insert: function (userId, doc) {
      return;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return;
    },

    remove: function (userId, doc) {
      return;
    }
  });
}
