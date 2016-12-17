import P from 'bluebird';
import request from 'request';
import { Mongo } from 'meteor/mongo'

Meteor.methods({
  'disconnectTrello': function () {
    return Meteor.users.update(Meteor.userId(), {$unset: {'services.trello': ''}}, function (error, response) {
      if (error) throw error;
      return response;
    });
  },

  'getBoards': function () {
    // Query Trello for users' boards
    // Save integration with boards
    var user = Meteor.user();
    var Trello = require('node-trello');
    var trello = new Trello(process.env.TRELLO_KEY, user.services.trello.accessToken);

    trello.get('/1/members/me/boards', Meteor.bindEnvironment(function (err, data) {
      if (err) throw err;
      P.map(data, Meteor.bindEnvironment(function (item) {
        return _.pick(item,
                      'id',
                      'name',
                      'idOrganization');
      })).then(Meteor.bindEnvironment(function (items) {
        Meteor.users.update({_id: Meteor.userId()}, {
          $set: {
            'services.trello.boards': items,
            createdAt: Date.now()
          }
        });
      }));
    }));

    trello.get('/1/members/me/organizations', Meteor.bindEnvironment(function (err, data) {
      if (err) throw err;
      P.map(data, Meteor.bindEnvironment(function (item) {
        return _.pick(item,
                      'id',
                      'displayName');
      })).then(Meteor.bindEnvironment(function (items) {
        Meteor.users.update({_id: Meteor.userId()}, {
          $set: {
            'services.trello.organizations': items,
            createdAt: Date.now()
          }
        });
      }));
    }));
  },

  'addBoardHook': function (board, logId) {
    var user = Meteor.user();
    var idObj = new Mongo.ObjectID();
    var _id = idObj._str;
    var url = 'https://api.trello.com/1/tokens/' + user.services.trello.accessToken +
               '/webhooks/?key=' + process.env.TRELLO_KEY +
               '&idModel=' + board.id +
               '&callbackURL=' +
               process.env.WEBHOOK_ENDPOINT + '/integrations/trello/' + _id;

    request.post(url, Meteor.bindEnvironment(function (error, response) {
      if (error) throw error;
      if (!response.body || response.body.indexOf('{') === -1)
        throw new Meteor.Error(500, 'We couldn\'t create a webhook with Trello');

      var body = JSON.parse(response.body);

      Meteor.call(
        'IntegrateService',
        logId,
        'trello',
        function (error, integrationId) {
          if (error) throw error;
          var hook = {
            id: body.id,
            idModel: body.idModel,
            board: board.id
          };

          var obj = {
            _id: _id,
            userId: user._id,
            hook: hook,
            logId: logId,
            integrationId: integrationId,
            createdAt: new Date()
          };

          return Trello.insert(obj, function (error, response) {
            if (error) throw error;
          });
        }
      );
    }));
  },

  'removeBoardHook': function (hook, integrationId) {
    var user = Meteor.user();
    var url = 'https://api.trello.com/1/webhooks/' + hook.id +
               '?key=' + process.env.TRELLO_KEY +
               '&token=' + user.services.trello.accessToken;

    request.del(url, Meteor.bindEnvironment(function (error, response) {
      // TODO: handle errors properly, nothing getting back to client yet
      if (error) throw error;
      if (response.body.indexOf('{') === -1) throw new Meteor.Error(500,
        'We couldn\'t delete the webhook with Trello');

      Trello.remove({'hook.id': hook.id}, function (error, response) {
        if (error) throw error;

        var trello = Trello.find({integrationId: integrationId});
        if (trello.count() === 0) {
          Integrations.remove({_id: integrationId});
        }
      });
    }));
  },

  'saveTrelloEvent': function (item, type, hookId) {
    // Check that it's an event that we're handling
    if (type !== 'createCard' &&
        type !== 'commentCard' &&
        !item.data.listAfter) {
      return;
    }

    // Save message then save event
    var hook = Trello.findOne({_id: hookId});
    var message = {
      service: 'trello',
      type: type,
      data: item,
      createdAt: new Date()
    };

    Messages.insert(message, function (error, messageId) {
      if (error) throw error;
      Meteor.call(
        'saveEvent',
        messageId,
        null,
        hook.logId,
        'trello',
        'Messages',
        function (error, response) {
          if (error) throw error;
        }
      );
    });
  }
});
