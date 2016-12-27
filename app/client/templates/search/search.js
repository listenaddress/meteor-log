Template.Search.helpers({
  users: function () {
    return Session.get('users');
  },

  logs: function () {
    return Session.get('logs');
  },

  messages: function () {
    return Session.get('messages');
  }
});
