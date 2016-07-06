Events = new Mongo.Collection('events');

var Schemas = {};

Schemas.Event = new SimpleSchema({
  userId: {
    type: String
  },
  type: {
    type: String,
    optional: true
  },
  messageId: {
    type: String,
    optional: true
  },
  nowId: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date
  }
});

Events.attachSchema(Schemas.Event);

if (Meteor.isServer) {
  Events.allow({
    insert: function (userId, doc) {
      return userId === doc.userId;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return userId === doc.userId;
    },

    remove: function (userId, doc) {
      return userId === doc.userId;
    }
  });
}
