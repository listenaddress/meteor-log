Template.User.events({
  "click .showlogs": function(){
    $( ".mainlog" ).delay( 400 ).fadeOut( 'slow', function() {
      $('.logs').fadeIn( 'slow' );
    });
  },

  "click .showmainlog": function(){
    $( ".logs" ).delay( 400 ).fadeOut( 'slow', function() {
      $('.mainlog').fadeIn( 'slow' );
    });
  },

  "click .addlog": function(){
    Router.go('/log/new');
  }
});

Template.User.helpers({
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

  });


});
