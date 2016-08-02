Nows = new Mongo.Collection('nows');

var Schemas = {};

Schemas.Now = new SimpleSchema({
  _id: {
    type: String
  },
  body: {
    type: String,
    optional: true
  },
  userId: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date
  }
});

Nows.attachSchema(Schemas.Now);


if (Meteor.isServer) {
  Nows.allow({
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
