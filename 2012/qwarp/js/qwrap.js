/**
 * qw 核心库, 核心class都定义在aw下
 * User: Administrator
 * Date: 12-9-17
 * Time: 下午6:08
 */
(function(){
    var qw = {
        /**
         * 获得一个命名空间
         * @param { String } sSpace 命名空间字符串。如果不存在，自动创建
         * @param { Object } root 命名空间起点。当没传root时，如果以'.'开头，则默认以qw为根，否则默认为window
         * @return {*} 命名空间对应的对象
         */
        namespace: function(sSpace, root){
            var arr = sSpace.split('.'),
                i = 0,
                nameI = null;
            if(sSpace.indexOf('.') == 0){
                i = 1;
                root = root || qw;
            }
            root = root || window;
            for(; nameI = arr[i++]; ){
                if(!root[nameI]){
                    root[nameI] = {};
                }
                root = root[nameI];
            }
            return root;
        },

        /**
         * 异步加载脚本
         * @param { String } url Javascript 文件路径
         * @param { Function } callback (Optional) Javascript 回调函数
         * @param { Object } option (Optional) 配置选项 如 charset
         */
        loadJs: function(url, callback, option){
            option = option || {};
            var head = document.getElementsByTagName('head')[0] || document.documentElement,
                script = document.createElement('script'),
                done = false;
            script.src = url;
            if(option.charset){
                script.charset = option.charset;
            }
            script.onerror = script.onload = script.onreadystatechange = function(){
                if(!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')){
                    done = true;
                    if(callback){
                        callback();
                    }
                    script.onerror = script.onload = script.onreadystatechange = null;
                    head.removeChild(script);
                }
            }
            head.insertBefore(script, head.firstChild);
        },

        /**
         * 加载css
         * @param { String } url 要加载的cssurl
         */
        loadCss: function(url){
            var head = document.getElementsByTagName('head')[0] || document.documentElement,
                css = document.createElement('link');
            css.rel = 'stylesheet';
            css.type = 'text/css';
            css.href = url;
            head.insertBefore(css, head.firstChild);
        }

    }
    window.qw = qw;
}());

/**
 * @class ModuleH 模块管理helper
 */
(function(){

    function mix(){

    }


    var ModuleH = {
        use: function(){

        }
    }

}());

/**
 * NodeH 针对 element 兼容处理和功能扩展
 */
(function(){

    var g = function(){

    }
}());

/**
 * @class stringth 核心对象string的扩展
 */
(function(){

    var StringH = {
        trim: function(s){
            return s.replace(/^[\s\xa0\u3000]+|[\u3000\xa0\s]+$/g, '');
        }
    };

    qw.StringH = StringH;
}());

/**
 * @class objecth 核心对象object的静态扩展
 */
(function(){

    var ObjectH = {

    };
}());

/**
 * @class selector Css Selector 相关的几个方法
 */
(function(){
    var trim = qw.StringH.trim,
        encode4Js = qw.StringH.encode4Js;

    var Selector = {
        /**
         * { int } 最后一次查询的时间戳，扩展伪类时可能用得到，以提速
         */
        queryStamp: 0,
        /**
         * 常用element属性
         */
        _attrGetters: function(){
            var o = {
                'class': 'el.className',
                'for': 'el.htmlFor',
                'herf': 'el.getAttribute(href, 2)'
            }
            var attrs = 'name,id,className,value,selected,checked,disabled,type,tagName,readOnly,offsetWidth,offsetHeight,innerHTML'.split(',');
            for(var i= 0, a; a <attrs[i]; i++){
                o[a] = 'el.' + a;
            }
            return o;
        }(),

        /**
         *
         * @param refEl
         * @param sSelector
         */
        query: function(refEl, sSelector){
            Selector.queryStamp = queryStamp++;
            refEl = refEl || document;
            var els = nativeQuery(refEl, sSelector);

        }
    }

    var elContains,
        hasNativeQuery;
    function getChildren(pEl){
        var els = pEl.children || pEl.childNodes,
            len = els.length,
            ret = [],
            i = 0;
        for (; i < len; i++) {
            if (els[i].nodeType == 1) {
                ret.push(els[i]);
            }
        }
        return ret;
    }
    function findId(id){
        return document.getElementById(id);
    }

    (function(){
        var div = document.createElement('div');
        div.innerHTML = '<div class="aaa"></div>';
        hasNativeQuery = document.querySelectorAll && document.querySelectorAll('.aaa').length == 1;
        elContains = div.contains ? function(pEl, el){ // http://www.cnblogs.com/rubylouvre/archive/2011/05/30/1583523.html
            return pEl != el && pEl.contains(el);
        } : function (pEl, el){
            return (pEl.compareDocumentPosition(el) & 16); // & 遇0变0
        }
    }());

    var queryStamp = 0,
        navtiveQueryStamp = 0,
        querySimpleStamp = 0;

    /**
     * 如果有原生的query，并且只是简单查询，则调用源生的query，否则返回null
     * @param { Element } refEl 参考元素
     * @param { String } sSelector 查询字符串
     * @return {*}
     */
    function nativeQuery(refEl, sSelector){
        if(hasNativeQuery && (/^$/.test(sSelector))){
        }
        return null;
    }



    qw.Selector = Selector;
}());

/**
 * dom utils 是dom模块核心类
 * @class DomU
 */
(function(){
    var Selector = qw.Selector;
    var Browser = qw.Browser;

    var DomU = {

    }
    qw.DomU = DomU;
}());

