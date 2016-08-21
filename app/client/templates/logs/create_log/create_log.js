Template.createLog.helpers({
  isMe: function () {
    return this._id === Meteor.userId();
  }
});

Template.createLog.events({
  'submit form': function (event) {
    event.preventDefault();
    var logName = event.target.logName.value;
    var logPrivacy = event.target.privacy.value;

    Meteor.call('saveLog', {
      name: logName,
      privacy: logPrivacy
    }, function (error, response) {
      if (error) throw error
      Router.go('/log/' + response);
    });
  }
});
