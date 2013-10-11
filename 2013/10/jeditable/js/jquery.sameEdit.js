/**
 * @author: zyh
 * @see: <a href="mailto:jikeytang@gmail.com">zyh</a>
 * @time: 2013-10-11 上午11:38
 * @info:
 */
;(function(win, $){
    $.fn.sameEdit = function(options){
        var opts = $.extend({}, {
            type : 'text',
            width : 'auto',
            height : 'auto'
        }, options);

        console.log(opts.type);

    }
}(window, jQuery));
