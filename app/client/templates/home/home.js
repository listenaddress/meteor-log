Template.Home.onCreated(function () {

});

Template.Home.events({
  'click .toggle-menu': function () {
    $('.ui.sidebar')
      .sidebar({context:$('body')})
      .sidebar('setting', 'transition', 'overlay')
      .sidebar('toggle')
    ;
  }
});