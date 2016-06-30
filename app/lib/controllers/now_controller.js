NowController = RouteController.extend({
  subscriptions: function() {
    this.subscribe('now', this.params._id);
  },

  data: function() {
    return Nows.findOne({_id: this.params._id});
  },

  detail: function() {
    this.render('Now', { /* data: {} */});
  },

  edit: function () {
    this.state.set('isEditing', true);
    this.render('Now');
  }
});
