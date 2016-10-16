Template.LogsGrid.helpers({
  logs: function () {
    return Logs.find({creatorId: Session.get('userOnPage')});
  },

  members: function () {
    return Members.find({logId: this._id});
  },

  user: function () {
    return Meteor.users.findOne({_id: this.userId});
  },

  privateLogs: function () {
    return Logs.find({privacy: 'private'});
  },

  isMe: function () {
    return this._id === Meteor.userId();
  },

  userOnPage: function () {
    return Meteor.users.findOne({_id: Session.get('userOnPage')});
  },

  timestamp: function () {
    return moment(this.createdAt).fromNow();
  }
});

Template.LogsGrid.onCreated(function () {
  var self = this;

  self.autorun(function () {
    var controller = Router.current();
    var user = Meteor.users.findOne({'username': controller.params.username});

    if (user) {
      var userId = user._id;
      Session.set('userOnPage', userId);
    }

    self.subscribe('userLogs', Session.get('userOnPage'));
    self.subscribe('privateUserLogs', Meteor.userId());
    $('.contributors.contributor').popup();
  });
});

Template.LogsGrid.onRendered(function () {
});
