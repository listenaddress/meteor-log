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

  Router.route('/note/:_id', {
    name: 'note',
    controller: 'NoteController',
    action: 'detail',
    where: 'client'
  });

  Router.route('/note/:_id/edit', {
    name: 'note.edit',
    controller: 'NoteController',
    action: 'edit',
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

  // Router.onBeforeAction(function() {
  //     if (!Meteor.user())
  //         this.redirect('/account');
  // }, {except: ['account', 'home', 'user']});

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

  Router.route('/:username/now/:_id', {
    name: 'user.nowhistory',
    controller: 'NowController',
    action: 'nowhistory',
    where: 'client'
  });

  Router.route('/group/new/', {
    name: 'group.new',
    controller: 'GroupController',
    action: 'new',
    where: 'client'
  });

  Router.route('/group/:groupId', {
    name: 'group',
    controller: 'GroupController',
    action: 'detail',
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

  Router.route('group/:groupId/integrations/', {
    name: 'group.integration',
    controller: 'IntegrationController',
    action: 'groupDashboard',
    where: 'client'
  });

  Router.route('group/:groupId/integrations/github', {
    name: 'group.integration.github',
    controller: 'IntegrationController',
    action: 'groupGithub',
    where: 'client'
  });
}

// Router.route('/user/:_id/notifications', {
//   name: 'notifications',
//   controller: 'NotificationController',
//   action: 'detail',
//   where: 'client'
// });

if (Meteor.isServer) {
  Router.route('/integrations/:userId', { where: 'server' })
    .post(function () {
      var user = Meteor.users.findOne({_id: this.params.userId});
      if (this.request.body.sender.id === user.services.github.id) {
        Meteor.call('saveGitHubEvent', this.request.body, this.request.headers['x-github-event'], user._id)
      }

      this.response.end('yo yo');
    });

  Router.route('/integrations/group/:groupId', { where: 'server' })
    .post(function () {
      var group = Groups.findOne({_id: this.params.groupId});

      if (group._id) {
        Meteor.call('saveGitHubEvent', this.request.body, this.request.headers['x-github-event'], null, group._id);
        this.response.end('yo yo');
      }
    });
}
