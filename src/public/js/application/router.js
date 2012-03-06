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

        start: function() {
            var socket = this._openSocket();

            var controller = new card();
            controller.startAction(socket);
        },

        login: function() {
            this._overrideSync();

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
                        lastid: id,
                        callbacks: {0: cbs}
                    };
                } else {
                    id = register.lastid + 1;
                    register.lastid = id;
                    register.callbacks[id] = cbs;
                }

                var payload = {model: model, options: options, id: id};

                socket.emit(model.url, payload);

                socket.on('reply', function(data) {
                    var func = register.callbacks[data.id][data.success];
                    func();
                    //delete(register.callbacks[data.id]);
                });
            }
        }
    });
});