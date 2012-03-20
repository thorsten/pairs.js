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

        var query = 'SELECT * FROM `cards` WHERE `active` = 1 AND `status` = 1 AND `game_id` = ' + this.gameId;
        application.db.query(query, _.bind(this.checkOnTurnedCards, this));
    },

    checkOnTurnedCards: function(err, result, fields) {
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
                this.hit(result);
            } else {
                this.miss(result);
            }
        }
    },

    hit: function(data) {
        var query = 'UPDATE `cards` SET `active` = 0, `status` = 0, turned_by_user = (SELECT id FROM users WHERE token = "' + this.token + '") WHERE `game_id` = "' + this.gameId + '" AND (`order` = "' + this.cardId + '" OR `order` = "' + data.order + '")';
        application.db.query(query, function() {});
        var turnCard = [{
            gameId: data.game_id,
            cardId: data.order,
            status: 0,
            active: 0
        }, {
            gameId: this.gameId,
            cardId: this.cardId,
            status: 0,
            active: 0
        }];
        this.emitTurnCard(turnCard);

        var query = 'SELECT * '
                  + 'FROM `cards` '
                  + 'WHERE `turned_by_user` IS NULL AND `game_id` = "' + this.gameId + '"';
        application.db.query(query, _.bind(this.getStats, this));
        this.updateGameStats('hit');
    },

    miss: function(data) {
        setTimeout(_.bind(this.resetStatus, this, data), 2000);
        this.updateGameStats('miss');
    },

    updateGameStats: function(col) {
        var query = 'UPDATE games_users '
                  + 'SET `' + col + '` = IF (`' + col + '` IS NULL, 1, `' + col + '` + 1) '
                  + 'WHERE game_id = "' + this.gameId + '" '
                  + 'AND user_id = (SELECT `id` FROM `users` WHERE `token` = "' + this.token + '")';
        application.db.query(query, function() {});
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
            var query = 'SELECT `u`.`username`, `gu`.`hit`, `gu`.`miss`'
                      + 'FROM `cards` AS `c` '
                      + 'LEFT JOIN `users` AS `u` ON `u`.`id` = `c`.`turned_by_user` '
                      + 'LEFT JOIN `games_users` AS `gu` ON `u`.`id` = `gu`.`user_id` AND `c`.`game_id` = `gu`.`game_id` '
                      + 'WHERE `c`.`game_id` = "' + this.gameId + '" '
                      + 'GROUP BY `c`.`turned_by_user` '
                      + 'ORDER BY `gu`.`hit` DESC';
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
                hit: result[i].hit,
                miss: result[i].miss
            });
        }

        this.socket.emit('finished', data);
        this.socket.broadcast.emit('finished', data);
    },

    setGame: function(game) {
        this.game = game;
    }
});