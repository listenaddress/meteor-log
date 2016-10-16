NotificationController = RouteController.extend({
  subscriptions: function () {
  },

  data: function () {
    return Notifications.find({userId: Meteor.userId()});
  },

  detail: function () {
    this.render('NotificationsList', { /* data: {} */});
    var unseen = Notifications.find({userId: Meteor.userId(), unseen: true}).count();

    if (unseen > 0) Meteor.call('markNotificationsAsSeen');
  }
});
