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

        require('./models/user.js');

        var userData = {
            username: data.username,
            password: data.password
        };

        var user = new application.models.user(userData);

        console.log(user);

        user.setSocket(socket);

        user.checkLogin();

        // new model with username + password

        // check if user is valid

        // create token

        // reply token to user

        //socket.emit('loggedIn', {data: 'username: ' + data.username + ' password: ' + data.password});
    });
});

console.log('Socket Server started');