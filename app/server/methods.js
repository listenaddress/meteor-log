/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/

Meteor.methods({
  'saveNote': function (note) {
    note.userId = Meteor.userId();
    note.createdAt = new Date;

    if(note.userId) {
      Notes.insert(note);
    }
  },
  'saveComment': function (comment) {
    // Save comment
    comment.userId = Meteor.userId();
    comment.createdAt = new Date;
    var commentId = Comments.insert(comment);
    comment._id = commentId;

    // Save notification for subscribers
    Meteor.call('saveNoteCommentNotifications', comment);
  },
  'saveNoteCommentNotifications': function (comment) {
    // Save commenter to the note's subscribers array
    var note = Notes.findOne(comment.noteId);
    if (!note.subscribers || note.subscribers.indexOf(comment.userId) < 0) {
      Notes.update(
        {_id: comment.noteId},
        {$push: { subscribers: comment.userId}}
      );

      if(!note.subscribers) {
        note.subscribers = [];
      }
      note.subscribers.push(comment.userId);
    }

    // Save a notification for all subscribers
    _.each(note.subscribers, function(subscriber) {
      Notifications.insert({
        userId: subscriber,
        noteId: note._id,
        commentId: comment._id,
        action: 'created',
        createdAt: new Date
      });
    })
  }
});
