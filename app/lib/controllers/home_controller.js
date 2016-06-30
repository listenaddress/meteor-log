HomeController = RouteController.extend({
  subscriptions: function() {
    this.subscribe('notes');
    this.subscribe('users');
    this.subscribe('nows');
  }
});
