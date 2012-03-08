var io = require('socket.io').listen(1337);

application = {
    models: {},
    views: {}
};

io.sockets.on('connection', function (socket) {

    // login
    // gamelist
    // create game
    // join game
    // get game
    // turn tiles

    socket.on('login', function (data) {

        console.log(data);

        require('./models/user.js');

        var userData = {
            username: data.model.username,
            password: data.model.password
        };

        var user = new application.models.user(userData);

        user.setSocket(socket);
        user.setSessionid(data.sessionid);
        user.setCbid(data.id);

        user.checkLogin();

        // new model with username + password

        // check if user is valid

        // create token

        // reply token to user

        //socket.emit('loggedIn', {data: 'username: ' + data.username + ' password: ' + data.password});
    });

    socket.on('game', function(request) {
        /*

         { method: 'read',
         model: [ {} ],
         options: { parse: true },
         id: 1,
         sessionid: 1331186140401 }

         */

        console.log(request);

        var payload = [
            {id: 1,
            created: '08.03.2012 07:12',
            finished: false,
            players: 2}
        ];


        var data = {
            success: 'success',
            id: request.id,
            sessionid: request.sessionid,
            payload: payload
        }

        socket.emit('reply', data);

    });

});

console.log('Socket Server started');