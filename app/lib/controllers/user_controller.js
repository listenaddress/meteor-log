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
  },

  signup: function () {
    this.render('SignUp');
  },

  signin: function () {
    this.render('SignIn');
  }
});
