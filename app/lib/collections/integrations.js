Integrations = new Mongo.Collection('integrations');

var Schemas = {};

Schemas.Integration = new SimpleSchema({
  logId: {
    type: String
  },
  serviceType: {
    type: String
  },
  updatedAt: {
    type: Date,
    optional: true
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
