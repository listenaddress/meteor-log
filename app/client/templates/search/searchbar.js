var clearResults;

Template.SearchBar.helpers({
  searching: function () {
    return Session.get('searching');
  },
  query: function () {
    return Session.get('query');
  },
  users: function () {
    return Session.get('users');
  },
  logs: function () {
    return Session.get('logs');
  },
  onSearchPage: function () {
    return Router.current().route.getName() === 'search';
  },
});


Template.SearchBar.events({
  'click .search.icon': function (e, tmpl) {
    Session.set('searching', true);
  },

  'click .dropdown .menu .item': function (e, tmpl) {
    console.log('here');
    Session.set('searching', false);
    Session.set('query', false);
  },

  'click .dropdown .menu a': function (e, tmpl) {
    console.log('here');
    Session.set('searching', false);
    Session.set('query', false);
  },

  'keyup input.search-bar': function (e, tmpl) {
    var text = tmpl.find('.search-bar').value;
    if (!text || text === '') {
      Session.set('query', false);
      return clearResults();
    }
    var query = '.*' + text + '.*';
    Session.set('query', text);

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

Template.SearchBar.onCreated(function () {
  Session.set('searching', null);
  Session.set('query', null);
  Session.set('users', null);
  Session.set('logs', null);
  Session.set('messages', null);
});

clearResults = function () {
  Session.set('users', null);
  Session.set('logs', null);
  Session.set('messages', null);
};
