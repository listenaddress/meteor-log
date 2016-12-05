UserController = RouteController.extend({
  subscriptions: function () {
  },

  data: function () {
  },

  detail: function () {
    this.render('User', { /* data: {} */});
  },

  edit: function () {
    this.render('UserEdit');
  }
});
