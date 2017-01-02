LogController = RouteController.extend({
  subscriptions: function () {
  },

  data: function () {
  },

  messages: function () {
    this.render('Log', {
      data: function () {
        return { messages: true };
      }
    });
  },

  new: function () {
    this.render('createLog');
  },

  settings: function () {
    this.render('Log', {
      data: function () {
        return { settings: true };
      }
    });
  },

  integrations: function () {
    this.render('Log', {
      data: function () {
        return { integrations: true };
      }
    });
  },

  integration: function () {
    this.render('Log', {
      data: function () {
        return { integration: true };
      }
    });
  },

  about: function () {
    this.render('Log', {
      data: function () {
        return { about: true };
      }
    });
  },

  files: function () {
    this.render('Log', {
      data: function () {
        return { files: true };
      }
    });
  }
});
