Template.Home.onCreated(function () {
  var self = this;
  self.autorun(function () {
  });
});

Template.Home.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var controller = Router.current();
    var user = Meteor.users.findOne({'username': controller.params.username});
    if (user) var userId = user._id;
    self.subscribe('homeEvents', userId, function () {
      $('.loader').delay(1000).fadeOut('slow', function () {
        $('.loading-wrapper').fadeIn('slow');
      });
    });
  });
});
