Template.GithubIntegration.helpers({
  integration: function() {
    return Integrations.findOne({service: 'github'});
  }
});

Template.GithubIntegration.onRendered(function(){
  this.$(".dropdown").dropdown();
});
