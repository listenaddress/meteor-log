Template.createLog.helpers({
  isMe: function () {
    return this._id === Meteor.userId();
  }
});

Template.createLog.events({
  'submit form': function(event){
    event.preventDefault();
    var logName = event.target.logName.value;

    Meteor.call('addNewLog', {
      name : logName
    }, function(error, response) {
      if (error) {
        console.log('error: ', error);
      } 
      else{
        Router.go('/log/'+response);
      }
    });

  }
})