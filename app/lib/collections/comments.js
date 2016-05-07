Comments = new Mongo.Collection('comments');

var Schemas = {};

Schemas.Comment = new SimpleSchema({
  body: {
    type: String
  },
  noteId: {
    type: String,
    optional: true
  },
  userId: {
    type: String
  },
  createdAt: {
    type: Date
  }
});

Comments.attachSchema(Schemas.Comment);

if (Meteor.isServer) {
  Comments.allow({
    insert: function (userId, doc) {
      return !!userId;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return userId === doc.userId;
    },

    remove: function (userId, doc) {
      return userId === doc.userId;
    }
  });
}
