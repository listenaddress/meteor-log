Template.EventsList.helpers({
  user: function () {
    return Meteor.users.findOne(this.userId);
  },
  log: function () {
    return Logs.findOne(this.logId);
  },
  events: function () {
    var controller = Router.current();
    var params = controller.params;
    if (params.logId) {
      return Events.find({logId: params.logId});
    }

    return Events.find({});
  },
  message: function () {
    return Messages.findOne(this.messageId);
  },
  files: function () {
    return Files.find({messageId: this.messageId});
  },
  timestamp: function () {
    return moment(this.createdAt).fromNow();
  },
  creator: function () {
    return Meteor.users.findOne(this.creatorId);
  }
});

Template.EventsList.onCreated(function () {
  var self = this;

  self.autorun(function () {
    var controller = Router.current();
    var params = controller.params;
    if (params.username) {
      var user = Meteor.users.findOne({'username': controller.params.username});
      if (user) var userId = user._id;
      self.subscribe('userEvents', userId, function () {
        $('.loader').delay(1000).fadeOut('slow', function () {
          $('.loading-wrapper').fadeIn('slow');
        });
      });
    }
  });
});
