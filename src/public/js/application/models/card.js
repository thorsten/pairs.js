define(function() { return Backbone.Model.extend({

        url: 'card',

        defaults: {
            'background': '',
            'status': 0,
            'active': 0
        },

        getPosition: function() {
            return this.collection.indexOf(this);
        },

        toggleStatus: function() {
            if (!this.collection.isUsersTurn() || this.collection.moreThanTwoActive()) {
                return;
            }

            if (this.get('status') == 0 && this.get('active') == 1) {
                this.save({'status': 1}, {silent: true});
            }
        }

    });
});