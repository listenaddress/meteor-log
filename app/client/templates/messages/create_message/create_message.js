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
    var taggingUserPattern = /\B@$|\B@[a-z0-9_-]+$/;

    return message.match(taggingUserPattern);
  }
});
