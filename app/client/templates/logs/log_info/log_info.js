Template.LogInfo.helpers({
  log: function () {
    var controller = Router.current();
    if (controller.params.logId)
      return Logs.findOne({_id: controller.params.logId});
  },

  joined: function () {
    var controller = Router.current();
    var logId = controller.params.logId;
    var member = Members.findOne({logId: logId, userId: Meteor.userId()});

    if (member) return true;
    else return false;
  }
});

Template.LogInfo.events({
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
  },

  'click .toggle-menu': function () {
    $('.ui.sidebar')
      .sidebar({
        overlay: true
      })
      .sidebar('toggle')
    ;
  }
});

Template.LogInfo.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var controller = Router.current();
    if (controller.params.logId) {
      self.subscribe('members', controller.params.logId);
      self.subscribe('log', controller.params.logId);
    }
  });
});
