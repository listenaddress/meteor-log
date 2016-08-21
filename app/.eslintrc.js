module.exports = {
  "extends": "standard",
  "plugins": [
      "standard",
      "promise"
  ],
  "rules": {
    "semi": [0],
    "curly": [0],
    "no-native-reassign": ["error", {"exceptions": ["UserController"]}]
  },
  "globals": {
    // Templates

    "Meteor": false,
    "Session": false,
    "Template": false,
    "SimpleSchema": false,
    "AccountsTemplates": false,
    "RouteController": false,

    // Collections

    "Notifications": false,
    "Logs": false,
    "Events": false,
    "Integrations": false,
    "Messages": false,
    "Members": false,
    "Nows": false,
    "Comments": false,
    "Notes": false,
    "Groups": false,

    // Controllers

    "UserController": false,
  },
  "env": {
    "meteor": true,
    "browser": true,
    "node": true
  }
};
