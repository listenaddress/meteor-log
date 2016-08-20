Template.EventsList.helpers({
  user: function () {
    return Meteor.users.findOne(this.userId);
  },
  log: function () {
    return Logs.findOne(this.logId);
  },
  events: function () {
    return Events.find({});
  },
  now: function () {
    return Nows.findOne(this.nowId);
  },
  message: function () {
    return Messages.findOne(this.messageId);
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
  var controller = Router.current();

  var params = controller.params;

  self.autorun(function () {
    if (params.username) {
      var user = Meteor.users.findOne({"username":controller.params.username});

      if (user)
        var userId = user._id;

      self.subscribe('userEvents', userId, function () {
        $( ".loader" ).delay( 1000 ).fadeOut( 'slow', function () {
          $( ".loading-wrapper" ).fadeIn( 'slow' );
        });
      });
    }
    else if (params.logId) {

      self.subscribe('logEvents', params.logId, function () {
        $( ".loader" ).delay( 1000 ).fadeOut( 'slow', function () {
          $( ".loading-wrapper" ).fadeIn( 'slow' );
        });
      });
    }
    else if (params.groupId) {
      self.subscribe('groupEvents', params.groupId, function () {
        $( ".loader" ).delay( 1000 ).fadeOut( 'slow', function () {
          $( ".loading-wrapper" ).fadeIn( 'slow' );
        });
      });
    }
    else {
      self.subscribe('homeEvents', params.groupId, function () {
        $( ".loader" ).delay( 1000 ).fadeOut( 'slow', function () {
          $( ".loading-wrapper" ).fadeIn( 'slow' );
        });
      });
    }

  });
});
