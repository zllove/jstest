/**
 * @description: hogo JavaScript Util
 * @see: <a href="mailto:jikeytang@gmail.com">zyh</a>
 * @since:version 0.1
 */
;
(function(window){
    window.hogo = window.hogo || {};
    var doc     = document,
        isIE6   = !window.XMLHttpRequest;

    /**
     * 属性复制
     * @param {Object} obj
     * @param {Object} config
     */
    hogo.apply = function(obj, config, defaults){
        defaults && hogo.apply(obj, defaults);
        if(obj && config && typeof config == 'object'){
            for (var p in config) {
                obj[p] = config[p];
            }
        }
        return obj;
    };
    
    hogo.apply(hogo, {
        isIE6: isIE6,
        id: function(){
            return doc.getElementById(arguments[0]);
        },
        // 得到窗口尺寸
        viewSize: function(){
            var de = doc.documentElement;
            return {
                'width': (window.innerWidth || (de && de.clientWidth) || doc.body.clientWidth),
                'height': (window.innerHeight || (de && de.clientHeight) || doc.body.clientHeight)
            };
        }(),
        // 是否拥有某className
        hasClass: function(ele, cls){
            return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        },
        // 添加className
        addClass: function(ele, cls){
            if(!this.hasClass(ele, cls)){
                ele.className += ' ' + cls;
            }
        },
        // 移除className
        removeClass: function(ele, cls){
            if(this.hasClass(ele, cls)){
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                ele.className = ele.className.replace(reg, '');
            }
        },
        /**
         * 添加事件
         * @param ele
         * @param type
         * @param handler
         */
        addEvent: function(ele, type, handler){
            if(ele.addEventListener){
                ele.addEventListener(type, handler, false);
            } else if(ele.attachEvent){
                ele.attachEvent('on' + type, handler);
                /*
                ele.attachEvent('on' + type, function(){ // 就是这里。主要就是你在removeEvent的时候那个handler引用丢失了。
                    handler.call(ele, window.event);
                });
                */
            } else {
                ele['on' + type] = handler;
                /*
                ele['on' + type] = function(){
                    handler.call(ele, window.event);
                }
                */
            }
        },
        /**
         * 移除事件
         * @param ele
         * @param type
         * @param handler
         */
        removeEvent: function(ele, type, handler){
            if(ele.removeEventListener){
                ele.removeEventListener(type, handler, false);
            } else if(ele.detachEvent){
                ele.detachEvent('on' + type, handler);
            } else {
                ele['on' + type] = null;
            }
        },
        // 格式化事件
        getEvent: function(event) {
            return event ? event : window.event;
        },
        // 得到目标对象
        getTarget: function(event) {
            return event.target || event.srcElement;
        },
        // 阻止默认值
        preventDefault: function(event) {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }

        },
        // 阻止事件冒泡
        stopPropagation: function(event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = false;
            }
        },
        /**
         * 根据 name 得到元素　// 这儿有更好的实现： http://www.cnblogs.com/rubylouvre/archive/2009/07/24/1529640.html
         * @param name
         * @param ele
         */
        getElementsByClassName: function(name, ele){
            if(document.getElementsByClassName){ // 如果游览器支持，则直接返回
                return document.getElementsByClassName(name);
            } else {
                ele = ele || document;
                var res = [],
                    child = null,
                    regex = new RegExp("(^|\\s)" + name + "(\\s|$)");

                for(var i=0,len=ele.all.length; i<len; i++){
                    child = ele.all[i];
                    if(regex.test(child.className)){
                        res.push(child);
                    }
                }
                return res;
            }
        },
        // 得到下一个元素
        next: function(ele){
            do{
                ele = ele.nextSibling;
            } while(ele && ele.nodeType != 1);
            return ele;
        },
        /**
         * 创建html
         * @param target 标签名称
         * @param config 配置项
         */
        createHtml: function(target, config){
            target = target || 'div';
            config = config || {};
            var tag = document.createElement(target);

            for (var p in config) {
                switch(p){
                    case 'style':
                        tag.style.cssText = config[p];
                        break;
                    case 'class':
                    case 'cls':
                        tag.className = config[p];
                        break;
                    case 'html':
                        if(typeof config[p] == 'object'){
                            tag.appendChild(config[p]);
                        } else {
                            tag.innerHTML = config[p];
                        }
//                        tag.innerHTML = config[p];
                        break;
                    default:
                        tag.setAttribute(p, config[p]);
                }
            }

            //此处try为释放tag引用，否则创建的DOM永远无法被释放
            try{
                return tag;
            } finally {
                tag = null;
            }
        }

    });

})(window);