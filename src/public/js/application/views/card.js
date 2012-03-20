define(['text!application/views/card.html'], function(template) { return Backbone.View.extend({

        className: 'card_container',
        tagName: 'div',

        events: {'click': 'turnCard'},

        initialize: function() {
            this.model.on('change', _.bind(this.render, this));
            this.model.on('turnCard', _.bind(this.animateTurnCard, this));
        },

        render: function() {
            if (this.model.get('active') == 0) {
                $(this.el).addClass('invisible');
            }

            $(this.el).attr({id: 'cc' + this.model.id});

            var data = {
                id: this.model.id,
                image: this.model.get('background')
            };
            $(this.el).html(_.template(template, data));

            $('#' + this.model.getPosition()).html(this.el);

            this.delegateEvents();
        },

        turnCard: function() {
            this.model.toggleStatus();
        },

        animateTurnCard: function() {
            if (this.model.get('status') == 1) {
                setTimeout(_.bind(function() {$('#c' + this.model.id).addClass('turn')}, this), 10);
            } else {
                $('#c' + this.model.id).addClass('turn');
                setTimeout(_.bind(function() {$('#c' + this.model.id).removeClass('turn')}, this), 10);
            }
        }
    });
});