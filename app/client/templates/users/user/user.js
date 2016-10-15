Template.User.events({
  'click .addlog': function () {
    Router.go('/log/new');
  }
});

Template.User.helpers({
  isMe: function () {
    return this._id === Meteor.userId();
  },

  timestamp: function () {
    var comment = this;
    return moment(comment.createdAt).fromNow();
  },

  userProfile: function () {
    var controller = Router.current();
    return Meteor.users.findOne({'username': controller.params.username});
  }
});

Template.User.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var controller = Router.current();
    self.subscribe('user', controller.params.username);
  });
});
