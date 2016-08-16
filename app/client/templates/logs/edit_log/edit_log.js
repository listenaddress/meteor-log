Template.editLog.helpers({

});

Template.editLog.events({
  "click .dropdown": function(){
    $('.selection.dropdown').dropdown();
  },

  'submit form': function(event){
    event.preventDefault();
    var logName = event.target.logName.value;

    Meteor.call('updateLog', this._id, {
      name : logName
    }, function(error, response){
      if(error) 
        throw error
      else
        console.log(this._id);
        Router.go('/log/'+this._id);
    });
  }, 

  'click .deleteLog': function(){
      Meteor.call('deleteLog', this._id, 
        function(error, response){
          if(error) 
            throw error
          else
            console.log(this._id);
            Router.go('home');
      });
  }

});
