var Backbone = require('backbone');
var _ = require('underscore');

application.models.card = Backbone.Model.extend({

    socket: null,
    cbid: null,

    game: null,
    gameId: null,
    cardId: null,

    setSocket: function(socket) {
        this.socket = socket;
    },

    setCbid: function(cbid) {
        this.cbid = cbid;
    },

    turnCard: function(data) {
        this.gameId = data.model.game_id;
        this.cardId = data.model.id;
        this.bg = data.model.background;
        this.token = data.token;

        // gibt es eine umgedrehte karte?
        var query = 'SELECT * FROM `cards` WHERE `active` = 1 AND `status` = 1 AND `game_id` = ' + this.gameId;
        application.db.query(query, _.bind(this.handleTurnedCard, this));
    },

    handleTurnedCard: function(err, result, fields) {
        if (result.length > 1) {
            return;
        }

        var query = 'UPDATE `cards` SET `status` = 1 WHERE `game_id` = "' + this.gameId + '" AND `order` = "' + this.cardId + '"';
        application.db.query(query, function() {});
        var turnCard = [{
            gameId: this.gameId,
            cardId: this.cardId,
            status: 1,
            active: 1
        }];
        this.emitTurnCard(turnCard);

        if (!(_.isEmpty(result))) {
            var result = result.pop();
            var bg = '/img/c' + result.card + '.jpg'
            if (bg == this.bg) {
                var query = 'UPDATE `cards` SET `active` = 0, `status` = 0, turned_by_user = (SELECT id FROM users WHERE token = "' + this.token + '") WHERE `game_id` = "' + this.gameId + '" AND (`order` = "' + this.cardId + '" OR `order` = "' + result.order + '")';
                application.db.query(query, function() {});
                var turnCard = [{
                    gameId: result.game_id,
                    cardId: result.order,
                    status: 0,
                    active: 0
                }, {
                    gameId: this.gameId,
                    cardId: this.cardId,
                    status: 0,
                    active: 0
                }];
                this.emitTurnCard(turnCard);
                var query = 'SELECT * FROM `cards` WHERE `turned_by_user` IS NULL AND `game_id` = "' + this.gameId + '"';
                application.db.query(query, _.bind(this.getStats, this));
            } else {
                setTimeout(_.bind(this.resetStatus, this, result), 2000);
            }
        }
    },

    resetStatus: function(result) {
        var query = 'UPDATE `cards` SET `status` = 0 WHERE `game_id` = "' + this.gameId + '"';
        application.db.query(query, function() {});

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

    getStats: function(err, result, fields) {
        if (_.isEmpty(result)) {
            var query = 'SELECT (COUNT(`c`.`card`) / 2) AS `cnt`, `u`.`username` FROM `cards` AS `c` LEFT JOIN `users` AS `u` ON `u`.`id` = `c`.`turned_by_user` WHERE `c`.`game_id` = "' + this.gameId + '" GROUP BY `c`.`turned_by_user`';
            application.db.query(query, _.bind(this.emitFinish, this));
        }
    },

    emitFinish: function(err, result, fields) {

        var data = {
            gameId: this.gameId,
            players: []
        };

        for (var i = 0; i < result.length; i++) {
            data.players.push({
                name: result[i].username,
                count: result[i].cnt
            });
        }

        this.socket.emit('finished', data);
        this.socket.broadcast.emit('finished', data);
    },

    setGame: function(game) {
        this.game = game;
    }
});