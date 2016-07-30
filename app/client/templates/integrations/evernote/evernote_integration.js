Template.EvernoteIntegration.onCreated(function() {
  this.lastError = new ReactiveVar(null);
});

Template.EvernoteIntegration.helpers({
  integration: function() {
    return Integrations.findOne({service: 'evernote'});
  },
  errorMessage: function() {
    return Template.instance().lastError.get();
  }
});

Template.EvernoteIntegration.onRendered(function(){

});

Template.EvernoteIntegration.events({

});
