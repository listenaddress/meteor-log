module.exports = {
    "extends": "standard",
    "plugins": [
        "standard",
        "promise"
    ],
    "rules": {
      "semi": [0],
    },
    "globals": {
      "Meteor": false,
      "Session": false,
      "Template": false,
      "SimpleSchema": false,
      "Notifications": false,
      "Logs": false,
      "Events": false,
      "Messages": false,
      "Members": false,
      "Nows": false,
      "Comments": false
    },
    "env": {
      "meteor": true
    },
};
