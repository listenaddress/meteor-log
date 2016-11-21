SearchController = RouteController.extend({
  subscriptions: function () {
  },

  data: function () {
    // return Notifications.find({userId: Meteor.userId()});
  },

  search: function () {
    this.render('Search');
  }
});
