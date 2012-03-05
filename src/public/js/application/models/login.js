define(function() { return Backbone.Model.extend({

    initialize: function() {
        this.on('login', _.bind(this.login, this));
    },

    login: function() {
        var data = {
            username: this.get('username'),
            password: this.get('password')
        };

        this.get('socket').on('loginSuccess', _.bind(this.handleLogin, this));

        this.get('socket').emit('login', data);
    },

    handleLogin: function(data) {
        if (data.success) {
            this.get('socket').setToken(data.token);
            window.location.hash = '#games';
        } else {
            window.location.hash = '#login';
        }
    }
});
});