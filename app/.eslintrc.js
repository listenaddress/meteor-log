module.exports = {
  "extends": "standard",
  "plugins": [
      "standard",
      "promise"
  ],
  "rules": {
    "semi": [0],
    "curly": [0],
    "no-native-reassign": ["error", {"exceptions": ["UserController",
                                                    "LogController",
                                                    "IntegrationController",
                                                    "HomeController",
                                                    "Logs",
                                                    "Events",
                                                    "Integrations",
                                                    "Messages",
                                                    "Members"]}]
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

    "Logs": false,
    "Events": false,
    "Integrations": false,
    "Messages": false,
    "Members": false,

    // Controllers

    "UserController": false,
    "LogController": false,
    "IntegrationController": false,
    "HomeController": false,

    // Packages

    "moment": false
  },
  "env": {
    "meteor": true,
    "browser": true,
    "node": true
  }
};
