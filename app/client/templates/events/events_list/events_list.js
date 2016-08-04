Template.EventsList.helpers({
  user: function() {
    return Meteor.users.findOne(this.userId);
  },
  events: function () {
    return Events.find({},{sort: {createdAt: -1}});
  },
  now: function() {
    return Nows.findOne(this.nowId);
  },
  message: function() {
    return Messages.findOne(this.messageId);
  }
});

