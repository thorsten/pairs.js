define(["text!application/views/games.html"], function(template) { return Backbone.View.extend({

    tagName: 'div',
    className: 'gameList',

    initialize: function() {
        this.model.on('reset', _.bind(this.render, this));
    },

    render: function() {
        $('#container').html(template);

        this.model.each(function(model) {model.trigger('change');});
    }

});
});