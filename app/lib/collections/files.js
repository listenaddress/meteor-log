Files = new Mongo.Collection('files');

var Schemas = {};

Schemas.File = new SimpleSchema({
  userId: {
    type: String
  },
  messageId: {
    type: String,
    optional: true
  },
  s3Id: {
    type: String
  },
  secure_url: {
    type: String
  },
  width: {
    type: String,
    optional: true
  },
  height: {
    type: String,
    optional: true
  },
  original_name: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date
  }
});

Files.attachSchema(Schemas.File);

if (Meteor.isServer) {
  Files.allow({
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
