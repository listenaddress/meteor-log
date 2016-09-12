Template.LogsList.onCreated(function () {
  var self = this;
  self.autorun(function () {
    self.subscribe('logs');
  });
});

Template.LogsList.helpers({
  logs: function () {
    return Logs.find();
  }
});