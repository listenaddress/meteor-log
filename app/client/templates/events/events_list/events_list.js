let editMessage;

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
    return moment(this.createdAt).format('LT');
  },
  creator: function () {
    return Meteor.users.findOne(this.creatorId);
  },
  hovering: function () {
    return Session.get('hovering');
  },
  editing: function () {
    return Session.get('editing');
  },
});

Template.EventsList.events({
  'mouseover .comment': function (e, tmpl) {
    Session.set('hovering', e.currentTarget.dataset.value);
  },
  'mouseout .comment': function (e, tmpl) {
    Session.set('hovering', false);
  },
  'mouseover .edit': function (e, tmpl) {
    Session.set('hovering', e.currentTarget.dataset.value);
  },
  'mouseout .edit': function (e, tmpl) {
    Session.set('hovering', false);
  },
  'click .edit': function (e, tmpl) {
    const message = Messages.findOne({_id: e.currentTarget.dataset.value});
    const cleanText = message.content.replace(/<\/?[^>]+(>|$)/g, "");
    Session.set('editingText', cleanText);
    Session.set('editing', e.currentTarget.dataset.value);
    Session.set('editTagging', false);
    Session.set('usernameSearch', false);
  },
  'click .save': function (e, tmpl) {
    const content = tmpl.find('.edit-message-input').value;
    const _id = Session.get('editing');
    editMessage({_id: _id, content: content}, tmpl);
  },
});


Template.EventsList.onCreated(function () {
  Session.set('editing', false);
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

editMessage = function (message, tmpl) {
  Meteor.call('editMessage', message, function (error, response) {
    if (error) return;
    Session.set('editing', false);
    Session.set('editTagging', false);
    Session.set('usernameSearch', false);
  });
};
