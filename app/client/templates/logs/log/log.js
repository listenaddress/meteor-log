Template.Log.helpers({
  owner: function () {
    var user = Meteor.users.findOne({_id: this.creatorId});
    return user;
  },

  log: function () {
    return Logs.findOne({});
  },

  joined: function () {
    var controller = Router.current();
    var logId = controller.params.logId;
    var member = Members.findOne({logId: logId, userId: Meteor.userId()});

    if (member) return true;
    else return false;
  }
});

Template.Log.events({
  'click .joinLog': function () {
    Meteor.call('joinLog', this._id,
      function (error, response) {
        if (error) throw error;
      }
    );
  },

  'click .leaveLog': function () {
    Meteor.call('leaveLog', this._id,
      function (error, response) {
        if (error) throw error;
      }
    );
  }
});
