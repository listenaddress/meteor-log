IntegrationController = RouteController.extend({
  subscriptions: function() {
    this.subscribe('integrations', Meteor.userId());
  },

  data: function() {
    return;
  },

  github: function() {
    this.render('GithubIntegration', { /* data: {} */});
  },

  groupGithub: function() {
    this.state.set('isGroup', true);
    this.render('GithubIntegration', { /* data: {} */});
  },

  evernote: function() {
    this.render('EvernoteIntegration', { /* data: {} */});
  },

  dashboard: function(){
    this.render('Integrations')
  },

  groupDashboard: function() {
    this.state.set('isGroup', true);
    console.log('this', this);
    this.render('Integrations', { /* data: {} */});
  },

  edit: function () {
    this.state.set('isEditing', true);
    this.render('Note');
  }
});
