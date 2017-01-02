Template.LogAbout.helpers({
  log: function () {
    var controller = Router.current();
    if (controller.params.logId)
      return Logs.findOne({_id: controller.params.logId});
  },

  subscribers: function () {
    var controller = Router.current();
    if (controller.params.logId)
    return Members.find({logId: controller.params.logId});
  },

  user: function () {
    return Meteor.users.findOne({_id: this.userId});
  },

  isCreator: function () {
    var controller = Router.current();
    if (controller.params.logId) {
      var currentLog = Logs.findOne({_id: controller.params.logId});
      return this._id === currentLog.creatorId;
    }
  },

  descriptionOrAbout: function () {
    return (this.description !== '') || (this.about !== '');
  }
});


Template.LogAbout.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var controller = Router.current();
    if (controller.params.logId) {
      self.subscribe('subscribers', controller.params.logId);
    }
  });
});
