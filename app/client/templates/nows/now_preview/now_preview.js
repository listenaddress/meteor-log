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
  },
  user: function() {
    return Meteor.users.findOne({_id:this.userId}, {fields: {profile: 1, username:1}});
  }
});

/*****************************************************************************/
/* NowPreview: Lifecycle Hooks */
/*****************************************************************************/


Template.NowPreview.onRendered(function () {
});

Template.NowPreview.onDestroyed(function () {
});
