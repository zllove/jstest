/*
 *  Jikey JavaScript Util
 *  Version :   0.1
 *  Author  :   haoQing
 *  Email   :   ik88@qq.com
 *  Home    :   http://jikey.cnblogs.com/
 */
J = {
    $: function() {
        return document.getElementById(arguments[0]);
    },
    //加载事件
    addEvent: function(element, type, handler) {
        if(element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if(element.attachEvent) {
            element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }
    },
    //格式化事件
    getEvent: function(event) {
        return event ? event : window.event;
    },
    //得到目标对象
    getTarget: function(event) {
        return event.target || event.srcElement;
    },
    //移除目标对象
    removeEvent: function(element, type, handler) {
        if(element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if(element.detachEvent) {
            element.detachEvent('on' + type, handler);
        } else {
            element['on' + type] = null;
        }
    },
    //阻止默认值
    preventDefault: function(event) {
        if(event.preventDefault) {
            event.preventDefault();
        } else {}
        event.returnValue = false;
    },
    //阻止事件冒泡
    stopPropagation: function(event) {
        if(event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = false;
        }
    }
}