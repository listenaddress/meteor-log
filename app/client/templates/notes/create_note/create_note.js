Template.CreateNote.events({
  'submit form': function (e, tmpl) {
    e.preventDefault();

    var body = tmpl.find('textarea[name=body]').value;

    Meteor.call('saveNote', {
      body: body
    });

    tmpl.find('form').reset();
  }
});
