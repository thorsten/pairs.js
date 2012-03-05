define(function() { return Backbone.Model.extend({

    socket: null,

    token: null,

    defaults: {
        url: 'memory.basti.dev',
        port: '1337'
    },

    initialize: function() {
        var connect = this.get('url') + ':' + this.get('port');

        this.socket = io.connect(connect);
    },

    emit: function(ev, data) {
        this.socket.emit(ev, data);
    },

    on: function(ev, cb)  {
        this.socket.on(ev, cb);
    },

    setToken: function(token) {
        this.token = token;
    }

});
});
