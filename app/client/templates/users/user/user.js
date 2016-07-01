Template.User.events({
});

Template.User.helpers({
  now: function () {
    var user = this;
    return Nows.findOne({userId: user._id}, {sort: {createdAt: -1}, limit: 1});
  },

  nows: function () {
    var user = this;
    return Nows.find({userId: user._id}, {sort: {createdAt: -1}});
  },

  timestamp: function () {
    var comment = this;
    return moment(comment.createdAt).fromNow();
  }
});
