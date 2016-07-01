/*****************************************************************************/
/* NowsList: Event Handlers */
/*****************************************************************************/
Template.NowsList.events({
});

/*****************************************************************************/
/* NowsList: Helpers */
/*****************************************************************************/
Template.NowsList.helpers({
  nows: function() {
    return Nows.find({}, {sort: {createdAt: -1}});
  },

  timestamp: function () {
    var now = this;
    return moment(now.createdAt).fromNow();
  }
});

/*****************************************************************************/
/* NowsList: Lifecycle Hooks */
/*****************************************************************************/
Template.NowsList.onCreated(function () {
});

Template.NowsList.onRendered(function () {
});

Template.NowsList.onDestroyed(function () {
});
