var Backbone = require('backbone');
var _ = require('underscore');

application.models.card = Backbone.Model.extend({

    db: null,
    socket: null,
    sessionid: null,
    cbid: null,

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

        var gameId = '';
        var cardId = '';

        this.gameId = gameId;
        this.cardId = cardId;

        // gibt es eine umgedrehte karte?
        var query = 'SELECT * FROM `cards` WHERE `active` = 1 AND `status` = 1 AND `game_id` = ' + gameId;
        this.db.query(query, _.bind(this.handleTurnedCard, this));

        // nein? -> emit und raus
        // ja? -> vergleichen
        // gleich? -> active = 0
        // beide emitten
        // ungleich -> status = 0
        // beide emitten
        // nächster spieler is dran

        this.socket.emit('reply', data);
        this.socket.broadcast.emit('turnCard', data.model.id);
        this.socket.emit('turnCard', data.model.id);
    },

    handleTurnedCard: function(err, result, fields) {
        if (_.isEmpty(result)) {
            var query = 'UPDATE'
        } else {

        }
    }

});