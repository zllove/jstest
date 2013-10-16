/**
 * Created by JetBrains PhpStorm.
 * User: jikey
 * Date: 12-2-6
 * Time: 上午10:23
 * To change this template use File | Settings | File Templates.
 */
(function(window){
    // ADS 命名空间
//    if(!window.ADS) { window['ADS'] = {}; };
    window.ADS = window.ADS || {};
    ADS = {
        node: {
            ELEMENT_NODE               :1,
            ATTRIBUTE_NODE             :2,
            TEXT_NODE                  :3,
            CDATA_SECTION_NODE         :4,
            ENTITY_REFERENCE_NODE      :5,
            ENTITY_NODE                :6,
            PROCESSING_INSTRUCTION_NODE:7,
            COMMENT_NODE               :8,
            DOCUMENT_NODE              :9,
            DOCUMENT_TYPE_NODE         :10,
            DOCUMENT_FRAGMENT_NODE     :11,
            NOTATION_NODE              :12
        },
        // document.getElementById 替代方法
        $: function(){
            var elements = [];
            for(var i=0; i<arguments.length; i++){
                var element = arguments[i];
                if(typeof element == 'string'){
                    element = document.getElementById(element);
                }
                if(arguments.length == 1){
                    return element;
                }
                elements.push(element);
            }
            return elements;
        },
        // 确定当前浏览器是否与整个库兼容
        isCompatible: function(other){
            if(other === false || !Array.prototype.push || !Object.hasOwnProperty || !document.createElement || !document.getElementsByTagName){
                alert('TR- if you see this message isCompatible is failing incorrectly.');
                return false;
            }
            return true;
        },
        // 添加事件支持
        addEvent: function(node, type, listener){
            var that = this;
            if(!that.isCompatible()){ return false; }
            if(!(node = that.$(node))){ return false; }
            if(node.addEventListener){ // w3c   标准浏览器直接使用addeventListener绑定事件。
                node.addEventListener(type, listener, false);
            } else if(node.attachEvent){ // ie  IE为了解决attachEvent丢失this引用的bug，进行一些包装处理
                // 创建一个属性来保存事件响应函数,并使其可以得到this的引用
                node['e' + type + listener] = listener; // 方法名['e'+type+listener]只是一个自定义的约定，好在必要的时候按约定删除这个响应函数
                // 重新包装这个函数，把IE的事件对象传进去（并不是必须的,因为内部一样可以直接使用event对象），
                // 使其可以象FF等标准浏览器一样从参数中得到这个事件对象。
                // 而且函数名不一定要用node[type+listener],也可以用一个局部变量如var tmp=fn来标识这个包装后的函数。
                node[type + listener] = function(){
                    node['e' + type + listener](window.event);
                }
                node.attachEvent('on' + type, node[type + listener]);
                return true;
            }
            return false; // 若两种方法都不支持返回false
        },
        // 移除事件
        removeEvent: function(node, type, listener){
            var that = this;
            if(!(node = that.$(node))){ return false; }
            if(node.removeEventListener){ // w3c
                node.removeEventListener(type, listener, false);
                return true;
            } else if(node.detachEvent){
                node.detachEvent('on' + type, node[type + listener]);
                node[type + listener] = null;
                return true;
            }
            return false;
        },
        /**
         * 得到class
         * @param className 类名
         * @param tag 标签名
         * @param parent 父元素，如果为空，则为document
         */
        getElementsByClassName: function(className, tag, parent){
            var that = this;
            parent = parent || document;
            if(!(parent = that.$(parent))){ return false; }
            // 查找所有的标签
            var allTags = (tag == '*' && parent.all) ? parent.all : parent.getElementsByTagName(tag),
                matchingElements = [];
            // 创建一个正则表达式，来判断className是否正确
            className = className.replace(/\-/g, '\\-');
            var regex = new RegExp('(^|\\s)' + className + '(\\s|$)'),
                element;
            // 检查每个元素
            for(var i=0; i<allTags.length; i++){
                element = allTags[i];
                if(regex.test(element.className)){
                    matchingElements.push(element);
                }
            }
            return matchingElements;
        },
        /**
         * 切换可见性
         * @param node
         * @param value 设置显示后的默认值
         */
        toggleDisplay: function(node, value){
            var that = this;
            if(!(node = that.$(node))){ return false; }
            node.style.display = node.style.display != 'none' ? 'none' : (value || '');
            return that;
        },
        /**
         * 在其后插入元素
         * @param node 要插入的节点
         * @param referenceNode 在此节点之后插入新节点
         */
        insertAfter: function(node, referenceNode){
            var that = this;
            if(!(node = that.$(node))){ return false; }
            if(!(referenceNode = that.$(referenceNode))){ return false; }
            return referenceNode.parentNode.insertBefore(node, referenceNode.nextSibling);
        },
        /**
         * 移除子元素
         * @param parent 父节点
         */
        removeChildren: function(parent){
            var that = this;
            if(!(parent = that.$(parent))){ return false; }
            // 当存在子节点时删除该子节点
            while(parent.firstChild){
                parent.firstChild.parentNode.removeChild(parent.firstChild);
            }
            return parent;
        },
        /**
         * 在子节点前插入
         * @param parent 父节点
         * @param newChild 新节点
         */
        prependChild: function(parent, newChild){
            var that = this;
            if(!(parent = that.$(parent))){ return false; }
            if(!(newChild = that.$(newChild))){ return false; }
            if(parent.firstChild){ // 如果存在子节点则在这个子节点之前插入
                parent.insertBefore(newChild, parent.firstChild);
            } else { // 如果没有子节点，则直接插入
                parent.appendChild(newChild);
            }
            return parent;
        },
        /**
         * 给对象绑定方法
         * @param obj
         * @param func
         */
        bindFunction: function(obj, func){
            return function(){
                func.apply(obj, arguments);
            }
        },
        /**
         * 日志记录
         * @param id
         */
        myLogger: function(id){
            function myLog(id){
                id = id || 'ADSLogWindow';
                var logWindow = null;
                var createWindow = function(){};
                this.writeRaw = function(message){};
            };
            myLog.prototype = {
                write: function(){ },
                header: function(){ }
            };
            return new myLog();
        },
        // 得到窗口大小
        getBrowserWindowSize: function(){
            var de = document.documentElement;
            return {
                'width': (window.innerWidth || (de && de.clientWidth) || document.body.clientWidth),
                'height': (window.innerHeight || (de && de.clientHeight) || document.body.clientHeight)
            }
        },
        // 把word-word转换为wordWord
        camelize: function(s){
            return s.replace(/-(\w)/g, function(strMatch, p1){
                return p1.toUpperCase();
            });
        },
        // camelize 反方法
        uncamelize: function(s, sep){
            sep = sep || '-';
            return s.replace(/([a-z])([A-Z])/g, function(strMatch, p1, p2){
                return p1 + sep + p2.toLowerCase();
            });
        },
        /**
         * 寻找DOM递归方法
         * @param own call方法使func中的this指向root，为保证generateDOM的this在func中引用的一致性，只好再传一次
         * @param func
         * @param node 节点
         * @param depth 深度
         * @param returnedFromParent
         */
        walkTheDOMRecursive: function(own, func, node, depth, returnedFromParent){
            var that = this,
                root = node || document,
                returnedFromParent = func.call(root, own, depth++, returnedFromParent),
                node = root.firstChild;
            while(node){
                that.walkTheDOMRecursive(own, func, node, depth, returnedFromParent);
                node = node.nextSibling;
            }
        },
        // 取得标准化事件对象
        getEventObject: function(W3CEvent){
            return W3CEvent || window.event;
        },
        // 阻止事件冒泡
        // 调用该方法后，事件处理程序被调用，不再被分派到其它节点
        stopPropagation: function(eventObject){
            eventObject = eventObject || this.getEventObject(eventObject);
            if(eventObject.stopPropagation){ // w3c
                eventObject.stopPropagation();
            } else { // ie
                eventObject.cancelBubble = true; // 如果事件句柄想阻止事件传播到包容对象，必须把该属性设为 true
            }
        },
        // 取消默认动作, 通知浏览器不要执行与事件关联的默认动作
        preventDefault: function(eventObject){
            eventObject = eventObject || this.getEventObject(eventObject);
            if(eventObject.preventDefault){ // w3c
                eventObject.preventDefault();
            } else { // ie
                eventObject.returnValue = false; // 如果设置了该属性，它的值比事件句柄的返回值优先级高。把这个属性设置为 fasle，可以取消发生事件的源元素的默认动作
            }
        },
        /**
         * load 事件在图像载入完成之前运行
         * @param loadEvent
         * @param waitForIamges 等待标记，如果为 true, 则使用常规方法
         */
        addLoadEvent: function(loadEvent, waitForIamges){
            if(!this.isCompatible()) { return false; }
            if(waitForIamges){
                return this.addEvent(window, 'load', loadEvent);
            }
            // 以便为this关键字指定正确的内容，同时确保事件不会被执行两次
            var init = function(){
                // 如果这个函数被调用过了则返回
                if(arguments.callee.done) { return; }
                // 标记这个函数，以便检验它是否运行过
                arguments.callee.done = true;
                // 在document的环境中载入事件
                loadEvent.apply(document, arguments);
            };
            // Firefox 事件监听
            if(document.addEventListener){
                document.addEventListener('DOMContentLoaded', init, false);
            }
            // 对Chrome,Safari 使用setInterval检测document是否载入完成
            if(/WebKit/i.test(navigator.userAgent)){
                var _timer = setInterval(function(){
                    if(/loaded|complete/.test(document.readyState)){
                        clearInterval(_timer);
                        init();
                    }
                }, 10);
            }
            // 对于ie(使用条件注释)附加一个在载入过程最后执行的脚本，并检测该脚本是否载入完成
            /*@cc_on @*/
            /*@if (@_win32)
            document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
            var script = document.getElementById("__ie_onload");
            script.onreadystatechange = function() {
                if (this.readyState == "complete") {
                   init();
                }
            };
            /*@end @*/
            return true;
        },
        // 得到事件的目标元素
        getTarget: function(eventObject){
            eventObject = this.getEventObject(eventObject);
            // 如果是w3c或msie
            var target = eventObject.target || eventObject.srcElement;
            // 如果是safari中是一个文本元素，则重新将目标元素指向父元素
            if(target.nodeType == this.node.TEXT_NODE){
                target == node.parentNode;
            }
            return target;
        },
        // 检测鼠标状态
        getMouseButton: function(eventObject){
            eventObject = this.getEventObject(eventObject);
            // 选用一个适当的属性初始化为一个对象变量
            var buttons = {
                'left': false,
                'middle': false,
                'right': false
            };
            // 检查eventObject对象的toString()方法的值，w3cDOM对象有toString()方法并且此时该的返回值应用是MouseEvent
            if(eventObject.toString && eventObject.toString().indexOf('MouseEvent') != -1){
                // w3c
                switch(eventObject.button){
                    case 0:
                        buttons.left = true;
                        break;
                    case 1:
                        buttons.middle = true;
                        break;
                    case 2:
                        buttons.right = true;
                        break;
                    default:
                        break;
                } 
            } else if(eventObject.button){
                // msie
                switch(eventObject.button){
                    case 1:
                        buttons.left = true;
                        break;
                    case 2:
                        buttons.right = true;
                        break;
                    case 3:
                        buttons.left = true;
                        buttons.right = true;
                        break;
                    case 4:
                        buttons.middle = true;
                        break;
                    case 5:
                        buttons.left = true;
                        buttons.middle = true;
                        break;
                    case 6:
                        buttons.middle = true;
                        buttons.right = true;
                        break;
                    case 7:
                        buttons.left = true;
                        buttons.middle = true;
                        buttons.right = true;
                        break;
                    default:
                        break;
                }
            } else {
                return false;
            }
            return buttons;
        },
        // 获得鼠标的位置
        getPointerPositionInDocument: function(eventObject){
            eventObject = eventObject || this.getEventObject(eventObject);
            var x = eventObject.pageX || (eventObject.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)),
                y = eventObject.pageY || (eventObject.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
            return { 'x': x, 'y': y };
        },
        // 获得键盘按键
        getKeyPressed: function(eventObject){
            eventObject = this.getEventObject(eventObject);
            var code = eventObject.keyCode,
                value = String.fromCharCode(code);
            return { 'code': code, 'value': value }
        },
        // 通过id修改样式
        setStyleById: function(element, styles){
            var that = this;
            if(!(element = that.$(element))){ return false; }
            for(var property in styles){
                if(!styles.hasOwnProperty(property)) continue;
                /*
                if(element.style.setProperty){ // DOM2样式规范方法 此种方法在 ie9 下会报错
                    element.style.setProperty(that.uncamelize(property, '-'), styles[property], null);
                } else { // ie
                    element.style[that.camelize(property)] = styles[property];
                }
                */
                element.style[that.camelize(property)] = styles[property];
            }
            return true;
        },
        // 通过类名修改多个元素样式
        setStylesByClassName: function(parent, tag, className, styles){
            var that = this;
            if(!(parent = that.$(parent))){ return false; }
            var elements = that.getElementsByClassName(className, tag, parent);
            for(var i=0,len=elements.length; i<len; i++){
                that.setStyleById(elements[e], styles);
            }
            return true;
        },
        // 通过标签名修改多个元素样式
        setStylesByTagName: function(tagname, styles, parent){
            var that = this;
            parent = $(parent) || document;
            var elements = parent.getElementsByTagName(tagname);
            for(var i=0,len=elements.length; i<len; i++){
                that.setStyleById(elements[e], styles);
            }
            return true;
        },
        /**
         * 根据类名取得元素
         * @param element
         * @return Array
         */
        getClassNames: function(element){
            if(!(parent = this.$(parent))){ return false; }
            // 用一个空格替换多个空格，然后基于空格分割类名
            return element.className.replace(/\s+/, '').split('');
        },
        // 检查元素中是否存在某个类
        hasClassName: function(element, className){
            if(!(element = this.$(element))){ return false; }
            var classes = this.getClassNames(element);
            for(var i=0,len=classes.length; i<len; i++){
                if(classes[i] === className) { return true; }
            }
            return false;
        },
        // 为元素添加类
        addClassName: function(element, className){
            if(!(element = this.$(element))){ return false; }
            element.className += (element.className ? ' ' : '') + className;
            return true;
        },
        removeClassName: function(element, className){
            if(!(element = this.$(element))){ return false; }
            var classes = this.getClassNames(element),
                length = classes.length;
            // 循环遍历数组删除匹配的项，因为数组中删除项会使数组变短，所以要反向循环
            for(var i=length-1; i>0; i--){
                if(classes[i] === className){ delete(classes[i]); }
            }
            element.className = classes.join(' ');
            return (length == classes.length ? false : true);
        },
        /**
         * 添加新样式表
         * @param url
         * @param media 用于限制执行样式表的设备类型
         */
        addStyleSheet: function(url, media){
            media = media || 'screen';
            var link = document.createElement('LINK');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = url;
            link.media = media;
            document.getElementsByTagName('head')[0].appendChild(link);
        },
        // 移除样式表
        removeStyleSheet: function(url, media){
            var styles = this.getStyleSheets(url, media);
            for(var i=0,len=styles.length; i<len; i++){
                var node = styles[i].ownerNode || styles[i].owningElement;
                // 禁用样式表
                styles[i].disabled = true;
                // 移除节点
                node.parentNode.removeChild(node);
            }
        },
        // 通过url取得包含所有样式表的数组
        getStyleSheets: function(url, media){
            var sheets = [];
            for(var i=0,len=document.styleSheets.length; i<len; i++){
                if(url && document.styleSheets[i].href.indexOf(url) == -1){ continue; }
                if(media){
                    // 规范化 media 字符串
                    media = media.replace(/,\s*/, ',');
                    var sheetMedia;
                    if(document.styleSheets[i].media.mediaText){
                        // DOM 方法
                        sheetMedia = document.styleSheets[i].media.mediaText.replace(/,\s*/, ',');
                        // Safari 会添加额外的逗号和空格
                        sheetMedia = sheetMedia.replace(/,\s*$/,'');
                    } else { // IE
                        sheetMedia = document.styleSheets[i].media.replace(/,\s*/, ',');
                    }
                    // 如果 media 不匹配则跳过
                    if(media != sheetMedia) { continue; }
                }
                sheets.push(document.styleSheets[i]);
            }
            return sheets;
        },
        /**
         * 编辑一条样式规则
         * @param selector 选择器
         * @param styles 样式
         * @param url 地址
         * @param media 输出设备
         */
        editCSSRules: function(selector, styles, url, media){
            var that = this, 
                styleSheets = (typeof url == 'Array' ? url : that.getStyleSheets(url, media));
            for(var i=0, len=styleSheets.length; i<len; i++){
                // 取得规则样式表，DOM2或IE分别采用不同的方式
                var rules = styleSheets[i].cssRules || styleSheets[i].rules;
                if(!rules) continue;
                // 由于 IE 默认是大写，则转换为大写
                selector = selector.toUpperCase();
                for(var j=0, l=rules.length; j<l; j++){
                    // 检查是否匹配
                    if(rules[j].selectorText.toUpperCase() == selector){
                        for(property in styles){
                            if(!styles.hasOwnProperty(property)) continue;
                            // 设置新的样式属性
                            rules[j].style[that.camelize(property)] = styles[property];
                        }
                    }
                }
            }
        },
        /**
         * 添加一条 CSS 规则
         * @param selector
         * @param styles
         * @param index
         * @param url
         * @param media
         */
        addCSSRule: function(selector, styles, index, url, media){
            var that = this, declaration = '';
            // 根据 styles 参数(样式对象)构造声明字符串
            for(var property in styles){
                if(!styles.hasOwnProperty(property)){ continue; }
                declaration += property + ':' + styles[property] + ';';
            }
            var styleSheets = (typeof url == 'Array' ? url : that.getStyleSheets(url, media)),
                newIndex;
            for(var i=0, len=styleSheets.length; i<len; i++){
                // 添加规则
                if(styleSheets[i].insertRule){
                    // DOM2方法，index = length 是列表末尾
                    newIndex = (index >= 0 ? index : styleSheets[i].cssRules.length);
                    styleSheets[i].insertRule(selector + '{' + declaration + '}', newIndex);
                } else if(styleSheets[i].addRule) {
                    // IE 方法, index = -1 是列表末尾
                    newIndex = (index >= 0 ? index : - 1);
                    styleSheets[i].addRule(selector, declaration, newIndex);
                }
            }
        },
        /**
         * 获得一个元素的计算样式
         * @param element
         * @param property
         */
        getStyle: function(element, property){
            var that = this;
            if(!(element = that.$(element)) || !property) return false;
            // 检查元素 style 的值
            var value = element.style[that.camelize(property)];
            if(!value){
                // 取得计算样式的值
                if(document.defaultView && document.defaultView.getComputedStyle){
                    // DOM 方法
                    var css = document.defaultView.getComputedStyle(element, null);
                    value = css ? css.getPropertyValue(property) : null;
                    console.log(property);
                    console.log(css.getPropertyValue(property));
                } else if(element.currentStyle){
                    // IE 方法
                    value = element.currentStyle[that.camelize(property)];
                }
            }
            // 如果为 auto ,则返回空字符串
            return value == 'auto' ? '' : value;
        },
        /**
         * 解析JSON文件，返回一个对象或数组
         * @param s
         * @param filter
         */
        parseJSON: function(s, filter){
            var j;
            function walk(k, v){
                var i;
                if(v && typeof v === 'object'){
                    for(i in v){
                        if(v.hasOwnProperty(i)){
                            v[i] = walk(i, v[i]);
                        }
                    }
                }
                return filter(k, v);
            }
        },
        // 发送XMLHttpRequest对象的请求
        ajaxRequest: function(url, options){
            var req = getRequestObject(url, options);
            return req.send(options.send);
        }

    };
    // 重复
    if(!String.repeat){
        String.prototype.repeat = function(l){
            return new Array(l + 1).join(this);
        }
    }
    // 去除空白
    if(!String.trim){
        String.prototype.trim = function(s){
            return this.replace(/^\s+|\s+$/g, '');
        }
    }
})(window);