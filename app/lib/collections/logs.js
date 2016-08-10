Logs = new Mongo.Collection('logs');

var Schemas = {};

Schemas.Log = new SimpleSchema({
  name: {
    type: String,
    optional: true
  },
  creatorId: {
    type: String,
    optional: true
  },
  contributors: {
    type: [String],
    optional: true
  },
  createdAt: {
    type: Date
  },
  groupId: {
    type: String,
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
