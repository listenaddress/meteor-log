Template.SignIn.events({
  'submit .signin': function (e, template) {
    e.preventDefault();
    var email = e.target.email.value;
    var password = e.target.password.value;

    Meteor.loginWithPassword(email, password, function (error, response) {
      if (error) template.lastError.set(error.reason);
      Router.go('home');
    });
  }
});
