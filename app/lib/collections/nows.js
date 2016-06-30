Nows = new Mongo.Collection('nows');

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
