define(function() { return Backbone.View.extend({

    tagName: 'div',
    className: 'gameList',

    initialize: function() {
        this.model.on('change', _.bind(this.render, this));
        this.model.on('reset', _.bind(this.render, this));
        this.model.on('add', _.bind(this.render, this));
    },

    render: function() {

        console.log(this.model);

        $(this.el).html('THIS IS THE GAME LIST');

        $('#container').html(this.el);
    }

});
});