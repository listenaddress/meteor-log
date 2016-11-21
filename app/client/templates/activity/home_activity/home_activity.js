Template.HomeActivity.helpers({
  user: function () {
    return Meteor.users.findOne(this.userId);
  },
  log: function () {
    return Logs.findOne(this.logId);
  },
  events: function () {
    return Events.find();
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

Template.HomeActivity.onCreated(function () {
  var self = this;
  self.autorun(function () {
    self.subscribe('homeEvents');
  });
});
