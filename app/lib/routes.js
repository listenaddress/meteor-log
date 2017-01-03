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

  Router.route('/signup', {
    name: 'signup',
    controller: 'UserController',
    action: 'signup',
    where: 'client',
    before: function () {
      if (Meteor.user()) {
        this.redirect('/');
      }
      this.next();
    }
  });

  Router.route('/signin', {
    name: 'signin',
    controller: 'UserController',
    action: 'signin',
    where: 'client',
    before: function () {
      if (Meteor.user()) {
        this.redirect('/');
      }
      this.next();
    }
  });

  Router.route('/notifications', {
    name: 'notifications',
    controller: 'LogController',
    action: 'notifications',
    where: 'client',
    before: function () {
      if (!Meteor.user()) {
        this.redirect('/');
      }
      this.next();
    }
  });

  Router.route('/search', {
    name: 'search',
    controller: 'LogController',
    action: 'search',
    where: 'client'
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
    action: 'messages',
    where: 'client'
  });

  Router.route('/log/:logId/messages', {
    name: 'log.messages',
    controller: 'LogController',
    action: 'messages',
    where: 'client'
  });

  Router.route('/log/:logId/about', {
    name: 'log.about',
    controller: 'LogController',
    action: 'about',
    where: 'client'
  });

  Router.route('/log/:logId/settings', {
    name: 'log.settings',
    controller: 'LogController',
    action: 'settings',
    where: 'client'
  });

  Router.route('/log/:logId/integrations', {
    name: 'log.integrations',
    controller: 'LogController',
    action: 'integrations',
    where: 'client'
  });

  Router.route('/log/:logId/integrations/:serviceType', {
    name: 'log.integration',
    controller: 'LogController',
    action: 'integration',
    where: 'client'
  });
}

if (Meteor.isServer) {
  Router.route('/integrations/trello/:hookId', { where: 'server' })
    .post(function () {
      var body = this.request.body;
      if (body && body.action && body.action.data) {
        Meteor.call('saveTrelloEvent',
                    body.action,
                    body.action.type,
                    this.params.hookId);
      } else {
        console.log('Ping from Trello but didn\'t recieve event data.');
      }

      this.response.end('Thanks Trello, we got your message!');
    });

  Router.route('/integrations/:logId/:_id', { where: 'server' })
    .post(function () {
      var user = Meteor.users.findOne({_id: this.params._id});
      Meteor.call('saveGitHubEvent', this.request.body, this.request.headers['x-github-event'], this.params.logId, function (error, response) {
        if (error) throw error;
      });
      this.response.end('allahu akbar, jah rastafari');
    });
}
