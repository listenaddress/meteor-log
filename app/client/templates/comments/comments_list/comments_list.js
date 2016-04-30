Template.CommentsList.events({
  'submit form#new-comment': function (e, tmpl) {
    e.preventDefault();

    var note = this;
    var body = tmpl.find('textarea[name=body]').value;
    var form = tmpl.find('form');

    Comments.insert({
      noteId: note._id,
      createdAt: new Date,
      userId: Meteor.userId(),
      body: body
    });

    form.reset();
  }
});

Template.CommentsList.helpers({
  comments: function () {
    var note = this;
    return Comments.find({noteId: note._id}, {
      sort: {createdAt: -1}
    });
  },

  user: function () {
    var note = this;
    return Meteor.users.findOne({_id: note.userId});
  },

  timestamp: function () {
    var comment = this;
    return moment(comment.createdAt).fromNow();
  }
});
