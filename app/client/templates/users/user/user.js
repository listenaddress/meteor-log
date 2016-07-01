Template.User.events({
});

Template.User.helpers({
  nows: function () {
    var user = this;
    return Nows.find({userId: user._id}, {sort: {createdAt: -1}});
  },

  timestamp: function () {
    var comment = this;
    return moment(comment.createdAt).fromNow();
  }
});
