define(function() { return Backbone.Collection.extend({

        activeFirst: null,
        activeSecond: null,
        timeout: null,
        game: null,
        socket: null,
        started: false,
        usersTurn: false,

        initialize: function() {
            //this.on('change', _.bind(this.handleStatusChange, this));
        },
/*
        handleStatusChange: function(card) {
            if (card.get('active') == 1 && card.get('status') == 1) {
                if (this.timeout != null) {
                    clearTimeout(this.timeout);
                    this.timeout = null;
                    this.disableCards();
                }

                if (this.activeFirst == null) {
                    this.activeFirst = card;
                    return;
                }

                if (card.cid == this.activeFirst.cid) {
                    return;
                }

                this.activeSecond = card;

                if (this.activeFirst.get('background') == this.activeSecond.get('background')) {
                    var data = {'active': 0};
                    this.activeFirst.set(data);
                    this.activeSecond.set(data);
                    this.activeFirst = null;
                    this.activeSecond = null;
                } else {
                    this.timeout = setTimeout(_.bind(this.disableCards, this), 2000);
                }
            }
        },

        disableCards: function() {
            if (null != this.activeFirst && null != this.activeSecond) {
                var data = {'status': 0};
                this.activeFirst.set(data);
                this.activeSecond.set(data);

                this.activeFirst = null;
                this.activeSecond = null;
            }
        },*/

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
            if (this.started == false) {
                this.started = true;
                this.each(function(item) {
                    item.set({'active': 1});
                });

                if (this.socket.token == data.user) {
                    this.usersTurn = true;
                    // nutzer ist dran
                } else {
                    this.usersTurn = false;
                    // nutzer ist nicht dran
                }
            }
        },

        isUsersTurn: function() {
            return this.usersTurn;
        },

        handleTurnCard: function(data) {
            data.forEach(_.bind(this.changeCardProperties, this));
        },

        changeCardProperties: function(values) {
            var card = {
                active: values.active,
                status: values.status
            };

            this.at(values.cardId).set(card);
        }
    });
});