HomeController = RouteController.extend({
  subscriptions: function() {
    this.subscribe('notes');
    this.subscribe('users');
    this.subscribe('nows');
    this.subscribe('events');
  },

  data: function() {
    return Nows.find();
  },

  detail: function() {
    this.state.set('isEditing', false);
    console.log(this.state.keys);
    this.render('Home', { /* data: {} */});
  },

  listNows: function () {
    this.render('NowsList');
  }
});
