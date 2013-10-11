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
            height : 'auto',
            ajaxType : 'GET',
            ajaxUrl : ''
        }, options);

        return this.each(function(){
            var that = this;

            that.on('click', function(){

            });
        });
    }
}(window, jQuery));
