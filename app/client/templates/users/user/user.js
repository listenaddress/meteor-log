Template.User.events({
});

Template.User.helpers({
  notes: function () {
    var user = this;
    return Notes.find({userId: user._id}, {sort: {createdAt: -1}});
  }
});
