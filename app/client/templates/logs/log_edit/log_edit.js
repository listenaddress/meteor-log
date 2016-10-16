Template.LogEdit.helpers({
  log: function () {
    var controller = Router.current();
    if (controller.params.logId)
      return Logs.findOne({_id: controller.params.logId});
  }
});

Template.LogEdit.onRendered(function () {
  this.$('.menu a .item').tab();
});

Template.LogEdit.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var controller = Router.current();
    if (controller.params.logId) {
      self.subscribe('log', controller.params.logId);
    }
  });
});
