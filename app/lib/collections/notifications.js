Notifications = new Mongo.Collection('notifications');

var Schemas = {};

Schemas.Notification = new SimpleSchema({
  userId: {
    type: String
  },
  logId: {
    type: String
  },
  eventId: {
    type: String
  },
  unseen: {
    type: Boolean,
    optional: true
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
