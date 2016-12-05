Template.MessagePreview.helpers({
  timestamp: function () {
    var now = this;
    return moment(now.createdAt).format('LT');
  },
  user: function () {
    return Meteor.users.findOne({_id: this.userId}, {fields: {username: 1, profile: 1}});
  }
});

Template.MessagePreview.onCreated(function () {
  var self = this;
  self.autorun(function () {
    self.subscribe('usersById', self.data.userId);
  });
})

