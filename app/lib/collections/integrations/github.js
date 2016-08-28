Github = new Mongo.Collection('github');

var Schemas = {};

var HookSchema = new SimpleSchema({
  type: {
    type: String
  },
  id: {
    type: String
  },
  events: {
    type: [String]
  },
  config: {
    type: Object
  },
  updated_at: {
    type: String
  },
  last_response: {
    type: Object
  },
  repo: {
    type: String
  },
  repoOwner: {
    type: String
  }
});

Schemas.Github = new SimpleSchema({
  userId: {
    type: String
  },
  hook: {
    type: HookSchema,
    optional: true
  },
  createdAt: {
    type: Date
  },
  integrationId: {
    type: String
  }
});

Github.attachSchema(Schemas.Github);
