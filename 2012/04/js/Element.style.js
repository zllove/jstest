/**
 * Created by JetBrains PhpStorm.
 * User: jikey
 * Date: 12-4-22
 * Time: 下午4:18
 * To change this template use File | Settings | File Templates.
 */
Ice.Element.addMethods(function(){
    var supports = Ice.supports,
        propCache = {},
        camelRe = /(-[a-z])/gi,
        view = document.defaultView,
        opacityRe = /alpha\(opacity=(.*)\)/i,
        trimRe = /^\s+|\s+$/g, // 匹配首尾空格
        EL = Ice.element,
        spacesRe = /s+/; // 匹配空格

    function camelFn(m, a){
        return a.charAt(1).toUpperCase();
    }
    function chkCache(prop){
        return propCache[prop] || (propCache[prop] = prop == 'float' ? (supports.cssFloat ? 'cssFloat' : 'styleFloat') : prop.replace(camelRe, camelFn));
    }
    return {
        /**
         * 设置元素的样式，也可以用一个对象参数包含多个样式
         * @param prop String/Object 要设置的样式属性，或是包含多个样式的对象
         * @param value String (可选)需要应用到给定属性的值，如果传递的是一个object，此值为null.
         */
        setStyle: function(prop, value){
            var tmp, style;
            if(typeof prop != 'object'){
                tmp = {};
                tmp[prop] = value;
                prop = tmp;
            }
            for (style in prop) {
                value = prop[style];
                style == 'opacity' ? this.setOpacity(value) : this.dom.style[chkCache(style)] = value;
            }
            return this;
        },
        addClass: function(className){
            var me = this,
                i,
                len,
                v,
                cls = [];
            if(!Ice.isArray(className) && typeof className == 'string'){ // 如果不是数组
                me.dom.classsName += ' ' + className;
            } else { // 如果是数组
                for(i=0,len=className.length; i<len; i++){
                    v = className[i];
                    if(typeof v == 'string' && (' ' + className + ' ').indexOf(' ' + v + ' ') == -1){
                        cls.push(v);
                    }
                }
                if(cls.length){
                    me.dom.className += ' ' + cls.join(' ');
                }
            }
            return me;
        },
        removeClass: function(className){
            var me = this,
                cls,
                elClasses,
                idx,
                i, len;
            if(!Ice.isArray(className)){
                className = [className];
            }
            if(me.dom && me.dom.className){
                elClasses = me.dom.className.replace(trimRe, '').split(spacesRe); // 去除前后的空格，并用空格分割
                for(i=0,len=className.length; i<len; i++){
                    cls = className[i];
                    if(typeof cls == 'string'){
                        cls = cls.replace(trimRe, ''); // 替换首尾的空格
                        idx = elClasses.indexOf(cls); // 寻找className在数组的位置
                        if(idx != -1){
                            elClasses.splice(idx, 1);
                        }
                    }
                }
                me.dom.className = elClasses.join(' ');
            }
            return me;
        },
        toggleClass: function(className){
            return this.hasClass(className) ? this.removeClass(className) :$ this.addClass(className);
        },
        hasClass: function(className){
            return className && (' ' + this.dom.className + ' ').indexOf(' ' + className + ' ') != -1;
        },
        replaceClass: function(oldClassName, newClassName){
            return this.removeClass(oldClassName).addClass(newClassName);
        },
        isStyle: function(style, val){
            return this.getStyle(style) == val;
        },
        getStyle: function(){

        }
    };
}());