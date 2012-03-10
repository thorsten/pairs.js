var Backbone = require('backbone');
var _ = require('underscore');

application.models.card = Backbone.Model.extend({

    db: null,
    socket: null,
    sessionid: null,
    cbid: null,

    game: null,
    gameId: null,
    cardId: null,

    initialize: function() {
        var mysql = require('mysql');

        var db = 'memory';
        var credentials = {
            user: 'root',
            password: ''
        }

        this.db = mysql.createClient(credentials);

        this.db.query('USE memory');
    },

    setSocket: function(socket) {
        this.socket = socket;
    },

    setSessionid: function(sessionid) {
        this.sessionid = sessionid;
    },

    setCbid: function(cbid) {
        this.cbid = cbid;
    },

    turnCard: function(data) {
        this.gameId = data.model.game_id;
        this.cardId = data.model.id;
        this.bg = data.model.background;

        // gibt es eine umgedrehte karte?
        var query = 'SELECT * FROM `cards` WHERE `active` = 1 AND `status` = 1 AND `game_id` = ' + this.gameId;
        console.log(query);
        this.db.query(query, _.bind(this.handleTurnedCard, this));
    },

    handleTurnedCard: function(err, result, fields) {
        console.log('___________');
        console.log(result.length);
        console.log('___________');
        if (_.isEmpty(result)) {
            var query = 'UPDATE `cards` SET `status` = 1 WHERE `game_id` = "' + this.gameId + '" AND `order` = "' + this.cardId + '"';
            this.db.query(query, function() {});
            var turnCard = [{
                gameId: this.gameId,
                cardId: this.cardId,
                status: 1,
                active: 1
            }];
            this.emitTurnCard(turnCard);
        } else if (result.length > 1) {
            console.log('FAIL');
            return;
        } else {
            // compare
            var result = result.pop();

            var bg = '/img/c' + result.card + '.jpg'
            if (bg == this.bg) {
                var query = 'UPDATE `cards` SET `active` = 0 WHERE `game_id` = "' + this.gameId + '" AND (`order` = "' + this.cardId + '" OR `order` = "' + result.id + '"';
                this.db.query(query, function() {});
                var turnCard = [{
                    gameId: result.game_id,
                    cardId: result.order,
                    status: 1,
                    active: 0
                }, {
                    gameId: this.gameId,
                    cardId: this.cardId,
                    status: 1,
                    active: 0
                }]
                this.emitTurnCard(turnCard);
            } else {
                setTimeout(_.bind(this.resetStatus, this, result), 2000);
            }
        }
    },

    resetStatus: function(result) {
        var query = 'UPDATE `cards` SET `active` = 0 WHERE `game_id` = "' + this.gameId + '" AND (`order` = "' + this.cardId + '" OR `order` = "' + result.id + '"';
        this.db.query(query, function() {});

        var turnCard = [{
            gameId: result.game_id,
            cardId: result.order,
            status: 0,
            active: 1
        }, {
            gameId: this.gameId,
            cardId: this.cardId,
            status: 0,
            active: 1
        }]
        this.emitTurnCard(turnCard);


        this.game.setGameId(this.gameId);
        this.game.getActiveUser();
    },

    emitTurnCard: function(data) {
        this.socket.emit('reply', data);
        this.socket.broadcast.emit('turnCard', data);
        this.socket.emit('turnCard', data);
    },

    setGame: function(game) {
        this.game = game;
    }
});