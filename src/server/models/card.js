var Backbone = require('backbone');
var _ = require('underscore');

application.models.card = Backbone.Model.extend({

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

    turnCard: function(data) {

    }

});