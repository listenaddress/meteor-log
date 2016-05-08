Template.CommentsList.events({
  'submit form#new-comment': function (e, tmpl) {
    e.preventDefault();

    var form = tmpl.find('form');
    var body = tmpl.find('textarea[name=body]').value;
    var note = this;

    Meteor.call('saveComment', {
      body: body,
      noteId: note._id
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
