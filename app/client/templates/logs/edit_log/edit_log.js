Template.editLog.helpers({

});

Template.editLog.events({
  'click .dropdown': function () {
    $('.selection.dropdown').dropdown();
  },

  'submit form': function (event) {
    event.preventDefault();
    var logName = event.target.logName.value;
    var logId = this._id;

    Meteor.call('updateLog', logId, {
      name: logName
    }, function (error, response) {
      if (error) throw error;
      Router.go('log', {logId: logId});
    });
  },

  'click .deleteLog': function () {
    Meteor.call('deleteLog', this._id,
      function (error, response) {
        if (error) throw error;
        Router.go('home');
      });
  }
});
