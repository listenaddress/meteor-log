Template.trelloDropdown.onRendered(function () {
  console.log('drop', this.$('.dropdown'));
  this.$('.dropdown').dropdown();
});

Template.trelloDropdown.onCreated(function () {
  var self = this;
  self.lastError = new ReactiveVar(null);
  self.autorun(function () {
    var controller = Router.current();
    self.subscribe('userService', controller.params.serviceType);
  });
});

Template.trelloDropdown.helpers({
  'organization': function () {
    var id = this.idOrganization;
    var user = Meteor.user();
    return user.services.trello.organizations.find(function (item) {
      return item.id === id;
    });
  }
});

Template.Trello.helpers({
  errorMessage: function () {
    return Template.instance().lastError.get();
  },

  'logIntegrated': function () {
    var integration = Integrations.findOne();
    if (integration)
      Session.set('integrationId', integration._id);
    return integration;
  },

  'currentUser': function () {
    console.log('user', Meteor.user());
    return Meteor.users.findOne({_id: Meteor.userId()});
  },

  'integrations': function () {
    return Trello.find({});
  },

  'board': function () {
    var id = this.hook.idModel;
    var user = Meteor.user();
    console.log('id', id);
    return user.services.trello.boards.find(function (item) {
      console.log('item', item);
      return item.id === id;
    });
  },

  'organization': function () {
    var id = this.idOrganization;
    var user = Meteor.user();
    return user.services.trello.organizations.find(function (item) {
      return item.id === id;
    });
  },
});

Template.Trello.events({
  'click .addBoard': function (e, template) {
    e.preventDefault();

    if (Meteor.user()) {
      var value = template.$('.dropdown').dropdown('get value')[0];
      var currentUser = Meteor.user();
      var board = currentUser.services.trello.boards.find(function (item) {
        return item.id === value;
      });

      console.log('value', value);
      console.log('board', board);
      var controller = Router.current();
      var logId = controller.params.logId;
      if (board.id) {
        Meteor.call('addBoardHook', board, logId, function (error, response) {
          if (error) {
            template.lastError.set(error.reason);
            throw error;
          }
          template.$('.dropdown').dropdown('clear');
          template.lastError.set(null);
        });
      }
    }
  },

  'click .remove': function (e, template) {
    e.preventDefault();

    if (Meteor.user()) {
      var trello = Trello.findOne({'hook.id': e.target.dataset.value});
      var integration = Integrations.findOne();

      Meteor.call('removeBoardHook', trello.hook, integration._id, function (error, response) {
        if (error) {
          template.lastError.set(error.reason);
          throw error;
        } else if (response === 1) {
          template.$('.dropdown').dropdown('clear');
          template.lastError.set(null);
        }
      });
    }
  },

  'click .connectTrello': function (e, t) {
    e.preventDefault();
    var options = {
      scope: ['read'],
      expiration: 'never',
      name: 'log',
    };
    console.log('options', options);
    var callback = function(error) {
      if (error.error) {
        t.lastError.set(error.error);
      } else {
        Meteor.call('getBoards');
      }
    };

    if (Meteor.user()) {
      Meteor.linkWithTrello(options, callback);
    }
  },

  'click .disconnectTrello': function (e, t) {
    e.preventDefault();
    if (Meteor.user()) {
      Meteor.call('disconnectTrello', function (error, response) {
        if (error) throw error;
        return response;
      })
    }
  },

  'click .refreshBoards': function (e, t) {
    e.preventDefault();
    Meteor.call('getBoards', function (error, response) {
      if (error) throw error;
    });
  }
});

Template.Trello.onCreated(function () {
  var self = this;
  self.lastError = new ReactiveVar(null);
  self.autorun(function () {
    var controller = Router.current();
    self.subscribe('userTrelloService');
    self.subscribe('trello', Session.get('integrationId'));
  });
});
