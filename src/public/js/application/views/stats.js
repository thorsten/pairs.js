define(function() { return Backbone.View.extend({

    className: 'stats',
    tagName: 'div',

    time: 0,
    clickCount: 0,

    render: function() {
        var template = '<div style="clear:both;"><div style="float:left; margin-right: 5px;">Clicks:</div><div style="float:left; width:570px;" id="clicks">0</div><div style="float:left;" id="timer">00:00</div></div>';

        $(this.el).html(template);

        $('body').append(this.el);

        $('body').on('click', _.bind(this.clicks, this));

        this.counter();
    },

    counter: function() {
        setInterval(_.bind(this.updateCounter, this), 1000);
    },

    updateCounter: function() {
        this.time++;

        var min = Math.floor(this.time / 60);
        min = (min < 10) ? '0' + min : min;
        var sek = this.time - min * 60;
        sek = (sek < 10) ? '0' + sek : sek;

        $('#timer').html(min + ':' + sek);
    },

    clicks: function() {
        this.clickCount += 1;
        $('#clicks').html(this.clickCount);
    }
});
});