Template.Home.events({
  'click .toggle-menu': function () {
    $('.ui.sidebar')
      .sidebar({context:$('body')})
      .sidebar('setting', 'transition', 'overlay')
      .sidebar('toggle')
    ;
  }
});

Template.Home.onCreated(function () {
  var self = this;
  self.autorun(function () {
    self.subscribe('homeEvents');
  });
});
