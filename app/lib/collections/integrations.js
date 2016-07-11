Integrations = new Mongo.Collection('integrations');

var Schemas = {};

Schemas.Integration = new SimpleSchema({
  userId: {
    type: String
  },
  service: {
    type: String
  },
  repos: {
    type: [Object],
    blackbox: true
  },
  createdAt: {
    type: Date
  }
});

Integrations.attachSchema(Schemas.Integration);

if (Meteor.isServer) {
  Integrations.allow({
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
