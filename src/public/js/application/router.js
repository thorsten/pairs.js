define(["application/controllers/card"], function(card) {
    return Backbone.Router.extend({
        routes: {
            'start': 'start'
        },

        start: function() {
            var controller = new card();
            controller.startAction();
        }
    });
});