Template.UsersList.events({
});

Template.UsersList.helpers({
  users: function () {
    return Meteor.users.find({});
  }
});


Template.UsersList.onCreated(function(){
  var self = this; 
  self.autorun(function(){
    self.subscribe('users');
  });
});
