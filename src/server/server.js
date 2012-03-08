var io = require('socket.io').listen(1337);

application = {
    models: {},
    views: {}
};

io.sockets.on('connection', function (socket) {

    socket.on('login', function (data) {
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
    });

    socket.on('game', function(data) {

        require('./models/game.js');

        var game = new application.models.game();

        game.setSocket(socket);
        game.setSessionid(data.sessionid);
        game.setCbid(data.id);

        switch (data.method) {
            case 'read':
                game.getGames();
                break;
            case 'create':
                game.createGame(data);
                break;
            case 'update':
                game.joinGame(data);
                break;
        }
    });

});

console.log('Socket Server started');