Template.Group.onCreated(function(){

  var self = this; 
  self.autorun(function(){
    var controller = Router.current();   
    self.subscribe('groupEvents', controller.params.groupId, function(){
      $( ".loader" ).delay( 1000 ).fadeOut( 'slow', function() {
        $( ".loading-wrapper" ).fadeIn( 'slow' );
      });
    });;
  }); 

  
});