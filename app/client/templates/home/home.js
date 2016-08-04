/*****************************************************************************/
/* Home: Event Handlers */
/*****************************************************************************/
Template.Home.events({
});

/*****************************************************************************/
/* Home: Helpers */
/*****************************************************************************/
Template.Home.helpers({
});

/*****************************************************************************/
/* Home: Lifecycle Hooks */
/*****************************************************************************/

Template.Home.onCreated(function(){
  var self = this; 
  self.autorun(function(){
    //self.subscribe('notes');
    //self.subscribe('nows');
  });
});

Template.Home.onRendered(function () {
});

Template.Home.onDestroyed(function () {
});

Template.Home.onCreated(function(){

  var self = this; 
  self.autorun(function(){
    var controller = Router.current(); 

    var user = Meteor.users.findOne({"username":controller.params.username});
  
    if(user) 
      var userId = user._id;
  
    self.subscribe('homeEvents', userId);
  }); 

  
});
