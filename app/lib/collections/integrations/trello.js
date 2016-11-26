Trello = new Mongo.Collection('trello');

var Schemas = {};

var TrelloHookSchema = new SimpleSchema({
  id: {
    type: String
  },
  idModel: {
    type: String
  }
});

Schemas.Trello = new SimpleSchema({
  userId: {
    type: String
  },
  hook: {
    type: TrelloHookSchema,
    optional: true
  },
  logId: {
    type: String
  },
  createdAt: {
    type: Date
  },
  integrationId: {
    type: String
  }
});

Trello.attachSchema(Schemas.Trello);
