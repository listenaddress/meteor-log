Integrations = new Mongo.Collection('integrations');

var Schemas = {};

Schemas.Integration = new SimpleSchema({
  logId: {
    type: String
  },
  serviceType: {
    type: String
  }
});

// var HookSchema = new SimpleSchema({
//   type: {
//     type: String
//   },
//   id: {
//     type: String
//   },
//   groupId: {
//     type: String,
//     optional: true
//   },
//   events: {
//     type: [String]
//   },
//   config: {
//     type: Object
//   },
//   updated_at: {
//     type: String
//   },
//   last_response: {
//     type: Object
//   },
//   repo: {
//     type: String
//   },
//   repoOwner: {
//     type: String
//   }
// });

// Schemas.Integration = new SimpleSchema({
//   userId: {
//     type: String
//   },
//   service: {
//     type: String
//   },
//   repos: {
//     type: [Object],
//     blackbox: true
//   },
//   hooks: {
//     type: [HookSchema],
//     optional: true
//   },
//   createdAt: {
//     type: Date
//   }
// });

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
