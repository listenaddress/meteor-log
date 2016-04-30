Meteor.publish('notes', function () {
  return Notes.find();
});

Meteor.publish('note', function (id) {
  var note = Notes.findOne({_id: id});
  return [
    Meteor.users.find({_id: note.userId}, {fields: {profile: 1}}),
    Notes.find({_id: id}),
    Comments.find({noteId: id}, {sort: {createdAt: -1}})
  ];
});

Meteor.publish('users', function () {
  return Meteor.users.find({}, {fields: { profile: 1 }});
});

Meteor.publish('user', function (userId) {
  if (!this.userId) return this.ready();

  return [
    Meteor.users.find({_id: userId}, {fields: {profile: 1}}),
    Notes.find({userId: userId})
  ];
});
