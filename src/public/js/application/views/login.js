define(["text!application/views/login.html"], function(template) { return Backbone.View.extend({

    className: 'login',
    tagName: 'form',

    events: {
        'submit': 'login'
    },

    render: function() {
        $(this.el).html(template);
        $('#container').html(this.el);
        $('.memory-login-form').on('submit', _.bind(this.login, this));
    },

    login: function(e) {
        e.preventDefault();

        var data = {
            username: $('#username').val(),
            password: $('#password').val()
        };

        this.model.save(data, {
            'success': _.bind(this.model.onSuccess, this.model)
        });
    }
});
});