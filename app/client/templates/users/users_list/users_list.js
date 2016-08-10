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
    self.subscribe('users', function(){
      $( ".loader" ).delay( 1000 ).fadeOut( 'slow', function() {
        $( ".loading-wrapper" ).fadeIn( 'slow' );
      });
    });
  });
});


Template.UsersList.onRendered( function() {
  $( ".loader" ).delay( 750 ).fadeIn();
});