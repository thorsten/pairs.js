define(["text!application/views/games.html"], function(template) { return Backbone.View.extend({

    tagName: 'div',
    className: 'gameList',

    events: {
        'click .add': 'addGame'
    },

    initialize: function() {
        this.model.on('reset', _.bind(this.render, this));
        this.model.on('add', _.bind(this.render, this));
    },

    render: function() {
        $('#container').html('');

        $(this.el).html(template);
        $('#container').html(this.el);

        this.model.each(function(model) {model.trigger('change');});

        this.delegateEvents();
    },

    addGame: function() {
        this.model.addGame();
    }

});
});