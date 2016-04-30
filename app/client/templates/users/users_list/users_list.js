Template.UsersList.events({
});

Template.UsersList.helpers({
  users: function () {
    return Meteor.users.find({});
  }
});
