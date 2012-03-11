define(function() { return Backbone.Model.extend({

    url: 'login',

    onSuccess: function(data) {
        window.location.hash = '#game';
    }

});
});