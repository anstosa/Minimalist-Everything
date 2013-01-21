(function($) {
    $.fn.tooltip = function(options) {

        options = $.extend({}, $.fn.tooltip.defaults, options);

        return this.each(function() {

            var opts = $.fn.tooltip.elementOptions(this, options);

            $(this).hover(function() {

                $.data(this, 'cancel.tooltip', true);

                var tip = $.data(this, 'active.tooltip');
                if (!tip) {
                    tip = $('<div class="tooltip"><div class="tooltip-inner"/></div>');
                    tip.css({position: 'absolute', zIndex: 100000});
                    $.data(this, 'active.tooltip', tip);
                }

                if ($(this).attr('tip') || typeof($(this).attr('original-title')) != 'string') {
                    $(this).attr('original-title', $(this).attr('tip') || '').removeAttr('tip');
                }

                var title;
                if (typeof opts.title == 'string') {
                    title = $(this).attr(opts.title == 'title' ? 'original-title' : opts.title);
                } else if (typeof opts.title == 'function') {
                    title = opts.title.call(this);
                }

                tip.find('.tooltip-inner')[opts.html ? 'html' : 'text'](title || opts.fallback);

                var pos = $.extend({}, $(this).offset(), {width: this.offsetWidth, height: this.offsetHeight});
                tip.get(0).className = 'tooltip'; // reset classname in case of dynamic gravity
                tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).appendTo(document.body);
                var actualWidth = tip[0].offsetWidth, actualHeight = tip[0].offsetHeight;
                var gravity = (typeof opts.gravity == 'function') ? opts.gravity.call(this) : opts.gravity;

                switch (gravity.charAt(0)) {
                    case 'n':
                        tip.css({top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}).addClass('tooltip-north');
                        break;
                    case 's':
                        tip.css({top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}).addClass('tooltip-south');
                        break;
                    case 'e':
                        tip.css({top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}).addClass('tooltip-east');
                        break;
                    case 'w':
                        tip.css({top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}).addClass('tooltip-west');
                        break;
                }

                if (opts.fade) {
                    tip.css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: 0.8});
                } else {
                    tip.css({visibility: 'visible'});
                }

            }, function() {
                $.data(this, 'cancel.tooltip', false);
                var self = this;
                setTimeout(function() {
                    if ($.data(this, 'cancel.tooltip')) return;
                    var tip = $.data(self, 'active.tooltip');
                    if (opts.fade) {
                        tip.stop().fadeOut(function() { $(this).remove(); });
                    } else {
                        tip.remove();
                    }
                }, 100);

            });

        });

    };

    // Overwrite this method to provide options on a per-element basis.
    // For example, you could store the gravity in a 'tooltip-gravity' attribute:
    // return $.extend({}, options, {gravity: $(ele).attr('tooltip-gravity') || 'n' });
    // (remember - do not modify 'options' in place!)
    $.fn.tooltip.elementOptions = function(ele, options) {
        return $.metadata ? $.extend({}, options, $(ele).metadata()) : options;
    };

    $.fn.tooltip.defaults = {
        fade: false,
        fallback: '',
        gravity: 'n',
        html: false,
        title: 'title'
    };

    $.fn.tooltip.autoNS = function() {
        return $(this).offset().top > ($(document).scrollTop() + $(window).height() / 2) ? 's' : 'n';
    };

    $.fn.tooltip.autoWE = function() {
        return $(this).offset().left > ($(document).scrollLeft() + $(window).width() / 2) ? 'e' : 'w';
    };

})(jQuery);