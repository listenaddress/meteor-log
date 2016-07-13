Template.UserNow.events({
  'click .update': function (e, tmpl) {
    e.preventDefault();
    var body = tmpl.$('div.froala-reactive-meteorized').froalaEditor('html.get', true);

    Meteor.call('saveNow', {
      body: body
    }, function(error, response) {
      if (error) {
        console.log('error: ', error);
      } else {
        tmpl.$('div.froala-reactive-meteorized').froalaEditor();
      }
    });
  }
});

Template.UserNow.helpers({
  getContext: function () {

    var currentNow = Nows.findOne({},{sort: {createdAt: -1}, limit:1});
    if(currentNow)
       var value = currentNow.body
    else
       var value = 'loading';

      return {
      // Set html content
      _value: value,

      // _value: self.note,
      _keepMarkers: true,
      toolbarInline: true,
      initOnClick: false,
      tabSpaces: false,

      // FE save.before event handler function:
      "_onsave.before": function (e, editor) {
        var newHTML = editor.html.get(true /* keep_markers */);
        // Do something to update the edited value
        // if (!_.isEqual(newHTML, self.note.body)) {
        //   Meteor.call('saveNote', { body: newHTML })
        // }
        return false; // Stop Froala Editor from POSTing to the Save URL
      },
    }
  },

  now(){
      var currentNow =  Nows.findOne({},{sort: {createdAt: -1}, limit:1});
      if(currentNow)
         return currentNow.body;
      else
         return 'loading';
  },

  now: function(){
    return Nows.findOne({},{sort: {createdAt: -1}, limit:1});
  },

  isMe: function () {
    return this._id === Meteor.userId();
  },

  username: function(){
    return Router.current().params.username;
  }
});



Template.UserNow.onCreated(function(){
  var self = this;
  self.autorun(function(){
    var controller = Router.current();
    var user = Meteor.users.findOne({"username":controller.params.username});

    if(user)
      var userId = user._id;

    self.subscribe('UserNow', userId);
  });
});
