Events = new Mongo.Collection('events');

var Schemas = {};

Schemas.Event = new SimpleSchema({
  userId: {
    type: String
  },
  refType: {
    type: String,
    optional: true
  },
  refId: {
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
