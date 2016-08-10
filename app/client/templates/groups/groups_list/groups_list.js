Template.GroupsList.helpers({
  groups: function () {
    return Groups.find({});
  }
});

Template.GroupsList.onCreated(function(){
  var self = this; 
  self.autorun(function(){
    self.subscribe('groups', function(){
      $( ".loader" ).delay( 1000 ).fadeOut( 'slow', function() {
        $( ".loading-wrapper" ).fadeIn( 'slow' );
      });
    });
  });
});

Template.GroupsList.onRendered( function() {
  $( ".loader" ).delay( 750 ).fadeIn();
});
