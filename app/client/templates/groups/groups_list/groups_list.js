Template.GroupsList.helpers({
  groups: function () {
    return Groups.find({});
  }
});


Template.GroupsList.onRendered( function() {
  $( ".loader" ).delay( 750 ).fadeIn();
});
