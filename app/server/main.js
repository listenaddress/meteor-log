import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // Insert Available Services
  Services.remove({});
  var services = [
    {
      type: 'github',
      description: 'GitHub offers online source code hosting for Git projects, with powerful collaboration, code review, and issue tracking.',
      website: 'http://github.com',
      thumb_url: 'https://a.slack-edge.com/ae7f/plugins/github/assets/service_512.png'
    },
    {
      type: 'evernote',
      description: 'GitHub offers online source code hosting for Git projects, with powerful collaboration, code review, and issue tracking.',
      website: 'http://github.com',
      thumb_url: 'https://assets.materialup.com/uploads/175d3511-d61e-41d1-b34b-f04f54ec2736/0x0ss-85.jpg'
    },
    {
      type: 'trello',
      description: 'GitHub offers online source code hosting for Git projects, with powerful collaboration, code review, and issue tracking.',
      website: 'http://github.com',
      thumb_url: 'https://s3-us-west-2.amazonaws.com/slack-files2/avatars/2016-05-18/44042585718_0e6a837d5b63fd1cfc07_512.png'
    }
  ];
  for (var i = 0; i < services.length; i++) {
    Services.insert(services[i]);
  }
});
