Template.GithubIntegrationButton.events({
  'click a#integrateGithub': function(e, t) {
    e.preventDefault();

    if (Meteor.user()) {
      Meteor.connectWith('github', {
        requestPermissions: ['repo']
      }, function(error) {
        if (error) {
          console.log('github login error:', error);
        }

        Meteor.call('getRepos');
        Router.go('/integration/github');
      });
    }
  }
});
