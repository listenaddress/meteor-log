NoteController = RouteController.extend({
  subscriptions: function() {
    this.subscribe('note', this.params._id);
  },

  data: function() {
    return Notes.findOne({_id: this.params._id});
  },

  detail: function() {
    this.render('Note', { /* data: {} */});
  },

  edit: function () {
    this.state.set('isEditing', true);
    this.render('Note');
  }
});
