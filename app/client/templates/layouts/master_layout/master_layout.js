var clearResults;

Template.EventsList.onRendered(function () {
  // Check if we're tagged in a new message. Play realtalk.mp3 if we are.
  var query = Notifications.find({userId: Meteor.userId(), unseen: true});

  // eslint-disable-next-line no-unused-vars
  var handle = query.observeChanges({
    added: function (id, notification) {
      if (notification.heard) return;
      var now = moment();
      var then = moment.utc(notification.createdAt);
      var diff = now.diff(then);
      if (diff > 20000) return;

      // Timeout is to make sure that how events and messages are populated
      setTimeout(function () {
        var event = Events.findOne(notification.eventId);
        if (!event) return;
        var message = Messages.findOne(event.messageId);
        if (!message) return;
        var usersTaggedPattern = /\B@[a-z0-9_-]+/g;
        var matches = message.content.match(usersTaggedPattern);
        if (!matches || matches.length < 1) return;

        _.map(matches, function (item) {
          var username = item.replace('@', '');
          var user = Meteor.users.findOne({username: username});
          if (!user || user._id !== Meteor.userId()) return;
          var audio = new Audio('/assets/realtalk.mp3');
          audio.play();
          Meteor.call('markNotificationAsHeard', id);
        });
      }, 100);
    }
  });
});

Template.MasterLayout.helpers({
  unseenNotifications: function () {
    return Notifications.find({userId: Meteor.userId(), unseen: true}).count();
  }
});

Template.MasterLayout.events({
  'click [data-logout]': function (e, tmpl) {
    Meteor.logout();
  },

  'click [data-login]': function (e, tmpl) {
    Meteor.loginWithMeteorDeveloperAccount();
  },

  'click .search-bar': function (e, tmpl) {
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
