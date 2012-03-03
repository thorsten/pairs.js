require(["order!libs/jquery.min", "order!libs/underscore-min", "order!libs/backbone-min", "order!application/router"], 
    function(jquery, underscore, backbone, router) {
        new router();
        Backbone.history.start();
});
