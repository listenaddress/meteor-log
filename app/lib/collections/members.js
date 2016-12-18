Members = new Mongo.Collection('members');

var Schemas = {};

Schemas.Member = new SimpleSchema({
  logId: {
    type: String,
    optional: true
  },
  userId: {
    type: String,
    optional: true
  },
  lastSeenAt: {
    type: Date,
    optional: true
  },
  createdAt: {
    type: Date
  }
});

Members.attachSchema(Schemas.Member);

if (Meteor.isServer) {
  Members.allow({
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
