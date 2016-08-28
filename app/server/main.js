import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // Insert Available Services
  Services.remove({});
  var services = [
    {
      type: 'Github',
      description: 'GitHub offers online source code hosting for Git projects, with powerful collaboration, code review, and issue tracking.',
      website: 'http://github.com'
    }
  ];
  for (var i = 0; i < services.length; i++) {
    Services.insert(services[i]);
  }
});
