S3.config = {
  key: process.env.S3_KEY,
  secret: process.env.S3_SECRET,
  bucket: process.env.S3_BUCKET
};

Meteor.startup(function () {
});

ServiceConfiguration.configurations.upsert(
  { service: 'github' },
  {
    $set: {
      clientId: process.env['ACCOUNTS_GITHUB_ID'],
      secret: process.env['ACCOUNTS_GITHUB_SECRET']
    }
  }
);
