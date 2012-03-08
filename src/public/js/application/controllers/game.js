define(["application/models/game", "application/models/games",
        "application/views/game", "application/views/games"],
    function(models_game, models_games, views_game, views_games) {

        function controller(){};

        controller.prototype.gameAction = function(socket) {
            console.log('gamelist here');

            var collection = new models_games({model: models_game});

            collection.setModelView(views_game);

            var collectionView = new views_games({model: collection});

            collection.fetch();
        };

        return controller;
    });