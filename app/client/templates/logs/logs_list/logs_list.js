Template.LogsList.helpers({
  logs: function () {
    return Logs.find();
  },

  logsCount: function () {
    return Logs.find().count();
  },

  selectedLog: function () {
    var controller = Router.current();
    return this._id === controller.params.logId;
  },

  unseenMessages: function () {
    var member = Members.findOne({
      logId: this._id,
      userId: Meteor.userId()
    });

    if (this.lastMessage && member) {
      return moment(member.lastSeenAt).isBefore(this.lastMessage);
    }
  }
});

Template.LogsList.onCreated(function () {
  var self = this;
  self.autorun(function () {
    self.subscribe('userLogs', Meteor.userId());
  });
});
