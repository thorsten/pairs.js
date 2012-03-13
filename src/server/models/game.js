var Backbone = require('backbone');
var _ = require('underscore');

application.models.game = Backbone.Model.extend({

    socket: null,
    cbid: null,

    modelData: null,

    gameId: null,
    userId: null,

    setSocket: function(socket) {
        this.socket = socket;
    },

    setCbid: function(cbid) {
        this.cbid = cbid;
    },

    getGames: function() {
        var query = 'SELECT `id`, `created`, `finished`, `started`, (SELECT COUNT(*) FROM `games_users` AS `gu` WHERE `gu`.`game_id` = `g`.`id`) AS `players` FROM `games` AS `g`';

        application.db.query(query, _.bind(this.sendGamelist, this));
    },

    sendGamelist: function(err, results, fields) {

        var response = [];

        if (!(_.isEmpty(results))) {
            response = results;
        }

        var data = {
            success: 'success',
            id: this.cbid,
            payload: response
        }

        this.socket.emit('reply', data);
    },

    createGame: function(data) {
        this.modelData = data.model;

        var db = mysql.createClient();

        var query = 'INSERT INTO games (created, started, finished) VALUES ("' +
                    data.model.created + '", "' + data.model.started + '", "' + data.model.finished + '")';
        application.db.query(query, _.bind(this.sendGameInfo, this));
    },

    createGameData: function(err, results, fields) {
        var results = results.pop();

        this.modelData['id'] = results.id;

        var models = this.getGameData();

        var query = 'INSERT INTO cards (`game_id`, `card`, `order`) VALUES ' + models.join(',');

        application.db.query(query, _.bind(this.sendGameInfoToClient, this));
    },

    getGameData: function() {
        var id = this.modelData['id'];

        var result = '';

        var models = [];
        for (var i = 1; i < 19; i++) {
            models.push(i);
            models.push(i);
        }

        models = this.shuffle(models);

        for (var i = 0; i < models.length; i++) {
            models[i] = '(' + id + ',' + models[i] + ',' + i + ')';
        }
        return models;
    },

    shuffle: function(models) {
        var tmp, rand;
        for (var i = 0; i < models.length; i++){
            rand = Math.floor(Math.random() * models.length);
            tmp = models[i];
            models[i] = models[rand];
            models[rand] = tmp;
        }
        return models;
    },

    sendGameInfo: function(err, results, fields) {
        var query = 'SELECT LAST_INSERT_ID() AS id';
        application.db.query(query, _.bind(this.createGameData, this));
    },

    sendGameInfoToClient: function(err, results, fields) {
        var data = {
            success: 'success',
            id: this.cbid,
            payload: this.modelData
        };
        this.socket.emit('reply', data);
        this.socket.broadcast.emit('createGame', this.modelData);
        this.socket.emit('createGame', this.modelData);
    },

    joinGame: function(data) {
        var query = 'REPLACE INTO games_users (user_id, game_id, `order`) VALUES ((SELECT id FROM users WHERE token = "' + data.token + '"), "' + data.model.id + '", (SELECT IF(MAX(`order`) IS NULL,1, MAX(`order`) + 1) FROM games_users AS t2 WHERE t2.game_id = "' + data.model.id + '"))';
        application.db.query(query, _.bind(this.sendJoinInfo, this));
    },

    sendJoinInfo: function(err, results, fields) {
        var data = {
            success: 'success',
            id: this.cbid,
            payload: {'join': 'true'}
        };

        this.socket.emit('reply', data);
        this.socket.broadcast.emit('createGame', {'join': 'true'});
        this.socket.emit('createGame', {'join': 'true'});
    },

    getGame: function(data) {
        var query = 'SELECT `card`, `order`, `game_id` FROM `cards` WHERE `game_id` = ' + data.model.id + ' ORDER BY `order`';
        application.db.query(query, _.bind(this.sendCards, this));
    },

    sendCards: function(err, result, fields) {
        var data = {
            success: 'success',
            id: this.cbid,
            payload: result
        };

        this.socket.emit('reply', data);
    },

    startGame: function(data) {
        this.gameId = data.model.id;

        var query = 'UPDATE `games` SET `started` = 1 WHERE `id` = "' + data.model.id + '"';
        application.db.query(query, _.bind(this.getActiveUser, this));
    },

    getActiveUser: function() {
        var query = 'SELECT `order` FROM games_users WHERE game_id = "' + this.gameId + '" AND active = 1';
        application.db.query(query, _.bind(this.findNextUser, this));
    },

    findNextUser: function(err, result, fields) {
        if (_.isEmpty(result)) {
            this.getFirstPlayer();
        } else {
            result = result.pop();
            var query = 'SELECT u.token FROM games_users AS gu LEFT JOIN users  AS u ON gu.user_id = u.id WHERE game_id = "' + this.gameId + '" AND `order` = "' + (result.order + 1) + '"';
            application.db.query(query, _.bind(this.checkIfUserExists, this));
        }
    },

    checkIfUserExists: function(err, result, fields) {
        if (_.isEmpty(result)) {
            this.getFirstPlayer();
        } else {
            this.notifyUsers(err, result, fields);
        }
    },

    getFirstPlayer: function() {
        var query = 'SELECT u.token FROM games_users AS gu LEFT JOIN users  AS u ON gu.user_id = u.id WHERE game_id = "' + this.gameId + '" AND `order` = 1';
        application.db.query(query, _.bind(this.notifyUsers, this));
    },

    notifyUsers: function(err, result, fields) {
        var result = result.pop();

        this.userId = result.token;

        // set active
        var query = 'UPDATE games_users SET active = 0 WHERE game_id = "' + this.gameId + '"';
        application.db.query(query, _.bind(this.setActive, this));

        var modelData = {
            user: result.token,
            game: this.gameId
        }

        var data = {
            success: 'success',
            id: this.cbid,
            payload: {'turn': 'result'}
        };

        this.socket.emit('reply', data);
        this.socket.broadcast.emit('turn', modelData);
        this.socket.emit('turn', modelData);
    },

    setActive: function(err, result, fields) {
        var query = 'UPDATE games_users SET active = 1 WHERE game_id = "' + this.gameId + '" AND user_id = (SELECT id FROM users WHERE token = "' + this.userId + '")';
        application.db.query(query, function() {});
    },

    setGameId: function(gameId) {
        this.gameId = gameId;
    }
});