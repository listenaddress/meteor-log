Template.Holder.onRendered(function() {
  window.Holder.run();
  setTimeout(function () {
    $('.events-list').scrollTop(100000);
  }, 250);
});
