HomeController = RouteController.extend({
  subscriptions: function () {
    this.subscribe('notifications', Meteor.userId());
  },

  data: function () {
  },

  detail: function () {
    this.state.set('isEditing', false);
    console.log(this.state.keys);
    this.render('Home', { /* data: {} */});
  }
});
