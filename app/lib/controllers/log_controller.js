LogController = RouteController.extend({
  subscriptions: function () {
    this.subscribe('log', this.params.logId);
  },

  data: function () {
    return Logs.findOne({_id: this.params.logId});
  },

  detail: function () {
    this.render('Log', { /* data: {} */});
  },

  new: function () {
    this.render('createLog');
  }
});
