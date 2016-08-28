Template.logIntegration.helpers({
  'service': function () {
    return Services.findOne({});
  },

  'connected': function () {
    return Integrations.findOne();
  }
});

Template.logIntegration.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var controller = Router.current();
    self.subscribe('service', controller.params.serviceType);
    self.subscribe('integration', controller.params.logId, controller.params.serviceType);
  });
});
