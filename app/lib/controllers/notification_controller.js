NotificationController = RouteController.extend({
  subscriptions: function () {
    this.subscribe('notifications', Meteor.userId());
  },

  data: function () {
    return Notifications.find({userId: Meteor.userId()});
  },

  detail: function () {
    this.render('NotificationsList', { /* data: {} */});
  }
});
