var Backbone = require('backbone');
var _ = require('underscore');

application.models.game = Backbone.Model.extend({

    db: null,
    socket: null,
    sessionid: null,
    cbid: null,

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

    getGames: function() {
        var query = 'SELECT `id`, `created`, `finished`, `started`, (SELECT COUNT(*) FROM `games_users` AS `gu` WHERE `gu`.`game_id` = `g`.`id`) AS `players` FROM `games` AS `g`';

        this.db.query(query, _.bind(this.sendGamelist, this));
    },

    sendGamelist: function(err, results, fields) {

        var response = [];

        if (!(_.isEmpty(results))) {
            response = results;
        }

        var data = {
            success: 'success',
            id: this.cbid,
            sessionid: this.sessionid,
            payload: response
        }

        this.socket.emit('reply', data);
    },

});