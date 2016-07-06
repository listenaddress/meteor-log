Template.CreateMessage.events({
  'click .save': function (e, tmpl) {
    e.preventDefault();
    var content = tmpl.$('div.froala-reactive-meteorized').froalaEditor('html.get', true);

    Meteor.call('saveMessage', {
      content: content
    }, function(error, response) {
      if (error) {
        console.log('error: ', error);
      } else {
        tmpl.$('div.froala-reactive-meteorized').froalaEditor('html.set', '');
      }
    });
  }
});


Template.CreateMessage.helpers({
  getContext: function () {
    var self = this;

    return {
      // Set html content
      // _value: self.note,
      _keepMarkers: true,
      toolbarInline: true,
      initOnClick: false,
      tabSpaces: false,
      placeholderText: 'What are you working on now...?',

      // FE save.before event handler function:
      "_onsave.before": function (e, editor) {
        var newHTML = editor.html.get(true /* keep_markers */);
        // Do something to update the edited value
        // if (!_.isEqual(newHTML, self.note.body)) {
        //   Meteor.call('saveNote', { body: newHTML })
        // }
        return false; // Stop Froala Editor from POSTing to the Save URL
      },
    }
  }

});
