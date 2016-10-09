Template.editUser.helpers({
  isMe: function () {
    return this._id === Meteor.userId();
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
    var user = { profile: {}};
    user.username = tmpl.find('input.username').value;
    user.profile.firstName = tmpl.find('input.first-name').value;
    user.profile.lastName = tmpl.find('input.last-name').value;

    Meteor.call('updateUserProfile', user);
  }
});
