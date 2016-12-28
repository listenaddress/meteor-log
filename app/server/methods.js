/*  Server Methods  */
import sizeOf from 'image-size';
import url from 'url';
import http from 'http';

var saveFiles;
var updateFile;
var updateUser;
var updateLog;
var getImageSize;
var usersTaggedPattern = /\B@[a-z0-9_-]+/g;

Meteor.methods({
  'createAccount': function (user) {
    console.log(user);
    return Accounts.createUser(user)
  },

  'saveMessage': function (message, files, logId) {
    // Find users tagged and add links to their profile
    var matches = message.match(usersTaggedPattern);
    if (matches && matches.length > 0) {
      _.map(matches, function (item) {
        var username = item.replace('@', '');
        var exists = !!Meteor.users.findOne({username: username});
        if (!exists) return;

        message = message.replace(item, '<a href="/' + username + '">' + item + '</a>');
      });
    }

    var item = {
      userId: Meteor.userId(),
      createdAt: new Date(),
      content: message
    };
    var isMember = Members.findOne({ logId: logId, userId: Meteor.userId() });

    if (!item.userId) {
      throw new Meteor.Error(500,
        'You cannot send messages while you are not connected');
    }

    if (!isMember) {
      throw new Meteor.Error(500,
        'You cannot send messages if you did not join the log');
    }

    return Messages.insert(item, function (error, response) {
      if (error) throw error;

      saveFiles(files, response, logId);
      updateLog(logId, {lastMessage: new Date()});

      Meteor.call('saveEvent',
                  response,
                  item.userId,
                  logId,
                  'message_created',
                  'Messages');

      return response;
    });

    // return saveFiles(item).then(Meteor.bindEnvironment(function (value) {
    //   if (value) item.files = value;
    //   console.log('value from saveFiles', value);
    //   return saveMessage(item);
    // })).then(Meteor.bindEnvironment(function (value) {
    //   console.log('value from saveMessage', value);
    //   return saveEvent(value,
    //                    item.userId,
    //                    logId,
    //                    'message_created',
    //                    'Messages');

    // }));
  },

  'editMessage': function (message) {
    // Wrap tagged users with <a> tags in message.content
    var matches = message.content.match(usersTaggedPattern);
    var event = Events.findOne({messageId: message._id});
    var oldMessage = Messages.findOne({_id: message._id});
    var oldMatches = oldMessage.content.match(usersTaggedPattern);

    if (matches && matches.length > 0) {
      _.map(matches, function (item) {
        var username = item.replace('@', '');
        var exists = !!Meteor.users.findOne({username: username});
        if (!exists) return;

        message.content = message.content.replace(item,
          '<a href="/' + username + '">' + item + '</a>');

        // If new user was tagged, save notification
        if (oldMatches && oldMatches.length > 0) {
          var index = oldMatches.indexOf(item);
        }
        var currentUser = Meteor.user();
        if (username === currentUser.username) return;
        if (!oldMatches || index < 0) {
          Meteor.call('saveTaggedNotification', username, event._id);
        }
      });
    }

    // If user was untagged, remove their notification
    if (oldMatches && oldMatches.length > 0) {
      _.map(oldMatches, function (item) {
        var username = item.replace('@', '');
        var user = Meteor.users.findOne({username: username});

        // Return if we can't find the user or if user is still tagged
        if (!user || !user._id) return;
        if (matches && matches.length > 0) {
          var index = matches.indexOf(item);
          if (index > -1) return;
        }

        Notifications.remove({userId: user._id, eventId: event._id})
      });
    }

    // Fucking FINALLY update the message
    return Messages.update(message._id, {$set: {content: message.content}},
      function (error, response) {
      if (error) throw error;

      return response;
    });
  },

  'saveEvent': function (id, userId, logId, type, refType, hidden) {
    console.log('ALLAHU AKBAR');
    console.log('ALLAHU AKBAR');
    console.log('JAH RASTAFARI');
    console.log('JAH RASTAFARI');
    var item = {
      type: type,
      createdAt: new Date()
    };

    if (logId) {
      item.logId = logId;
    }

    if (userId) item.userId = userId;
    if (hidden) item.hidden = true;

    if (refType === 'Messages') {
      item.messageId = id;
    }

    return Events.insert(item, function (error, response) {
      if (error) {
        console.log('error: ', error);
        throw error;
      } else {
        if (hidden) return;

        item._id = response;
        Meteor.call('saveNotifications', logId, item, refType);
        return;
      }
    });
  },

  'saveNotifications': function (logId, event, refType) {
    if (refType === 'Logs') {
      var log = Logs.findOne(logId);
      if (log.creatorId === event.userId) return;

      Meteor.call('saveLogNotifications', logId, event._id);
    }

    if (refType === 'Messages') {
      // Find users tagged and save a notification for them
      var message = Messages.findOne(event.messageId);
      if (message && message.content) {
        var matches = message.content.match(usersTaggedPattern);
        if (matches && matches.length > 0) {
          _.map(matches, function (item) {
            var username = item.replace('@', '');
            var user = Meteor.users.findOne({username: username});
            if (!user || user._id === event.userId) return;

            Meteor.call('saveTaggedNotification', username, event._id);
          });
        }
      }
    }
  },

  'saveLogNotifications': function (logId, eventId) {
    var log = Logs.findOne(logId);

    Notifications.insert({
      userId: log.creatorId,
      logId: logId,
      eventId: eventId,
      createdAt: new Date()
    });
  },

  'saveTaggedNotification': function (username, eventId) {
    var user = Meteor.users.findOne({username: username});

    Notifications.insert({
      userId: user._id,
      eventId: eventId,
      createdAt: new Date()
    });
  },

  'markNotificationsAsSeen': function () {
    return Notifications.update({userId: Meteor.userId()},
                                {$unset: {unseen: ''}},
                                {multi: true},

      function (error, response) {
        if (error) throw error;
        return response;
      }
    );
  },

  'markNotificationAsHeard': function (id) {
    return Notifications.update(id, {$set: {heard: true}},
      function (error, response) {
        if (error) throw error;
        return response;
      }
    );
  },

  /*  Log Methods */

  'saveLog': function (item) {
    check(item.name, String);
    item.creatorId = Meteor.userId();
    item.createdAt = new Date();
    item.accessList = [Meteor.userId()];

    if (item.creatorId) {
      return Logs.insert(item, function (error, response) {
        if (error) {
          console.log('error: ', error);
          throw error;
        } else {
          Meteor.call('joinLog', response);
          Meteor.call('saveEvent', response, item.creatorId, response, 'log_created', 'Logs');
          return response;
        }
      });
    }
  },

  'updateLog': function (logId, item) {
    check(item.name, String);
    // check any other update, currently name only

    if (item.name) {
      return Logs.update({_id: logId},
                        {$set: {
                          name: item.name,
                          description: item.description,
                          about: item.about
                        }},
        function (error, response) {
          if (error) throw error;

          Meteor.call('saveEvent',
                      logId,
                      Meteor.userId(),
                      logId,
                      'log_updated',
                      'Logs',
            function (error, response) {
              if (error) throw error;
            }
          );

          return response;
        }
      );
    }
  },

  'deleteLog': function (logId) {
    return Logs.update({_id: logId}, { $set: {hidden: true} },
      function (error, response) {
        if (error) throw error;

        Meteor.call('saveEvent',
                    logId,
                    Meteor.userId(),
                    logId,
                    'log_deleted',
                    'Logs',
                    true,
          function (error, response) {
            if (error) throw error;

            Events.update({logId: logId}, { $set: {hidden: true} }, {multi: true},
              function (error, response) {
                if (error) throw error;
              }
            );
          }
        );

        return response;
      }
    );
  },

  'joinLog': function (logId) {
    var member = Members.findOne({ logId: logId, userId: Meteor.userId() });
    if (member) throw new Meteor.Error(500,
      'You cannot join a log that you have already joined');

    Members.insert({ logId: logId,
                     userId: Meteor.userId(),
                     createdAt: new Date() },
      function (error, response) {
        if (error) throw error;

        Meteor.call('saveEvent',
                    response,
                    Meteor.userId(),
                    logId,
                    'member_joined_log',
                    'Logs');

        return response;
      }
    );
  },

  'leaveLog': function (logId) {
    var member = Members.findOne({ logId: logId, userId: Meteor.userId() });
    if (!member) throw new Meteor.Error(500, 'You cannot leave a log that you have already left');

    Members.remove({ logId: logId, userId: Meteor.userId() }, function (error, response) {
      if (error) throw error;

      Meteor.call('saveEvent',
                  response,
                  Meteor.userId(),
                  logId,
                  'member_left_log',
                  'Logs',
                  true);

      return response;
    });
  },

  'updateLastSeenAt': function (userId, logId) {
    return Members.update({userId: Meteor.userId(), logId: logId},
                          {$set: {lastSeenAt: new Date()}},
      function (error, response) {
        if (error) throw error;
        return response;
      }
    );
  },

  'userExists': function (username) {
    return !!Meteor.users.findOne({username: username});
  },

  'updateUserPhoto': function (file) {
    if (Meteor.userId()) {
      file.userThumb = true;
      saveFiles([file]);
    }
  },

  'updateUserProfile': function (updatedUser) {
    if (Meteor.userId()) {
      var user = Meteor.users.findOne(Meteor.userId());
      user.username = updatedUser.username;
      user.profile.firstName = updatedUser.profile.firstName;
      user.profile.lastName = updatedUser.profile.lastName;
      user.profile.bio = updatedUser.profile.bio;
      updateUser(user, updatedUser.photo);
    }
  }
});

saveFiles = function (files, messageId, logId) {
  _.map(files, function (item) {
    var obj = {
      userId: Meteor.userId(),
      s3Id: item._id,
      secure_url: item.secure_url,
      createdAt: new Date()
    };
    if (messageId) obj.messageId = messageId;
    if (item.file && item.file.original_name) {
      obj.original_name = item.file.original_name;
    }

    Files.insert(obj, function (error, response) {
      if (error) throw error;
      if (item.userThumb) updateUser({'profile.thumb': item.secure_url});
      getImageSize(item, response);
    });
  });
};

getImageSize = function (file, id) {
  var options = url.parse(file.url);

  http.get(options, function (response) {
    var chunks = [];
    response.on('data', function (chunk) {
      chunks.push(chunk);
    }).on('end', function () {
      var buffer = Buffer.concat(chunks);
      var size = sizeOf(buffer);
      if (!size.width) return;
      var updateObj = { width: size.width, height: size.height };
      updateFile(updateObj, id);
    });
  });
};

updateFile = Meteor.bindEnvironment(function (updateObj, id) {
  return Files.update(id, {$set: updateObj},
    function (error, response) {
      if (error) throw error;
      return response;
    }
  );
});

updateUser = function (updateObj, photo) {
  return Meteor.users.update(Meteor.userId(), {$set: updateObj},
    function (error, response) {
      if (photo) {
        photo.userThumb = true;
        saveFiles([photo]);
      }

      if (error) throw error;
      return response;
    }
  );
};

updateLog = function (logId, updateObj) {
  return Logs.update(logId, {$set: updateObj},
    function (error, response) {

      if (error) throw error;
      return response;
    }
  );
};
