Template.CreateMessage.events({
  'keypress textarea.message-input': function (e, tmpl) {
    console.log('e', e);
    if (e.which !== 13) return;
    e.preventDefault();

    var message = tmpl.find(".message-input").value;
    var controller = Router.current();
    var logId = controller.params.logId;

    Meteor.call('saveMessage', message, logId, function (error, response) {
      if (error) throw error;
      tmpl.find(".message-input").value = '';
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
  getContext: function () {
    return {
      // Set html content
      // _value: self.note,
      _keepMarkers: true,
      toolbarInline: true,
      initOnClick: false,
      tabSpaces: false,
      placeholderText: 'What are you working on now...?',

      // FE save.before event handler function:
      '_onsave.before': function (e, editor) {
        // var newHTML = editor.html.get(true /* keep_markers */);
        // Do something to update the edited value
        // if (!_.isEqual(newHTML, self.note.body)) {
        //   Meteor.call('saveNote', { body: newHTML })
        // }
        return false; // Stop Froala Editor from POSTing to the Save URL
      }
    }
  }
});
