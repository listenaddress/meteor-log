Template.Now.events({
  'submit form#edit-now': function (e, tmpl) {
    e.preventDefault();

    var body = tmpl.$('div.froala-reactive-meteorized').froalaEditor('html.get', true);
    var id = this._id;

    Nows.update({_id: id}, {
      $set: {
        body: body,
        updatedAt: new Date
      }
    });

    Router.go('now.detail', {_id: id});
  }
});

Template.Now.helpers({
  isMyNow: function () {
    return this.userId === Meteor.userId();
  },

  timestamp: function () {
    var now = this;
    return moment(now.createdAt).fromNow();
  },

  user: function () {
    var now = this;
    return Meteor.users.findOne({_id: now.userId});
  },

  getContext: function () {
    var self = this;

    return {
      // Set html content
      _value: self.body,
      _keepMarkers: true,
      toolbarInline: true,
      initOnClick: false,
      tabSpaces: false,

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
