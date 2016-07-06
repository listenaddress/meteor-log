Template.editUser.helpers({
  isMe: function () {
    return this._id === Meteor.userId();
  }
});

