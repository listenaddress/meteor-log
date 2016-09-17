Template.EventsList.onRendered(function () {
  setTimeout(function () {
    var query = Notifications.find({userId: Meteor.userId(), unseen: true});
    var count = Notifications.find({userId: Meteor.userId(), unseen: true}).count();

    // eslint-disable-next-line no-unused-vars
    var handle = query.observeChanges({
      // Check if we're tagged in a new message. Play realtalk.mp3 if we are.
      added: function (id, notification) {
        var newCount = Notifications.find({userId: Meteor.userId(), unseen: true}).count();
        if (newCount <= count) return;

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
            if (user._id !== Meteor.userId()) return;
            var audio = new Audio('/assets/realtalk.mp3');
            audio.play();
          });
        }, 300);
      }
    });
  }, 5000);
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
  }
});
