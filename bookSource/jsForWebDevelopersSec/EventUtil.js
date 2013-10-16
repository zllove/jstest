/**
 * event util
 * @type {Object}
 */
var EventUtil = {
    /**
     * addevent
     * @param {object} element node
     * @param {object} type    type
     * @param {object} handler handler
     */
    addEvent: function(element, type, handler) {
        if(element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if(element.attachEvent) {
            element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }
    },

    getEvent: function(event) {
        return event ? event : window.event;
    },

    getTarget: function(event) {
        event = this.getEvent(event);
        return event.target || event.srcElement;
    },

    // 取消事件的默认行为
    preventDefault: function(event) {
        if(event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },

    // 阻止事件流
    stopPropagation: function(event) {
        if(event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },

    removeEvent: function(element, type, handler) {
        if(element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if(element.detachEvent) {
            element.detachEvent('on' + type, handler);
        } else {
            element['on' + type] = null;
        }
    },

    // 相关元素
    getRelatedTarget: function(event) {
        if(event.relatedTarget) {
            return event.relatedTarget;
        } else if(event.toElement) {
            return event.toElement;
        } else if(event.fromeElement) {
            return event.fromeElement;
        } else {
            return null;
        }
    },
    // 鼠标按钮
    getButton: function(event) {
        if (document.implementation.hasFeature('MouseEvents', '2.0')) {
            return event.button;
        } else{
            switch(event.button){
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                case 2:
                case 6:
                    return 2;
                case 4:
                    return 1;
            }
        };
    },
    // 得到鼠标状态
    getWheelDelta: function (event) {
        if (event.wheelDelta) {
            return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
        } else{
            return -event.wheelDelta * 40;
        };
    },
    // 键盘编码
    getCharCode: function(event) {
        if (typeof event.charCode == 'number') { // ie9,firefox,chrome,safari
            return event.charCode;
        } else{
            return keyCode;
        };
    },
    // 获得剪切板
    getClipboardtext: function(event) {
        var clipboardData = (event.clipboardData || window.clipboardData);
        return clipboardData.getData('text');
    },
    // 设置剪切板
    setClipboardText: function (event, value) {
        if (event.clipboardData) {
            return event.clipboardData.setData('text/plain', value);
        } else if(window.clipboardData){
            return window.clipboardData.setDate('text', value);
        };
    }
}