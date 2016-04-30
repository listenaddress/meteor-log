Template.CreateNote.events({
  'submit form': function (e, tmpl) {
    e.preventDefault();

    var body = tmpl.find('textarea[name=body]').value;

    Notes.insert({
      body: body,
      createdAt: new Date,
      userId: Meteor.userId()
    });

    tmpl.find('form').reset();
  }
});
