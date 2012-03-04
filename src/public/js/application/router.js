define(["application/controllers/card", "application/controllers/login", "application/models/socket"], function(card, login, socket) {
    return Backbone.Router.extend({
        routes: {
            'login': 'login',
            'start': 'start'
        },

        socket: null,

        start: function() {
            var socket = this._openSocket();

            var controller = new card();
            controller.startAction(socket);
        },

        login: function() {
            var socket = this._openSocket();

            var controller = new login();
            controller.loginAction(socket);
        },

        _openSocket: function() {
            if (null == this.socket) {
                this.socket = new socket();
            }

            return this.socket;
        }
    });
});