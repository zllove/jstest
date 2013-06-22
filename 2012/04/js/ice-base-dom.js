/**
 * Created by jikey.
 * Link: jikeytang@gmail.com
 * Date: 12-5-24
 * Time: 上午11:37
 * Info:
 */
(function(){
    var doc = document,
        isCSS1 = doc.compatMode == 'CSS1Compat', // 标准模式， BackCompat: 怪异模式
        MAX = Math.max, 
        ROUND = Math.round,
        PARSEINT = parseInt;

    Ice.lib.Dom = {
        // p 是否包含 c
        isAncestor: function(p, c){
            var ret = false;

            p = Ice.getDom(p);
            c = Ice.getDom(c);
            if(p && c){
                if(p.contains){
                    return p.contains(c);
                } else if(p.compareDocumentPosition) {
                    return !!(p.compareDocumentPosition(c) & 16);
                } else {
                    while((c = c.parentNode)){
                        ret = c == p || ret;
                    }
                }
            }
            return ret;
        },
        // 如果full为true返回文档大小即实际宽度，如果为false返回可视窗口大小
        getViewWidth: function(full){
            return full ? this.getDocumentWidth() : this.getViewportWidth();
        },
        // 如果full为true返回文档大小即实际高度，如果为false返回可视窗口大小
        getViewHeight: function(full){
            return full ? this.getDocumentHeight() : this.getViewportHeight();
        },
        // 实际宽度
        getDocumentWidth: function(){
            return MAX(!isCSS1 ? doc.body.scrollWidth : doc.documentElement.scrollWidth, this.getViewportWidth());
        },
        // 实际高度
        getDocumentHeight: function(){
            return MAX(!isCSS1 ? doc.body.scrollHeight : doc.documentElement.scrollHeight, this.getViewportHeight());
        },
        // 可视宽度
        getViewportWidth: function(){
            return !Ice.isStrict && !Ice.isOpera ? doc.body.clientWidth : Ice.isIE ? doc.documentElement.clientWidth : self.innerWidth;
        },
        // 可视高度
        getViewportHeight: function(){
            return Ice.isIE ? (Ice.isStrict ? doc.documentElement.clientHeight : doc.body.clientHeight) : self.innerHeight;
        },
        // 得到给定元素的 [top, left]
        getXY: function(el){



        }
    }

})();