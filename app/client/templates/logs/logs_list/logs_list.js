Template.LogsList.helpers({
  publicLogs: function () {
    return Logs.find({creatorId: Session.get('userOnPage'), privacy: 'public'});
  },

  privateLogs: function () {
    return Logs.find({privacy: 'private'});
  },

  isMe: function () {
    return this._id === Meteor.userId();
  }
});

Template.LogsList.onCreated(function () {
  var self = this;

  self.autorun(function () {
    var controller = Router.current();
    var user = Meteor.users.findOne({'username': controller.params.username});

    if (user) {
      var userId = user._id;
      Session.set('userOnPage', userId);
    }

    self.subscribe('userLogs', userId, function () {
      $('.loader').delay(1000).fadeOut('slow', function () {
        $('.loading-wrapper').fadeIn('slow');
      });
    });

    self.subscribe('privateUserLogs', function () {
      $('.loader').delay(1000).fadeOut('slow', function () {
        $('.loading-wrapper').fadeIn('slow');
      });
    });
  });
});

Template.LogsList.onRendered(function () {
  $('.loader').delay(750).fadeIn();
});
