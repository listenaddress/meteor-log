GroupController = RouteController.extend({
  subscriptions: function () {
    this.subscribe('group', this.params.groupId);
  },

  data: function () {
    return Groups.findOne({_id: this.params.groupId});
  },

  detail: function () {
    this.render('Group', { /* data: {} */});
  },

  new: function () {
    this.render('createGroup');
  }
});
