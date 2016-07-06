AccountsTemplates.addField({
    _id: 'username',
    type: 'text',
    required: true,
    displayName: "Username",
    func: function(value){
        if (Meteor.isClient) {
            console.log("Validating username...");
            var self = this;
            Meteor.call("userExists", value, function(err, userExists){
                if (!userExists)
                    self.setSuccess();
                else
                    self.setError(userExists);
                self.setValidating(false);
            });
            return;
        }
        // Server
        return Meteor.call("userExists", value);
    }
});

AccountsTemplates.addField({
    _id: 'firstName',
    placeholder: 'John',
    type: 'text',
    required: true,
    displayName: "What is your Name?"
});