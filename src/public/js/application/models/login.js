define(function() { return Backbone.Model.extend({

    initialize: function() {
        this.on('login', _.bind(this.login, this));
    },

    login: function() {
        var data = {
            username: this.get('username'),
            password: this.get('password')
        };

        crypto.create()

        this.get('socket').emit('login', data);
    }

});
});