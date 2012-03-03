define(function() { return Backbone.Collection.extend({

        activeFirst: null,
        activeSecond: null,
        timeout: null,
    
        initialize: function() {
            this.on('change', _.bind(this.handleStatusChange, this));
        },
    
        shuffle: function() {
            var tmp, rand;
            for (var i = 0; i < this.length; i++){
                rand = Math.floor(Math.random() * this.length);
                tmp = this.models[i]; 
                this.models[i] = this.models[rand]; 
                this.models[rand] = tmp;
            }
        },
        
        handleStatusChange: function(card) {
            if (card.get('active') == 1 && card.get('status') == 1) {
                if (this.timeout != null) {
                    clearTimeout(this.timeout);
                    this.timeout = null;
                    this.disableCards();
                }
                
                if (this.activeFirst == null) {
                    this.activeFirst = card;
                    return;
                }
                
                if (card.cid == this.activeFirst.cid) {
                    return;
                }
                
                this.activeSecond = card;
                
                if (this.activeFirst.get('background') == this.activeSecond.get('background')) {
                    var data = {'active': 0};
                    this.activeFirst.set(data);
                    this.activeSecond.set(data);
                    this.activeFirst = null;
                    this.activeSecond = null;
                } else {
                    this.timeout = setTimeout(_.bind(this.disableCards, this), 2000);
                }
            }
        },
        
        disableCards: function() {
            if (null != this.activeFirst && null != this.activeSecond) {
                var data = {'status': 0};
                this.activeFirst.set(data);
                this.activeSecond.set(data);
                
                this.activeFirst = null;
                this.activeSecond = null;
            }
        }

    });
});