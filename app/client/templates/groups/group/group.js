Template.Group.onCreated(function(){

  var self = this; 
  self.autorun(function(){
    var controller = Router.current();   
    self.subscribe('groupEvents', controller.params.groupId);
  }); 

  
});