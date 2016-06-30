/*****************************************************************************/
/* NowPreview: Event Handlers */
/*****************************************************************************/
Template.NowPreview.events({
});

/*****************************************************************************/
/* NowPreview: Helpers */
/*****************************************************************************/
Template.NowPreview.helpers({
  timestamp: function () {
    var now = this;
    return moment(now.createdAt).fromNow();
  }
});

/*****************************************************************************/
/* NowPreview: Lifecycle Hooks */
/*****************************************************************************/
Template.NowPreview.onCreated(function () {
});

Template.NowPreview.onRendered(function () {
});

Template.NowPreview.onDestroyed(function () {
});
