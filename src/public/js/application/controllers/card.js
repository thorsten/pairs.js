define(["application/models/card", "application/views/card", "application/models/cards", "application/views/cards",
    "application/views/stats"],
    function(models_card, views_card, models_cards, views_cards, views_stats) {

        function controller(){};

        controller.prototype.startAction = function(socket, id) {

            socket.socket.removeAllListeners('reply');
            socket.socket.removeAllListeners('createGame');

            var model = {
                id: id
            };

            model.url = 'game';

            var options = {'success': _.bind(this.buildGame, this)}

            Backbone.sync('join', model, options);
        };

        controller.prototype.buildGame = function(data) {
            var cards = [];

            for (var i = 0; i < data.length; i++) {
                var bg = {'background': '/img/c' + data[i].card + '.jpg'};
                var m1 = new models_card(bg);
                new views_card({model: m1});

                cards.push(m1);
            }

            var collection = new models_cards(cards);

            var collectionView = new views_cards({model: collection});
            collectionView.render();

            var statsView = new views_stats();
            statsView.render();
        };

        return controller;
    });