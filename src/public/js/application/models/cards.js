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

            var options = {};

            Backbone.sync('start', model, options);
        },

        handleSocket: function() {
            this.socket.on('turn', _.bind(this.handleTurn, this));
            this.socket.on('turnCard', _.bind(this.handleTurnCard, this));
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
                // nutzer ist dran
            } else {
                this.usersTurn = false;
                // nutzer ist nicht dran
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

            this.at(values.cardId).set(card);
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
        }
    });
});