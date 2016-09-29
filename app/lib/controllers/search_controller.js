SearchController = RouteController.extend({
  subscriptions: function () {
    this.subscribe('notifications', Meteor.userId());
  },

  data: function () {
    // return Notifications.find({userId: Meteor.userId()});
  },

  search: function () {
    this.render('Search');
  }
});
