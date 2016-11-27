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
          $('.events-list').scrollTop(100000);
        }, 0);
      });

      const isReady = handle.ready();
      if (isReady) {
        const query = Events.find({logId: controller.params.logId});
        query.observeChanges({
          added: function (id, user) {
            // If the user scroll is near the bottom, scroll down to show new message
            const elem = $('.events-list');
            const scrollTop = elem.scrollTop();
            const innerHeight = elem.innerHeight();
            const scrollHeight = elem[0].scrollHeight;

            if ((scrollTop + innerHeight + 50) >= scrollHeight) {
              setTimeout(function () {
                $('.events-list').scrollTop(100000);
              }, 300);
            }
          },
        });
      }
    }
  });
});
