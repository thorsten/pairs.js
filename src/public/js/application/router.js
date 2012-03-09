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

            clientId = new Date().getTime();

            Backbone.sync = function(method, model, options) {

                // method: create, read, update, delete
                var allowedMethods = ['create', 'read', 'update', 'delete', 'join', 'start'];

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

                var payload = {
                    method: method,
                    model: model,
                    options: options,
                    id: id,
                    sessionid: clientId
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

                    if (data.sessionid == clientId
                        && register.callbacks.hasOwnProperty(data.id)) {
                        if (register.callbacks[data.id].hasOwnProperty(data.success)) {
                            var func = register.callbacks[data.id][data.success];
                            func(data.payload);
                        }
                        delete(register.callbacks[data.id]);
                    }
                });
            }
        }
    });
});