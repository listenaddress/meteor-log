Template.NotificationsList.helpers({
  notifications: function () {
    return Notifications.find({userId: Meteor.userId()});
  },
  notificationUser: function() {
    return Meteor.users.findOne(this.userId);
  },
  note: function() {
    return Notes.findOne(this.noteId);
  },
  noteUser: function() {
    return Meteor.users.findOne(this.userId);
  },
  comment: function() {
    return Comments.findOne(this.noteId);
  },
  commentUser: function() {
    return Meteor.users.findOne(this.userId);
  }
});
