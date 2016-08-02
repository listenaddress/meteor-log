GroupController = RouteController.extend({
  subscriptions: function () {
    this.subscribe('group', this.params._id);
  },

  data: function () {
    return Groups.findOne({_id: this.params._id});
  },

  detail: function () {
    this.render('Group', { /* data: {} */});
  },

  new: function () {
    this.render('createGroup');
  }
});
