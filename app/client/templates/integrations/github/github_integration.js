Template.GithubIntegration.helpers({
  integration: function() {
    return Integrations.findOne({service: 'github'});
  }
});

Template.GithubIntegration.onRendered(function(){
  this.$(".dropdown").dropdown();
});

Template.GithubIntegration.events({
  'click .save': function(e, tmpl) {
    e.preventDefault();

    if (Meteor.user()) {
      var value = tmpl.$('.dropdown').dropdown('get value');
      var integration = Integrations.findOne({service: 'github'});
      var repo = integration.repos.filter(function(item) {
        return item.id == value[0];
      });

      Meteor.call('addRepoHook', repo[0]);
    }
  }
});
