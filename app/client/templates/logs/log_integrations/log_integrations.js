Template.logIntegrations.events({
});

Template.logIntegrations.helpers({
  'services': function () {
    return Services.find({});
  },

  'connected': function () {
    return Integrations.findOne({ serviceType: this.type });
  },

  'log': function () {
    var controller = Router.current();
    return controller.params.logId;
  }
});

Template.logIntegrations.onCreated(function () {
  var self = this;
  self.autorun(function () {
    self.subscribe('services');
    var controller = Router.current();
    self.subscribe('integrations', controller.params.logId);
  });
});
