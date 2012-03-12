define(function() { return Backbone.View.extend({

        className: 'card memory-card',
        tagName: 'img',
    
        events: {'click': 'turnCard'},

        initialize: function() {
            this.model.on('change', _.bind(this.render, this));
        },
        
        render: function() {
            var attrs = {
                    'height': '100',
                    'width' : '100'
                    };
            
            if (this.model.get('status') == 1) {
                attrs.src = this.model.get('background');
            } else {
                attrs.src = '/img/background.jpg';
            }
            
            if (this.model.get('active') == 0) {
                $(this.el).addClass('hide');
            }
            
            $(this.el).attr(attrs);
            
            var position = this.model.getPosition();

            $('#' + position).html(this.el);
            
            this.delegateEvents();
        },

        turnCard: function() {
            this.model.toggleStatus();
        }
    });
});