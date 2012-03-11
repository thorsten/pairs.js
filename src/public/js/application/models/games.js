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
            created: date.getDate() + '.' + (date.getMonth() + 1) + '.' +  date.getFullYear() + ' '
                     + date.getHours() + ':' + date.getMinutes(),
            started: 0,
            finished: 0
        };

        this.create(data);
    }
});
});