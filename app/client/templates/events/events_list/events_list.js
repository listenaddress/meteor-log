Template.EventsList.helpers({
  user: function () {
    return Meteor.users.findOne(this.userId);
  },
  log: function () {
    return Logs.findOne(this.logId);
  },
  events: function () {
    var controller = Router.current();
    if (controller.params.logId) {
      return Events.find({logId: controller.params.logId});
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
  const self = this;
  self.autorun(function () {
    const controller = Router.current();
    if (controller.params.logId) {
      const handle = self.subscribe('logEvents', controller.params.logId, function () {
        setTimeout(function () {
          window.scrollTo(0, 100000);
        }, 0);
      });

      const isReady = handle.ready();
      if (isReady) {
        const query = Events.find({logId: controller.params.logId});
        query.observeChanges({
          added: function (id, user) {
            // If the user scroll is near the bottom, scroll down to show new message
            const scrollTop = $(window).scrollTop();
            const windowHeight = $(window).height();
            const documentHeight = $(document).height();

            if ((scrollTop + windowHeight + 50) >= documentHeight) {
              setTimeout(function () {
                window.scrollTo(0, 100000);
              }, 300);
            }
          }
        });
      }
    }
  });
});
