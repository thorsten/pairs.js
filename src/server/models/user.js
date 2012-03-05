var Backbone = require('backbone');
var _ = require('underscore');

application.models.user = Backbone.Model.extend({

    defaults: {
        username: '',
        password: ''
    },

    db: null,
    socket: null,

    initialize: function() {
        /*this.db = require('./db.js');
        //this.db = client;*/

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

    checkLogin: function() {
        var query = 'SELECT * FROM users WHERE username = "' + this.get('username') + '" AND password = MD5("' + this.get('password') + '")';

        this.db.query(query, _.bind(this.isUserLoggedIn, this));
    },

    isUserLoggedIn: function(err, results, fields) {
        if (!(_.isEmpty(results))) {
            this.generateToken();
        }

        this.loginResponse(false, '');
    },

    loginResponse: function(success, token) {
        var data = {
            success: success,
            token: token
        }

        this.socket.emit('loginSuccess', data);
    },

    generateToken: function() {
        var token = '';

        var query = 'INSERT INTO users SET token = "' + token + '" WHERE username ="' + this.get('username') + '" AND password = MD5("' + this.get('password') + '")';

        this.db.query(query, _.bind(this.loginResponse, this, true, token));
    }
});
