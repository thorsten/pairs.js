define(function() { return Backbone.Collection.extend({

        activeFirst: null,
        activeSecond: null,
        timeout: null,
        game: null,
        socket: null,
        started: false,
        usersTurn: false,

        setGameId: function(gameId) {
            this.game = gameId;
        },

        setSocket: function(socket) {
            this.socket = socket;
        },

        startGame: function() {
            var model = {
                id: this.game,
                url: 'game'
            };

            var options = {
                'success': this.trigger('started')
            };

            Backbone.sync('start', model, options);
        },

        handleSocket: function() {
            this.socket.on('turn', _.bind(this.handleTurn, this));
            this.socket.on('turnCard', _.bind(this.handleTurnCard, this));
            this.socket.on('finished', _.bind(this.finished, this));
        },

        handleTurn: function(data) {
            if (data.game != this.game) {
                return false;
            }

            if (this.started == false) {
                this.started = true;
                this.each(function(item) {
                    item.set({'active': 1});
                });
            }

            if (this.socket.token == data.user) {
                this.usersTurn = true;
            } else {
                this.usersTurn = false;
            }
        },

        isUsersTurn: function() {
            return this.usersTurn;
        },

        handleTurnCard: function(data) {
            if (this.game != data[0].gameId) {
                return false;
            }

            if (data.length == 2 && data[0].status == 0 && data[0].active == 1) {
                this.cleanUp();
            }

            data.forEach(_.bind(this.changeCardProperties, this));
        },

        changeCardProperties: function(values) {
            var card = {
                active: values.active,
                status: values.status
            };

            var model = this.at(values.cardId);

            model.set(card);
            model.trigger('turnCard');
        },

        cleanUp: function() {
            this.models.forEach(function(item) {item.set({status: 0})});
        },

        moreThanTwoActive: function() {
            var activeCount = 0;

            for (var i = 0; i < this.models.length; i++) {
                if (this.models[i].get('status') == 1 && this.models[i].get('active') == 1) {
                    activeCount++;
                }
            }

            return (activeCount > 2) ? true : false;
        },

        finished: function(data) {
            if (data.gameId != this.game) {
                return false;
            }

            for (var i = 0; i < data.players.length; i++) {
                data.players[i].count = Math.floor(data.players[i].count);
            }

            this.trigger('finished', data.players);
        },

        cheat: function() {
            var pos = null;
            var activeCount = 0;
            for (var i = 0; i < this.length; i++) {
                if (this.models[i].get('active') === 1
                    && this.models[i].get('status') === 1) {
                    activeCount += 1;
                }
            }

            if (activeCount === 1) {
                for (var i = 0; i < this.length; i++) {
                    if (this.models[i].get('active') === 1
                        && this.models[i].get('status') === 1) {
                        var bg = this.models[i].get('background');
                    }
                }
                for (var i = 0; i < this.length; i++) {
                    if (this.models[i].get('active') === 1
                        && this.models[i].get('status') === 0
                        && this.models[i].get('background') === bg) {
                        var pos = this.indexOf(this.models[i]);
                    }
                }
            }

            return pos;
        }
    });
});