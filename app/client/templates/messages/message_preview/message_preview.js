Template.MessagePreview.helpers({
  timestamp: function () {
    var now = this;
    return moment(now.createdAt).format('LT');
  },
  user: function () {
    return Meteor.users.findOne({_id: this.userId}, {fields: {username: 1, profile: 1}});
  },
  editing: function () {
    return Session.get('editing');
  },
  editingText: function () {
    return Session.get('editingText');
  },
  editTagging: function () {
    return Session.get('editTagging');
  },
  usersToTag: function () {
    return Session.get('editUsersToTag');
  },
  loadingUsers: function () {
    return Session.get('editLoadingUsers');
  },
  home: function () {
    return !Router.current().params.logId;
  },
  log: function () {
    return Logs.findOne(Template.parentData(1).logId);
  },
  viewingLog: function () {
    var controller = Router.current();
    console.log('controller.params.logId', controller.params.logId);
    if (controller.params.logId) return true;
  }
});

Template.MessagePreview.events({
  'keyup textarea.edit-message-input': function (e, tmpl) {
    const content = tmpl.find('.edit-message-input').value;
    if (!content) return;
    // Session.set('message', message);
    const taggingUserPattern = /\B@[a-z0-9_-]+$/;
    const match = content.match(taggingUserPattern);
    if (match) {
      Session.set('editUsernameSearch', match);
      handleTagging();
    } else {
      Session.set('editTagging', false);
    }

    function handleTagging () {
      const username = match[0].slice(1);
      const query = '.*' + username + '.*';
      Session.set('editTagging', true);
      Session.set('editLoadingUsers', true);

      Meteor.subscribe('usersByUsername', query, function () {
        const users = Meteor.users.find({username: {$regex: query}}).fetch();
        Session.set('editUsersToTag', users);
        Session.set('editLoadingUsers', false);
      });
    }
  },

  // Handle user selecting a user from the tagging dropup
  'click .user-list li': function (e, tmpl) {
    var username = e.target.dataset.value;
    var message = tmpl.find('.edit-message-input').value;
    var match = Session.get('editUsernameSearch');

    message = message.slice(0, -(match[0].length - 1));
    message += username;
    $('.edit-message-input').focus().val('').val(message);
    Session.set('editTagging', false);
    Session.set('editLoadingUsers', false);
    Session.set('editUsernameSearch', false);
  }
});

Template.MessagePreview.onCreated(function () {
  var self = this;
  self.autorun(function () {
    self.subscribe('usersById', self.data.userId);
  });
});
