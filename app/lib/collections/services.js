Services = new Mongo.Collection('services');

var Schemas = {};

Schemas.Service = new SimpleSchema({
  type: {
    type: String,
    optional: true
  },
  description: {
    type: String,
    optional: true
  },
  website: {
    type: String,
    optional: true
  }
});

Services.attachSchema(Schemas.Service);

if (Meteor.isServer) {
  Services.allow({
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
