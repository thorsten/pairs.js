define(function() { return Backbone.Model.extend({

    socket: null,

    defaults: {
        url: 'socket.basti.dev',
        port: '1337'
    },

    initialize: function() {
        var connect = this.get('url') + ':' + this.get('port');

        this.socket = io.connect(connect);
    }

});
});
