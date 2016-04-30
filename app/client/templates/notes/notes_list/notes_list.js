Template.NotesList.events({
});

Template.NotesList.helpers({
  notes: function () {
    return Notes.find({}, {
      sort: { createdAt: -1}
    });
  },

  isPrivateClass: function () {
    return this.ispublic ? 'public' : '';
  }
});
