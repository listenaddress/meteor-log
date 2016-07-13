Template.GithubIntegrationButton.events({
  'click a#integrateGithub': function(e, t) {
    e.preventDefault();

    if (Meteor.user()) {
      Meteor.connectWith('github', {
        requestPermissions: ['repo']
      }, function(error) {
        if (error) {
          t.lastError.set(error.error);
          console.log(error);
        }
        else{
          Meteor.call('getRepos');
          Router.go('/integrations/github');
        }
      })
    }
  }
});


Template.GithubIntegrationButton.helpers({
  errorMessage: function() {
    return Template.instance().lastError.get();
  }
});

Template.GithubIntegrationButton.onCreated(function() {

    var self = this; 
    self.lastError = new ReactiveVar(null);
    self.autorun(function(){  
    self.subscribe('githubintegrated');
  }); 

});




