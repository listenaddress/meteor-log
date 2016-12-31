var clearResults;

Template.SearchBar.helpers({
  searching: function () {
    var route = Router.current().route.getName();
    return route === 'search';
  }
});


Template.SearchBar.events({
  'click .search.icon': function (e, tmpl) {
    Router.go('search');
  },

  'keyup input.search-bar': function (e, tmpl) {
    var text = tmpl.find('.search-bar').value;
    if (!text || text === '') return clearResults();
    var query = '.*' + text + '.*';

    Meteor.subscribe('usersByUsername', query, function () {
      var users = Meteor.users.find({username: {$regex: query, $options: 'i'}}).fetch();
      Session.set('users', users);
    });

    Meteor.subscribe('messagesByText', query, function () {
      var messages = Messages.find({content: {$regex: query, $options: 'i'}}).fetch();
      Session.set('messages', messages);
    });

    Meteor.subscribe('logsByName', query, function () {
      var logs = Logs.find({name: {$regex: query, $options: 'i'}}).fetch();
      Session.set('logs', logs);
    });
  }
});

clearResults = function () {
  Session.set('users', null);
  Session.set('logs', null);
  Session.set('messages', null);
};
