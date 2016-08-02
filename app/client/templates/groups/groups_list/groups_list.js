Template.GroupsList.helpers({
  groups: function () {
    return Groups.find({});
  }
});

Template.GroupsList.onCreated(function(){
  var self = this; 
  self.autorun(function(){
    self.subscribe('groups');
  });
});
