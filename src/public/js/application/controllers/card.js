define(["application/models/card", "application/views/card", "application/models/cards", "application/views/cards",
        "application/views/stats"],
       function(models_card, views_card, models_cards, views_cards, views_stats) {
    
        function controller(){};
    
        controller.prototype.startAction = function() {

            var cards = [];

            for (var i = 1; i < 19; i++) {
                var data = {'background': '/img/c' + i + '.jpg'};
                var m1 = new models_card(data);
                new views_card({model: m1});
                cards.push(m1);
                var m2 = new models_card(data);
                new views_card({model: m2});
                cards.push(m2);
            }

            var collection = new models_cards(cards);
            
            collection.shuffle();
            
            var collectionView = new views_cards({model: collection});
            collectionView.render();

            var statsView = new views_stats();
            statsView.render();
        };
        
        return controller;
});