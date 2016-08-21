Template.MessagePreview.helpers({
  timestamp: function () {
    var now = this;
    return moment(now.createdAt).fromNow();
  },
  user: function () {
    return Meteor.users.findOne({_id: this.userId}, {fields: {username: 1, profile: 1}});
  }
});

Template.MessagePreview.onCreated(function () {
  var self = this;
  self.autorun(function () {
    self.subscribe('userInfo', self.data.userId);
  });
})

