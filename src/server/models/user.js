var Backbone = require('backbone');
var _ = require('underscore');

application.models.user = Backbone.Model.extend({

    defaultToken: 'thisIsTheDefaultToken',

    defaults: {
        username: '',
        password: ''
    },

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

    checkLogin: function() {
        var query = 'SELECT * FROM users WHERE username = "' + this.get('username') + '" AND password = MD5("' + this.get('password') + '")';

        this.db.query(query, _.bind(this.isUserLoggedIn, this));
    },

    isUserLoggedIn: function(err, results, fields) {
        if (!(_.isEmpty(results))) {
            this.generateToken();
        } else {
            this.loginResponse('error', '');
        }
    },

    loginResponse: function(success, token) {
        var data = {
            success: success,
            token: token,
            id: this.cbid,
            sessionid: this.sessionid,
            payload: ''
        }

        this.socket.emit('reply', data);
    },

    generateToken: function() {
        var token = this.defaultToken;

        var query = 'INSERT INTO users SET token = "' + token + '" WHERE username ="' + this.get('username') + '" AND password = MD5("' + this.get('password') + '")';

        this.db.query(query, _.bind(this.loginResponse, this, 'success', token));
    }
});
