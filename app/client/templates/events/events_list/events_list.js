Template.EventsList.helpers({
  user: function() {
    return Meteor.users.findOne(this.userId);
  },
  events: function () {
    return Events.find();
  },
  now: function() {
    return Nows.findOne(this.nowId);
  },
  message: function() {
    return Messages.findOne(this.messageId);
  }
});


Template.EventsList.onCreated(function(){
  var self = this; 
  self.autorun(function(){
    self.subscribe('events');
  });
});
