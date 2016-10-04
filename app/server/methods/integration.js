Meteor.methods({
  'IntegrateService': function (logId, serviceType) {
    var obj = { logId: logId, serviceType: serviceType };
    var integration = Integrations.findOne({logId: logId, serviceType: serviceType});
    if (integration) return integration._id;

    return Integrations.insert(obj, function (error, response) {
      if (error) throw error;
      return response;
    });
  },

  'RemoveIntegration': function (logId, serviceType) {
    return Integrations.remove({logId: logId, serviceType: serviceType}, function (error, response) {
      if (error) throw error;
      return response;
    });
  }
});
