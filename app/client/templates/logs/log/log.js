Template.Log.helpers({
  owner: function () {
    var user = Meteor.users.findOne({_id: this.creatorId});
    return user;
  },

  log: function () {
    var controller = Router.current();
    if (controller.params.logId)
      return Logs.findOne({_id: controller.params.logId});
  },

  joined: function () {
    var controller = Router.current();
    var logId = controller.params.logId;
    var member = Members.findOne({logId: logId, userId: Meteor.userId()});

    if (member) return true;
    else return false;
  }
});

Template.Log.events({

});

Template.Log.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var controller = Router.current();
    if (controller.params.logId) {
      var log = Logs.findOne({_id: controller.params.logId});
      self.subscribe('log', controller.params.logId);
      if (log) {
        self.subscribe('userInfo', log.creatorId);
      }
    }
  });
});

