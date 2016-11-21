Template.FeaturedLogs.helpers({
  logs: function () {
    return Logs.find({});
  },

  members: function () {
    return Members.find({logId: this._id});
  },

  user: function () {
    return Meteor.users.findOne({_id: this.userId});
  },

  userOnPage: function () {
    return Meteor.users.findOne({_id: Session.get('userOnPage')});
  },

  timestamp: function () {
    return moment(this.createdAt).fromNow();
  }
});

Template.FeaturedLogs.onCreated(function () {
  var self = this;

  self.autorun(function () {
    self.subscribe('featuredLogs', Meteor.userId());
  });
});

Template.FeaturedLogs.onRendered(function () {
});
