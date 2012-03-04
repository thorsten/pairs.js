require(["order!libs/jquery", "order!libs/underscore", "order!libs/backbone", "order!application/router"],
    function(jquery, underscore, backbone, router) {
        new router();
        Backbone.history.start();
});
