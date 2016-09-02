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
