Template.CreateMessage.events({
  'click .save': function (e, tmpl) {
    e.preventDefault();
    var content = tmpl.$('div.froala-reactive-meteorized').froalaEditor('html.get', true);

    var controller = Router.current();
    var logId = controller.params.logId;

    Meteor.call('saveMessage', content, logId, function (error, response) {
      if (error) throw error;
      tmpl.$('div.froala-reactive-meteorized').froalaEditor('html.set', '');
    });
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
