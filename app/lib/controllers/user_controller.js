UserController = RouteController.extend({
  subscriptions: function () {
    this.subscribe('user', this.params.username);
  },

  data: function () {
    return Meteor.users.findOne({username: this.params.username});
  },

  detail: function () {
    this.render('User', { /* data: {} */});
  }
});
