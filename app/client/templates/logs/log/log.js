Template.Log.onCreated(function(){
  var self = this;

    self.autorun(function(){
      self.subscribe('UserNow', this.creatorId);
    });

});

Template.Log.helpers({
  owner: function(){
    var user = Meteor.users.findOne({_id: this.creatorId});
    return user;
  },

  log:function(){
    return Logs.findOne({});
  }
});