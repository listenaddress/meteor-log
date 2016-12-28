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

    Accounts.createUser(user, function (error) {
      if (error) throw error;
    });
  },
});
