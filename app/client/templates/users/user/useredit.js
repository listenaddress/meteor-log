Template.editUser.helpers({
  isMe: function () {
    return this._id === Meteor.userId();
  },

  userProfile: function () {
    var controller = Router.current();
    return Meteor.users.findOne({'username': controller.params.username});
  }
});

Template.editUser.events({
  'click button.upload': function () {
    var files = $('input.file_bag')[0].files;

    S3.upload({
      files: files,
      path: ''
    }, function (error, response) {
      if (error) console.log('error', error);
      Meteor.call('updateUserPhoto', response);
    });
  },

  'click button.save': function (e, tmpl) {
    var user = { profile: {} };
    user.username = tmpl.find('input.username').value;
    user.profile.firstName = tmpl.find('input.first-name').value;
    user.profile.lastName = tmpl.find('input.last-name').value;
    user.profile.bio = tmpl.find('textarea.bio').value;

    Meteor.call('updateUserProfile', user, function (error) {
      if (error) throw error;
      Router.go('user', {username: user.username});
    });
  }
});
