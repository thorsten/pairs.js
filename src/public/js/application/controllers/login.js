define(["application/models/login", "application/views/login"],
    function(models_login, views_login) {

        function controller(){};

        controller.prototype.loginAction = function(socket) {

            var loginModel = new models_login();
            var loginView = new views_login();
            loginView.render();
        };

        return controller;
    });