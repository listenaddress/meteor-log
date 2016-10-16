IntegrationController = RouteController.extend({
  subscriptions: function () {
  },

  data: function () {
    return;
  },

  github: function () {
    this.render('GithubIntegration', { /* data: {} */});
  },

  evernote: function () {
    this.render('EvernoteIntegration', { /* data: {} */});
  },

  dashboard: function () {
    this.render('Integrations')
  },

  edit: function () {
    this.state.set('isEditing', true);
    this.render('Note');
  }
});
