Template.EvernoteIntegrationButton.events({
  'click .integrateEvernote': function (e, t) {
    e.preventDefault();
    if (Meteor.user()) {
      Meteor.connectWith('evernote', {

      }, function (error) {
        if (error) {
          t.lastError.set(error.error);
        } else {
          Router.go('/integrations/evernote');
        }
      })
    }
  }
});

Template.EvernoteIntegrationButton.helpers({
  errorMessage: function () {
    return Template.instance().lastError.get();
  }
});

Template.EvernoteIntegrationButton.onCreated(function () {
  var self = this;
  self.lastError = new ReactiveVar(null);
  self.autorun(function () {
    self.subscribe('githubintegrated');
  });
});
