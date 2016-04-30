UserController = RouteController.extend({
  subscriptions: function () {
    this.subscribe('user', this.params._id);
  },

  data: function () {
    return Meteor.users.findOne({_id: this.params._id});
  },

  detail: function () {
    this.render('User', { /* data: {} */});
  }
});
