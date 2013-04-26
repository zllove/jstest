/**
 * @author: jikey
 * @see: <a href="mailto:jikeytang@gmail.com">jikey</a>
 * @time: 2013-4-25 下午3:00
 * @info:
 */
var mframe = {
    /**
     * 模拟单击，比普通的click快一点
     * @param el
     * @param fn
     */
    tap : function(el, fn){
        var disX = 0,
            disY = 0;

        el.addEventListener('touchstart', function(e){
            disX = e.touches[0].clientX;
            disY = e.touches[0].clientY;

            document.addEventListener('touchend', handleEnd, false);
        }, false);

        function handleEnd(e){
            var endX = e.changedTouches[0].clientX;
            var endY = e.changedTouches[0].clientY;

            if(Math.abs(endX - disX) < 5 && Math.abs(endY - disY) < 5){
                fn.call(el, e);
            }
            document.removeEventListener('touchend', handleEnd, false);
        }
    },
    ua : {
        that : this,
        version : 0,
        browser : '',
        ua : navigator.userAgent,
        isDevice : function(d){

        },
        isBrowser : function(b){

        }
    },
    android : function(){
        this.ua = navigator.userAgent;

    }

}