Logs = new Mongo.Collection('logs');

var Schemas = {};

Schemas.Log = new SimpleSchema({
  name: {
    type: String,
    optional: true
  },
  description: {
    type: String,
    optional: true
  },
  about: {
    type: String,
    optional: true
  },
  creatorId: {
    type: String,
    optional: true
  },
  groupId: {
    type: String,
    optional: true
  },
  lastMessage: {
    type: Date,
    optional: true
  },
  createdAt: {
    type: Date
  },
  accessList: {
    type: [String],
    optional: true
  },
  privacy: {
    type: String,
    optional: true
  },
  hidden: {
    type: Boolean,
    defaultValue: false,
    optional: true
  }
});

Logs.attachSchema(Schemas.Log);

if (Meteor.isServer) {
  Logs.allow({
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
