define(function() { return Backbone.Model.extend({

        defaults: {
            'background': '',
            'status': 0,
            'active': 0
        },

        getPosition: function() {
            return this.collection.indexOf(this);
        },

        toggleStatus: function() {
            if (!this.collection.isUsersTurn()) {
                return;
            }

            if (this.get('status') == 0 && this.get('active') == 1) {
                this.set({'status': 1});
            }
        }

    });
});