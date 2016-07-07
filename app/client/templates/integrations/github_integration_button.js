Template.GithubIntegrationButton.events({
  'click a#integrateGithub': function(e, t) {
    e.preventDefault();

    if (Meteor.user()) {
      Meteor.connectWith('github', {
        requestPermissions: ['user', 'repo', 'read:repo_hook']
      }, function(error) {
        if (error) {
          console.log('github login error:', error);
        }
      });
    }
  }
});
