Template.LogsList.helpers({
  logs: function () {
    return Logs.find({});
  }
});

Template.LogsList.onCreated(function(){
  var self = this;

  var controller = Router.current();
  var user = Meteor.users.findOne({"username":controller.params.username});

    if(user)
      var userId = user._id;

    console.log(userId);
  self.autorun(function(){
    self.subscribe('userLogs', userId, function(){
      $( ".loader" ).delay( 1000 ).fadeOut( 'slow', function() {
        $( ".loading-wrapper" ).fadeIn( 'slow' );
      });
    });
  });
});

Template.LogsList.onRendered( function() {
  $( ".loader" ).delay( 750 ).fadeIn();
});
