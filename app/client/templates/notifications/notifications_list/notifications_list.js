Template.NotificationsList.helpers({
  notifications: function () {
    return Notifications.find({userId: Meteor.userId()});
  },
  user: function() {
    return Meteor.users.findOne(this.userId);
  },
  log: function() {
    return Logs.findOne(this.logId);
  },
  event: function() {
    return Events.findOne(this.eventId);
  }
});
