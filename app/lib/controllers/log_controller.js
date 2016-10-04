LogController = RouteController.extend({
  subscriptions: function () {
    this.subscribe('notifications', Meteor.userId());
    this.subscribe('log', this.params.logId);
    var log = Logs.findOne({_id: this.params.logId});
    var controller = Router.current();
    if (log) {
      this.subscribe('userInfo', log.creatorId);
    }

    var params = controller.params;

    this.subscribe('members', controller.params.logId);
    this.subscribe('logEvents', params.logId, function () {
      $('.loader').delay(1000).fadeOut('slow', function () {
        $('.loading-wrapper').fadeIn('slow');
        $('.events-list').scrollTop(10000);
      });
    });
  },

  data: function () {
    return Logs.findOne({_id: this.params.logId});
  },

  detail: function () {
    this.render('Log', { /* data: {} */});
  },

  new: function () {
    this.render('createLog');
  },

  edit: function () {
    this.render('editLog');
  },

  integrations: function () {
    this.render('logIntegrations');
  }
});
