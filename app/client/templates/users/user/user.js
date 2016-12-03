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
  },

  logs: function () {
    return Logs.find();
  },

  creator: function () {
    return this.creatorId === Session.get('userOnPage');
  },

  private: function () {
    return this.privacy === 'private';
  }
});

Template.User.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var controller = Router.current();
    var user = Meteor.users.findOne({'username': controller.params.username});
    if (user) {
      var userId = user._id;
      Session.set('userOnPage', userId);
    }

    self.subscribe('userLogs', Session.get('userOnPage'));
    self.subscribe('user', controller.params.username);
  });
});
