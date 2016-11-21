Template.UserActivity.helpers({
  user: function () {
    return Meteor.users.findOne(this.userId);
  },
  log: function () {
    return Logs.findOne(this.logId);
  },
  events: function () {
    var controller = Router.current();
    if (controller.params.username) {
      var user = Meteor.users.findOne({username: controller.params.username})
      return Events.find({userId: user._id});
    }

    return Events.find({});
  },
  message: function () {
    return Messages.findOne(this.messageId);
  },
  files: function () {
    return Files.find({messageId: this.messageId});
  },
  timestamp: function () {
    return moment(this.createdAt).fromNow();
  },
  creator: function () {
    return Meteor.users.findOne(this.creatorId);
  }
});

Template.UserActivity.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var controller = Router.current();
    if (controller.params.username) {
      var user = Meteor.users.findOne({username: controller.params.username})
      if (user)
        self.subscribe('userEvents', user._id);
    }
  });
});
