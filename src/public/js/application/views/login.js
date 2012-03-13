define(["text!application/views/login.html"], function(template) { return Backbone.View.extend({

    className: 'login',
    tagName: 'form',

    events: {
        'submit': 'login'
    },

    render: function() {
        $(this.el).html(template);
        $('#container').html(this.el);
        $('#showError').hide();
        $('.memory-login-form').on('submit', _.bind(this.login, this));
    },

    login: function(e) {
        e.preventDefault();

        var data = {
            username: $('#username').val(),
            password: $('#password').val()
        };

        this.model.save(data, {
            'success': _.bind(this.model.onSuccess, this.model),
            'error': _.bind(this.onError, this)
        });
    },

    onError: function(e) {
        $('#showError').show(500);
        $('#showError').html('Your login is not valid');
    }
});
});