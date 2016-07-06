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


Template.EventsList.onCreated(function(){

  var self = this; 
  self.autorun(function(){
    var controller = Router.current(); 

    var user = Meteor.users.findOne({"username":controller.params.username});
  
    if(user) 
      var userId = user._id;
  
    self.subscribe('events', userId);
  }); 

  
});
