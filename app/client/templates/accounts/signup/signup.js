Template.SignUp.events({
  'submit .signup': function (e, template) {
    e.preventDefault();
    var email = event.target.email.value;
    var password = event.target.password.value;
    var username = event.target.username.value;

    var user = {
      'email': email,
      'password': password,
      'username': username
    }

    Meteor.call('userExists', username, function (error, userExists) {
      if (error) throw error;
      if (!userExists) {
        Meteor.call('createAccount', user, function (error, response) {
          if (error) throw error;
        });
      }
    });
  },
});
