define(["text!application/views/game.html"], function(template) { return Backbone.View.extend({

    className: 'game',
    tagName: 'div',

    events: {
        'click #join': 'joinGame'
    },

    initialize: function() {
        this.model.on('change', _.bind(this.render, this));
    },

    render: function() {
        var data = {
            created: this.model.get('created'),
            players: this.model.get('players')
        };

        $(this.el).html(_.template(template, data));

        if (this.model.get('finished') == 1 || this.model.get('started') == 1) {
            this.$('#join').css('display', 'none');
        }

        $('#list').append(this.el);

        this.delegateEvents();
    },

    joinGame: function() {
        this.model.save({'user': true}, {'success': _.bind(this.onJoinSuccess, this)});
    },

    onJoinSuccess: function(data) {
        window.location.hash = '#start/' + data.id;
    }

});
});