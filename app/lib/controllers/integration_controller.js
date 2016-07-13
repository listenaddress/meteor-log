IntegrationController = RouteController.extend({
  subscriptions: function() {
    this.subscribe('integrations', Meteor.userId());
  },

  data: function() {
    return;
  },

  detail: function() {
    this.render('GithubIntegration', { /* data: {} */});
  },

  dashboard: function(){
    this.render('Integrations')
  },

  edit: function () {
    this.state.set('isEditing', true);
    this.render('Note');
  }
});
