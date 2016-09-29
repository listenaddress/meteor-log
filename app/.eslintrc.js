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
                                                    "SearchController",
                                                    "HomeController",
                                                    "SearchController",
                                                    "Logs",
                                                    "Events",
                                                    "Files",
                                                    "S3",
                                                    "Integrations",
                                                    "Notifications",
                                                    "Messages",
                                                    "Members",
                                                    "Services",
                                                    "Github"]}]
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
    "Files": false,
    "S3": false,
    "Integrations": false,
    "Notifications": false,
    "Messages": false,
    "Members": false,
    "Services": false,
    "Github": false,

    // Controllers

    "UserController": false,
    "LogController": false,
    "IntegrationController": false,
    "HomeController": false,
    "NotificationController": false,
    "SearchController": false,

    // Packages

    "moment": false
  },
  "env": {
    "meteor": true,
    "browser": true,
    "node": true
  }
};
