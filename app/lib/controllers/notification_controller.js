NotificationController = RouteController.extend({
  subscriptions: function () {
    this.subscribe('notifications', this.params._id);
  },

  data: function () {
    return Notifications.find({userId: this.params._id});
  },

  detail: function () {
    this.render('NotificationsList', { /* data: {} */});
  }
});
