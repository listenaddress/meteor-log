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

  isMe: function () {
    return this._id === Meteor.userId();
  },

  timestamp: function () {
    var comment = this;
    return moment(comment.createdAt).fromNow();
  },

  userProfile: function(){
    var controller = Router.current();
    return Meteor.users.findOne({"username": controller.params.username});
  },
  HTMLsnippet(){
    return '<script src="https://goo.gl/WqhYHa"></script><div id="now" data-username="'+Router.current().params.username+'"></div>';
  }
});
