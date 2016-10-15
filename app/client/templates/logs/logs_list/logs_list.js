Template.LogsList.helpers({
  logs: function () {
    return Logs.find();
  },

  onPage: function () {
    var controller = Router.current();
    return this._id === controller.params.logId;
  }
});

Template.LogsList.onCreated(function () {
  var self = this;
  self.autorun(function () {
    self.subscribe('logs');
  });
});
