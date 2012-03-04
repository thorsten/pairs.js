define(["text!application/views/login.html"], function(template) { return Backbone.View.extend({

    className: 'login',
    tagName: 'form',

    initialize: function() {
    },

    render: function() {
        $(this.el).html(template);
        $('#container').html(this.el);
    }
});
});