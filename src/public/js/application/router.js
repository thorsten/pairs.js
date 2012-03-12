define(["application/controllers/card", "application/controllers/login",
        "application/controllers/game", "application/models/socket"], function(card, login, game, socket) {
    return Backbone.Router.extend({
        routes: {
            '': 'login',
            'login': 'login',
            'start/:id': 'start',
            'game': 'game'
        },

        socket: null,

        initialize: function() {
            this._overrideSync();
        },

        start: function(id) {
            var socket = this._openSocket();

            var controller = new card();
            controller.startAction(socket, id);
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

            Backbone.sync = function(method, model, options) {
                if (null == register) {
                    register =  {
                        lastid: 0,
                        callbacks: {}
                    };
                } else {
                    register.lastid += 1;
                }
                register.callbacks[register.lastid] = {
                    success: options.success,
                    error: options.error
                };

                var payload = {
                    method: method,
                    model: model,
                    id: register.lastid
                };

                var url = model.url;
                if( _.isFunction(model.url)) {
                    url = model.url();
                }

                console.log(url);
                console.log(method);
                console.log(payload);

                socket.emit(url, payload);

                socket.on('reply', function(data) {

                    if (data.hasOwnProperty('token')) {
                        socket.token = data.token;
                    }

                    if (register.callbacks.hasOwnProperty(data.id)) {
                        if (register.callbacks[data.id].hasOwnProperty(data.success)) {
                            var func = register.callbacks[data.id][data.success];
                            if (_.isFunction(func)) {
                                func(data.payload);
                            }
                        }
                        delete(register.callbacks[data.id]);
                    }
                });
            }
        }
    });
});