/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/
import P from 'bluebird';

Meteor.methods({
  'saveNote': function (note) {
    note.userId = Meteor.userId();
    note.createdAt = new Date;

    if(note.userId) {
      return Notes.insert(note, function(error, response) {
        if (error) {
          console.log('error: ', error);
          throw error;
        } else {
          return response;
        }
      });
    }
  },
  'saveNow': function (item) {
    item.userId = Meteor.userId();
    item.createdAt = new Date;

    if(item.userId) {
      return Nows.insert(item, function(error, response) {
        if (error) {
          console.log('error: ', error);
          throw error;
        } else {
          Meteor.call('saveEvent', response, 'now_created', 'Nows');
          return response;
        }
      });
    }
  },
  'saveMessage': function (item) {
    item.userId = Meteor.userId();
    item.createdAt = new Date;

    if(item.userId) {
      return Messages.insert(item, function(error, response) {
        if (error) {
          console.log('error: ', error);
          throw error;
        } else {
          Meteor.call('saveEvent', response, 'message_created', 'Messages');
          return response;
        }
      });
    }
  },
  'saveEvent': function (id, type, refType) {
    var item = {
      userId: Meteor.userId(),
      type: type,
      createdAt: new Date
    };

    if (refType === 'Messages') {
      item.messageId = id;
    } else if (refType === 'Nows') {
      item.nowId = id;
    }

    if(item.userId) {
      return Events.insert(item, function(error, response) {
        if (error) {
          console.log('error: ', error);
          throw error;
        } else {
          return;
        }
      });
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
  },
  "userExists": function(username){
    return !!Meteor.users.findOne({username: username});
  },
  "getRepos": function() {
    // Query Github for users' repos
    // Save integration with repos
    var GitHub = require("github");

    var user = Meteor.user();
    var github = new GitHub({
      version: '3.0.0'
    });

    github.authenticate({
      type: "oauth",
      token: user.services.github.accessToken
    });

    github.repos.getAll({}, Meteor.bindEnvironment(function(error, response) {
      if (error) {
        console.log('error:', error);
      }

      if (response) {
        P.map(response, Meteor.bindEnvironment(function(item) {
          return _.pick(item, 'id', 'name', 'full_name', 'html_url');
        })).then(Meteor.bindEnvironment(function(items) {
          var integration = {
            service: 'github',
            repos: items
          };

          Meteor.call('saveIntegration', integration);
        }));
      }
    }));
  },
  'saveIntegration': function (item) {
    Integrations.remove({userId: Meteor.userId(), service: item.service});

    Integrations.upsert({
      userId: Meteor.userId(),
      service: item.service
    }, {
      $set: {
        repos: item.repos,
        createdAt: Date.now()
      }
    });
  }
});
