Template.LogTabs.onRendered(function () {
  this.$('.menu a .item').tab();
});

Template.LogTabs.helpers({
  log: function () {
    var controller = Router.current();
    if (controller.params.logId)
      return Logs.findOne({_id: controller.params.logId});
  }
});

Template.LogTabs.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var controller = Router.current();
    if (controller.params.logId) {
      self.subscribe('log', controller.params.logId);
    }
  });
});
