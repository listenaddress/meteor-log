Template.CreateMessage.onRendered(function () {
  Session.set('tagging', false);
});

Template.CreateMessage.events({
  'keypress textarea.message-input': function (e, tmpl) {
    if (e.which !== 13) return;
    e.preventDefault();
  },

  'keyup textarea.message-input': function (e, tmpl) {
    var message = tmpl.find('.message-input').value;
    if (!message) return;
    Session.set('message', message);
    var taggingUserPattern = /\B@[a-z0-9_-]+$/;
    var match = message.match(taggingUserPattern);
    if (match) {
      Session.set('usernameSearch', match);
      handleTagging();
    } else {
      Session.set('tagging', false);
    }

    // Handle user hitting return key to save message
    if (e.which !== 13) return;
    e.preventDefault();

    var controller = Router.current();
    var logId = controller.params.logId;
    var files = Session.get('files');

    Meteor.call('saveMessage', message, files, logId, function (error, response) {
      if (error) throw error;
      tmpl.find('.message-input').value = '';
      Session.set('tagging', false);
      Session.set('files', false);
      S3.collection.remove({});
      setTimeout(function () {
        window.scrollTo(0, 100000);
      }, 200);
    });

    function handleTagging () {
      var username = match[0].slice(1);
      var query = '.*' + username + '.*';
      Session.set('tagging', true);
      Session.set('loadingUsers', true);

      Meteor.subscribe('usersByUsername', query, function () {
        var users = Meteor.users.find({username: {$regex: query}}).fetch();
        Session.set('usersToTag', users);
        Session.set('loadingUsers', false);
      });
    }
  },

  'click .addIntegration': function (e, tmpl) {
    var controller = Router.current();
    Router.go('log.integrations', { logId: controller.params.logId });
  },

  // Handle user selecting a user from the tagging dropup
  'click .user-list li': function (e, tmpl) {
    var username = e.target.dataset.value;
    var message = tmpl.find('.message-input').value;
    var match = Session.get('usernameSearch');

    message = message.slice(0, -(match[0].length - 1));
    message += username;
    $('.message-input').focus().val('').val(message);

    Session.set('tagging', false);
  },

  'change .file_bag': function () {
    var files = $('input.file_bag')[0].files;

    S3.upload({
      files: files,
      path: ''
    }, function (error, response) {
      if (error) console.log('error', error);

      // Push new file onto the 'files' session variable
      var files = Session.get('files');
      if (!files || files.length < 1) files = [];
      files.push(response);
      Session.set('files', files);
    });
  }
});

Template.CreateMessage.helpers({
  loadingUsers: function () {
    return Session.get('loadingUsers');
  },
  usersToTag: function () {
    return Session.get('usersToTag');
  },
  tagging: function () {
    return Session.get('tagging');
  },
  files: function () {
    return S3.collection.find();
  },
  filesCount: function () {
    return S3.collection.find().count();
  }
});
