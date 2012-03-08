define(["text!application/views/login.html"], function(template) { return Backbone.View.extend({

    className: 'login',
    tagName: 'form',

    events: {
        'submit': 'login'
    },

    initialize: function() {
    },

    render: function() {
        $(this.el).html(template);
        $('#container').html(this.el);
    },

    login: function(e) {
        e.preventDefault();

        var data = {
            username: $('#username').val(),
            password: $('#password').val()
        };

        this.model.save(data, {
            'success': _.bind(this.onSuccess, this)
        });
    },

    onSuccess: function() {
        window.location.hash = '#game';
    }
});
});