Template.Note.events({
  'submit form#edit-note': function (e, tmpl) {
    e.preventDefault();

    var body = tmpl.find('textarea[name=body]').value;
    var id = this._id;

    Notes.update({_id: id}, {
      $set: {
        body: body,
        updatedAt: new Date
      }
    });

    Router.go('note', {_id: id});
  }
});

Template.Note.helpers({
  isMyNote: function () {
    return this.userId === Meteor.userId();
  },

  user: function () {
    var note = this;
    return Meteor.users.findOne({_id: note.userId});
  }
});
