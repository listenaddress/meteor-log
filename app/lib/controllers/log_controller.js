LogController = RouteController.extend({
  subscriptions: function () {
    this.subscribe('log', this.params.logId);
    var log = Logs.findOne({_id: this.params.logId});
    if (log) {
      this.subscribe('userInfo', log.creatorId);
    }
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
  }
});
