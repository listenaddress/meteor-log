
Template.User.events({
  "click .copylabel": function(){
    var Clipboard = require('clipboard');
    var clipboard = new Clipboard('.copylabel',{
        text: function() { 
            return Session.get('copyboard');
        }
    });
    $('.copylabel').popup({
      content : 'Hello I am a popup',
      on    : 'click',
      position: 'top center'

    });
  }

});

Template.User.helpers({
  now: function () {
    var user = this;
    return Nows.findOne({userId: user._id}, {sort: {createdAt: -1}, limit: 1});
  },
  nows: function () {
    var user = this;
    return Nows.find({userId: user._id}, {sort: {createdAt: -1}});
  },

  isMe: function () {
    return this._id === Meteor.userId();
  },

  timestamp: function () {
    var comment = this;
    return moment(comment.createdAt).fromNow();
  },

  userProfile: function(){
    var controller = Router.current();
    return Meteor.users.findOne({"username": controller.params.username});
  },
  HTMLsnippet(){
    var code = '<script src="https://goo.gl/WqhYHa"></script><div id="now" data-username="'+Router.current().params.username+'"></div>';
    Session.set('copyboard', code);
    var result = Prism.highlight(code, Prism.languages.markup);
    return result;
  }
});

Template.User.onCreated(function(){

  var self = this; 
  self.autorun(function(){
    var controller = Router.current(); 

    var user = Meteor.users.findOne({"username":controller.params.username});
  
    if(user) 
      var userId = user._id;
  
    self.subscribe('userEvents', userId, function(){
      $( ".loader" ).delay( 1000 ).fadeOut( 'slow', function() {
        $( ".loading-wrapper" ).fadeIn( 'slow' );
      });
    });
  }); 

  
});
