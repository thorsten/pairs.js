require(["order!libs/jquery", "order!libs/underscore", "order!libs/backbone", "order!libs/socket.io", "order!application/router"],
    function(jquery, underscore, backbone, socket, router) {
        new router();
        Backbone.history.start();
});
