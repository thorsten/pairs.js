define(function() { return Backbone.Collection.extend({

    url: 'game',
    modelView: null,

    initialize: function() {
        this.on('reset', _.bind(this.assignViews, this));
    },

    setModelView: function(view) {
        this.modelView = view;
    },

    assignViews: function() {
        this.each(_.bind(this.assignView, this));
    },

    assignView: function(model) {
        var viewClass = this.modelView;
        new viewClass({model: model});
    },

    addGame: function() {

        var date = new Date();

        var data = {
            created: this.formatNumber(date.getDate()) + '.'
                     + this.formatNumber(date.getMonth() + 1) + '.'
                     + date.getFullYear() + ' '
                     + this.formatNumber(date.getHours()) + ':'
                     + this.formatNumber(date.getMinutes()),
            started: 0,
            finished: 0
        };

        this.create(data);
    },

    formatNumber: function(number) {
        var result = number;
        if (number < 10) {
            result = '0' + number;
        }
        return result;
    }
});
});