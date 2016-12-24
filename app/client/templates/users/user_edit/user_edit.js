Template.UserEdit.onCreated(function () {
  this.lastError = new ReactiveVar(null);
});

Template.UserEdit.helpers({
  isMe: function () {
    return this._id === Meteor.userId();
  },

  userProfile: function () {
    var controller = Router.current();
    return Meteor.users.findOne({'username': controller.params.username});
  },

  uploadedUserPhoto: function () {
    return Session.get('uploadedUserPhoto');
  },

  errorMessage: function () {
    return Template.instance().lastError.get();
  },
});

Template.UserEdit.events({
  'change .file_bag': function (e, tmpl) {
    var file = $('input.file_bag')[0].files;
    if (!file[0]) return;
    if (file[0].size > 1000000) {
      return tmpl.lastError.set('For now, profile pictures can\'t be larger than 1MB.');
    }

    S3.upload({
      files: file,
      path: ''
    }, function (error, response) {
      if (error) console.log('error', error);
      Session.set('uploadedUserPhoto', response);
      S3.collection.remove({});
      tmpl.lastError.set(null);
    });
  },

  'click button.save': function (e, tmpl) {
    var user = { profile: {} };
    user.username = tmpl.find('input.username').value;
    user.profile.firstName = tmpl.find('input.first-name').value;
    user.profile.lastName = tmpl.find('input.last-name').value;
    user.profile.bio = tmpl.find('textarea.bio').value;
    var photo = Session.get('uploadedUserPhoto');
    if (photo) user.photo = photo;

    Meteor.call('updateUserProfile', user, function (error) {
      if (error) throw error;

      Session.set('uploadedUserPhoto', '');
      Router.go('user', {username: user.username});
    });
  }
});
