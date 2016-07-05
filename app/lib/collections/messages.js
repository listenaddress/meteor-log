Messages = new Mongo.Collection('messages');

var Schemas = {};

Schemas.Message = new SimpleSchema({
  userId: {
    type: String
  },
  content: {
    type: String
  },
  type: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date
  }
});

Messages.attachSchema(Schemas.Message);

if (Meteor.isServer) {
  Messages.allow({
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
