Template.createGroup.helpers({
  isMe: function () {
    return this._id === Meteor.userId();
  }
});

Template.createGroup.events({
  'submit form': function(event){
    event.preventDefault();
    var groupName = event.target.groupName.value;
    console.log(groupName);

    Meteor.call('addNewGroup', {
      name : groupName
    }, function(error, response) {
      if (error) {
        console.log('error: ', error);
      } 
      else{
        console.log(response);
      }
    });

  }
})