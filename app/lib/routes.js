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

Router.route('/user/:_id', {
  name: 'user',
  controller: 'UserController',
  action: 'detail',
  where: 'client'
});
