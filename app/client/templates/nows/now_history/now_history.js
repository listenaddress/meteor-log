Template.NowHistory.helpers({
  timestamp: function () {
    var now = this;
    return moment(now.createdAt).format('MMMM Do YYYY, h:mm:ss a');
  }
});

Template.NowHistory.events({
  "click .followingNow": function(){

  },

  "click .previousNow": function(){

  }
});

Template.NowHistory.onCreated(function(){
  // var self = this;
  // self.autorun(function(){
  //   var controller = Router.current();
  //   var user = Meteor.users.findOne({"username":controller.params.username});

  //   if(user)
  //     var userId = user._id;

  //   self.subscribe('UserNow', userId);
  // });
});