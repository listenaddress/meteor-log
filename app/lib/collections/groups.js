Groups = new Mongo.Collection('groups');

var Schemas = {};

Schemas.Group = new SimpleSchema({
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
  }
});

Groups.attachSchema(Schemas.Group);

if (Meteor.isServer) {
  Groups.allow({
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
