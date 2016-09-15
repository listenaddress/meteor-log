Template.CreateMessage.events({
  'keyup textarea.message-input': function (e, tmpl) {
    var message = tmpl.find('.message-input').value;
    Session.set('message', message);
    if (e.which !== 13) return;
    e.preventDefault();

    var message = tmpl.find(".message-input").value;
    var controller = Router.current();
    var logId = controller.params.logId;

    Meteor.call('saveMessage', message, logId, function (error, response) {
      if (error) throw error;
      tmpl.find('.message-input').value = '';
      setTimeout(function() {
        $('.events-list').scrollTop(100000);
      }, 200);
    });
  },

  'click .addIntegration': function (e, tmpl) {
    var controller = Router.current();
    Router.go('log.integrations', { logId: controller.params.logId });
  }
});

Template.CreateMessage.helpers({
  tagging: function () {
    var message = Session.get('message');
    if (!message) return;
    var taggingUserPattern = /\B@[a-z0-9_-]+$/;
    var match = message.match(taggingUserPattern);
    if (!match) return;

    var username = match[0].slice(1);
    var query = '.*' + username + '.*';
    Session.set('loadingUsers', true);
    Meteor.subscribe('usersByUsername', query, function () {
      var users = Meteor.users.find({username: {$regex: query}}).fetch();
      Session.set('usersToTag', users);
      Session.set('loadingUsers', false);
    });

    return match;
  },
  loadingUsers: function () {
    return Session.get('loadingUsers');
  },
  usersToTag: function () {
    return Session.get('usersToTag');
  }
});
