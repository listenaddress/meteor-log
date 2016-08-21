AccountsTemplates.addField({
  _id: 'username',
  type: 'text',
  required: true,
  displayName: 'Username',
  func: function (value) {
    if (Meteor.isClient) {
      var self = this;

      Meteor.call('userExists', value, function (error, userExists) {
        if (error) throw error;
        if (!userExists) return self.setSuccess();
        self.setError(userExists);
        self.setValidating(false);
      });

      return;
    }

    // Server
    return Meteor.call('userExists', value);
  }
});

AccountsTemplates.addField({
  _id: 'firstName',
  placeholder: 'John',
  type: 'text',
  required: true,
  displayName: 'What is your Name?'
});
