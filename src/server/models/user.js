var Backbone = require('backbone');
var _ = require('underscore');

application.models.user = Backbone.Model.extend({

    defaultToken: 'thisIsTheDefaultToken',

    defaults: {
        username: '',
        password: ''
    },

    socket: null,
    sessionid: null,
    cbid: null,

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

        application.db.query(query, _.bind(this.isUserLoggedIn, this));
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
        var token = new Date().getTime();

        var query = 'UPDATE users SET token = "' + token + '" WHERE username ="' + this.get('username') + '" AND password = MD5("' + this.get('password') + '")';

        application.db.query(query, _.bind(this.loginResponse, this, 'success', token));
    }
});
