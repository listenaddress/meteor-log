if (Meteor.isClient) {
  Router.configure({
    layoutTemplate: 'MasterLayout',
    loadingTemplate: 'Loading',
    notFoundTemplate: 'NotFound'
  });

  Router.route('/', {
    name: 'home',
    controller: 'HomeController',
    where: 'client'
  });

  Router.route('/integrations/', {
    name: 'integration',
    controller: 'IntegrationController',
    action: 'dashboard',
    where: 'client'
  });

  Router.route('/integrations/github', {
    name: 'integration.github',
    controller: 'IntegrationController',
    action: 'github',
    where: 'client'
  });

  Router.route('/integrations/evernote', {
    name: 'integration.evernote',
    controller: 'IntegrationController',
    action: 'evernote',
    where: 'client'
  });

  Router.route('/account', {
    name: 'account',
    before: function () {
      if (Meteor.user()) {
        this.redirect('/');
      } else {
        this.render('account');
      }
    }
  });

  Router.route('/:username', {
    name: 'user',
    controller: 'UserController',
    action: 'detail',
    where: 'client'
  });

  Router.route('/:username/edit', {
    name: 'user.edit',
    controller: 'UserController',
    action: 'edit',
    where: 'client'
  });

  Router.route('/log/new/', {
    name: 'log.new',
    controller: 'LogController',
    action: 'new',
    where: 'client'
  });

  Router.route('/log/:logId', {
    name: 'log',
    controller: 'LogController',
    action: 'detail',
    where: 'client'
  });

  Router.route('/log/:logId/edit', {
    name: 'log.edit',
    controller: 'LogController',
    action: 'edit',
    where: 'client'
  });

  Router.route('/log/:logId/integrations', {
    name: 'log.integrations',
    controller: 'LogController',
    action: 'integrations',
    where: 'client'
  });
}

if (Meteor.isServer) {
  Router.route('/integrations/:userId', { where: 'server' })
    .post(function () {
      var user = Meteor.users.findOne({_id: this.params.userId});
      if (this.request.body.sender.id === user.services.github.id) {
        Meteor.call('saveGitHubEvent', this.request.body, this.request.headers['x-github-event'], user._id)
      }

      this.response.end('Thanks Github, we got your message!');
    });
}
