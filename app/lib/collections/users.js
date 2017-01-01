var Schemas = {};

Schemas.UserProfile = new SimpleSchema({
  firstName: {
    type: String,
    optional: true
  },
  name: {
    type: String,
    optional: true
  },
  website: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  thumb: {
    type: String,
    optional: true,
    defaultValue: 'https://cdn.meme.am/cache/images/folder688/250x250/84688.jpg'
  },
  bio: {
    type: String,
    optional: true
  }
});

Schemas.User = new SimpleSchema({
  username: {
    type: String,
    // For accounts-password, either emails or username is required, but not both. It is OK to make this
    // optional here because the accounts-password package does its own validation.
    // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
    optional: true
  },
  emails: {
    type: Array,
    // For accounts-password, either emails or username is required, but not both. It is OK to make this
    // optional here because the accounts-password package does its own validation.
    // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
    optional: true,
    autoform: {
      type: 'hidden'
    }
  },
  'emails.$': {
    type: Object,
    autoform: {
      type: 'hidden'
    }
  },
  'emails.$.address': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    autoform: {
      type: 'hidden'
    }
  },
  'emails.$.verified': {
    type: Boolean,
    autoform: {
      type: 'hidden'
    }
  },
  // Use this registered_emails field if you are using splendido:meteor-accounts-emails-field / splendido:meteor-accounts-meld
  registered_emails: {
    type: [Object],
    optional: true,
    blackbox: true,
    autoform: {
      type: 'hidden'
    }
  },
  createdAt: {
    type: Date,
    autoform: {
      type: 'hidden'
    }
  },
  profile: {
    type: Schemas.UserProfile,
    optional: true
  },
  // Make sure this services field is in your schema if you're using any of the accounts packages
  services: {
    type: Object,
    optional: true,
    blackbox: true,
    autoform: {
      type: 'hidden'
    }
  },
  // Add `roles` to your schema if you use the meteor-roles package.
  // Option 1: Object type
  // If you specify that type as Object, you must also specify the
  // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
  // Example:
  // Roles.addUsersToRoles(userId, ['admin'], Roles.GLOBAL_GROUP);
  // You can't mix and match adding with and without a group since
  // you will fail validation in some cases.
  roles: {
    type: Object,
    optional: true,
    blackbox: true,
    autoform: {
      type: 'hidden'
    }
  },
  // Option 2: [String] type
  // If you are sure you will never need to use role groups, then
  // you can specify [String] as the type
  // roles: {
  //   type: [String],
  //   optional: true,
  //   autoform: {
  //     type: 'hidden'
  //   }
  // },
  status: {
    type: Object,
    optional: true,
    blackbox: true
  }
});

Meteor.users.attachSchema(Schemas.User);
