Template.LogIntegration.helpers({
  'service': function () {
    return Services.findOne({});
  },

  'connected': function () {
    return Integrations.findOne();
  },

  log: function () {
    var controller = Router.current();
    if (controller.params.logId)
      return Logs.findOne({_id: controller.params.logId});
  }
});

Template.LogIntegration.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var controller = Router.current();
    self.subscribe('service', controller.params.serviceType);
    self.subscribe('integration', controller.params.logId, controller.params.serviceType);
  });
});
