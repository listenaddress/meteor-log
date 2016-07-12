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

  Router.route('/now', {
    name: 'now.list',
    controller: 'HomeController',
    action: 'listNows',
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

  Router.route('/now/:_id', {
    name: 'now.detail',
    controller: 'NowController',
    action: 'detail',
    where: 'client'
  });

  Router.route('/now/:_id/edit', {
    name: 'now.edit',
    controller: 'NowController',
    action: 'edit',
    where: 'client'
  });

  Router.route('/integration/github', {
    name: 'integration.github',
    controller: 'IntegrationController',
    action: 'detail',
    where: 'client'
  });

  Router.route('/account', {
    before: function () {
      console.log('yo');
       if (Meteor.user()) {
         this.redirect('/');
       }
       else{
         this.render('account');
       }
   },
    name: 'account'
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

  Router.route('/:username/now/', {
    name: 'user.nowhistory',
    controller: 'NowController',
    action: 'nowhistory',
    where: 'client'
  });


}

// Router.route('/user/:_id/notifications', {
//   name: 'notifications',
//   controller: 'NotificationController',
//   action: 'detail',
//   where: 'client'
// });

Router.route( "/integrations/:integrationId", { where: "server" } )
  .post(function() {
    console.log(this.request.body);
    this.response.end('yo yo');
  });