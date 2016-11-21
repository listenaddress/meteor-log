Template.Menu.helpers({
  unseenNotifications: function () {
    return Notifications.find({userId: Meteor.userId(), unseen: true}).count();
  },

  hasNotifications: function () {
    return Notifications.find({userId: Meteor.userId(), unseen: true}).count() > 0;
  }
});

Template.Menu.events({
  'click [data-logout]': function (e, tmpl) {
    Meteor.logout();
  },

  'click [data-login]': function (e, tmpl) {
    Meteor.loginWithMeteorDeveloperAccount();
  }
});

Template.Menu.onRendered(function () {
  $('.master-layout').delegate('.dropdown', 'click', function (event) {
    $('.ui.dropdown').dropdown({
      action: 'nothing',
      on: 'click',
      keepOnScreen: true
    });
  });

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

Template.Menu.onCreated(function () {
  var self = this;
  self.autorun(function () {
    self.subscribe('unseenNotifications', Meteor.userId());
  });
});
