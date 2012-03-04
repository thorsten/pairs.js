define(["application/controllers/card", "application/controllers/login"], function(card, login) {
    return Backbone.Router.extend({
        routes: {
            'login': 'login',
            'start': 'start'
        },

        start: function() {
            var controller = new card();
            controller.startAction();
        },

        login: function() {
            var controller = new login();
            controller.loginAction();
        }
    });
});