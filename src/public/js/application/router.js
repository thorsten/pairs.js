define(["application/controllers/card", "application/controllers/login",
        "application/controllers/game", "application/models/socket"], function(card, login, game, socket) {
    return Backbone.Router.extend({
        routes: {
            '': 'login',
            'login': 'login',
            'start': 'start',
            'game': 'game'
        },

        socket: null,

        initialize: function() {
            this._overrideSync();
        },

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
        },

        game: function() {
            var socket = this._openSocket();

            var controller = new game();
            controller.gameAction(socket);
        },

        _overrideSync: function() {
            var socket = this._openSocket();
            register = null;

            clientId = new Date().getTime();

            Backbone.sync = function(method, model, options) {

                // method: create, read, update, delete
                var allowedMethods = ['create', 'read', 'update', 'delete'];

                if (_.indexOf(allowedMethods, method) == -1) {
                    return false;
                }

                var cbs = {
                    success: options.success,
                    error: options.error
                };

                var id = 0;

                if (null == register) {
                    register =  {
                        lastid: null,
                        callbacks: {}
                    };
                    register.callbacks
                } else {
                    id = register.lastid + 1;
                }
                register.lastid = id;
                register.callbacks[id] = cbs;

                var payload = {model: model, options: options, id: id, sessionid: clientId};

                socket.emit(model.url, payload);

                socket.on('reply', function(data) {
                    if (data.sessionid == clientId) {

                        console.log(register.callbacks);

                        var cbs = register.callbacks;
                        debugger;

                        var func = register.callbacks[data.id][data.success];
                        func();
                        delete(register.callbacks[data.id]);
                    }
                });
            }
        }
    });
});