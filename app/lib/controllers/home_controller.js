HomeController = RouteController.extend({
  subscriptions: function() {
  },

  data: function() {
  },

  detail: function() {
    this.state.set('isEditing', false);
    console.log(this.state.keys);
    this.render('Home', { /* data: {} */});
  },
});
