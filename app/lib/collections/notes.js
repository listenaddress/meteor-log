Notes = new Mongo.Collection('notes');

var Schemas = {};

Schemas.Note = new SimpleSchema({
  body: {
    type: String
  },
  userId: {
    type: String
  },
  subscribers: {
    type: [String],
    optional: true
  },
  createdAt: {
    type: Date
  }
});

Notes.attachSchema(Schemas.Note);

if (Meteor.isServer) {
  Notes.allow({
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
