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
                                                    "NotificationController",
                                                    "HomeController",
                                                    "Logs",
                                                    "Events",
                                                    "Integrations",
                                                    "Notifications",
                                                    "Messages",
                                                    "Members",
                                                    "Services"]}]
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
    "NotificationController": false,
    "Notifications": false,
    "Messages": false,
    "Members": false,
    "Services": false,

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
