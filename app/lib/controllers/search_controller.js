SearchController = RouteController.extend({
  subscriptions: function () {
    this.subscribe('notifications', Meteor.userId());
  },

  data: function () {
    // return Logs.findOne({_id: this.params.logId});
  },

  search: function () {
    this.render('search');
  },

  edit: function () {
    this.render('editLog');
  }
});
