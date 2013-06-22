/**
 * Created by jikey.
 * Link: jikeytang@gmail.com
 * Date: 12-4-24
 * Time: 下午4:33
 * Info:
 */
Ice.lib.Event = function(){
    var loadComplete = false, // loadComplete 指的是 window 的 onload 事件是否触发，触发后就会执行_load函数，loadComplete就变成了true
        unloadListeners = {}, // unloadListeners这个变量中存放的事件句柄，在window的onunload事件触发时会执行
        pub,
        retryCount = 0, // 重试的次数，_tryPreloadAttach函数中会使用它，每执行一次_tryPreloadAttach函数，这个值就减一，这个值的初始值是POLL_RETRYS
        locked = false,
        win = window, // 这样做的好处是减少了一层闭包。使用局部变量win，doc比直接使用window，document要快。因为它们存在于执行函数的活动对象中，解析标识符只需要查找作用域链中的单个对象
        doc = document,
        _interval,
        POLL_RETRYS = 200,
        POLL_INTERVAL = 20,
        TYPE = 0, // 及下一个在removeListener中用到
        FN = 1, // _unload
        OBJ = 2,
        ADJ_SCOPE = 3,
        onAvailStack = [], // 这个数组中存放的是当Dom加载完成时，要执行的一些函数
        UNLOAD = 'unload',
        MOUSEOVER = 'mouseover',
        MOUSEOUT = 'mouseout',
        SCROLLLEFT = 'scrollLeft',
        SCROLLTOP = 'scrollTop',
        doAdd = function(){ // 用来给html元素添加事件及事件响应函数(handler)
            var ret;
            if(win.addEventListener){ // 特性检测 http://snandy.iteye.com/blog/603712
                ret = function(el, eventName, fn, capture){
                    if(eventName == 'mouseenter'){ // 仅 ie 支持， 它是在第一次鼠标进入节点区域时触发，以后在节点区域内(子节点间)移动时不触发，这里为非IE浏览器间接实现了这两个事件，需要另两个函数的辅助
                        fn = fn.createInterceptor(checkRelatedTarget); // 使用mouseover事件，即当给某元素(parent)添加mouseenter事件时，鼠标移至parent时触发事件handler，但从其子元素上移动时并不触发
                        el.addEventListener(MOUSEOVER, fn, (capture));
                    } else if(eventName == 'mouseleave'){
                        fn = fn.createInterceptor(checkRelatedTarget);
                        el.addEventListener(MOUSEOUT, fn, (capture));
                    } else {
                        el.addEventListener(eventName, fn, (capture));
                    }
                    return fn;
                };
            } else if(win.attachEvent){
                ret = function(el, eventName, fn, capture){
                    el.attachEvent('on' + eventName, fn);
                    return fn;
                }
            } else {
                ret = function(){}; // 两个都不支持则返回空函数
            }
            return ret;
        }(),
        doRemove = function(){
            var ret;
            if(win.removeEventListener){
                ret = function(el, eventName, fn, capture){
                    if(eventName == 'mouseenter'){
                        eventName = MOUSEOVER;
                    } else if(eventName == 'mouseleave'){
                        eventName = MOUSEOUT;
                    }
                    el.removeEventListener(eventName, fn, capture);
                };
            } else if(win.detachEvent){
                ret = function(el, eventName, fn){
                    el.detachEvent('on' + eventName, fn);
                }
            } else {
                ret = function(){};
            }
            return ret;
        }();

    // checkRelatedTarget 会作为一个拦截器，这里e.currentTarget IE6/7/8不支持
    function checkRelatedTarget(e){
        return !elContains(e.currentTarget, pub.getRelatedTarget(e));
    }
    // 判断某个元素child是否是parent的子元素，是则返回true，否则false
    function elContains(parent, child){ // 这个方法欠妥，http://ejohn.org/blog/comparing-document-position/
        if(parent && parent.firstChild){
            while(child){
                if(child === parent){
                    return true;
                }
                child = child.parentNode;
                if(child && (child.nodeType != 1)){
                    child = null;
                }
            }
        }
        return false;
    }
    // 这个函数的主要功能就是执行onAvailStack中的函数
    function _tryPreloadAttach(){
        var ret = false,
            notAvail = [], // 这个表示还未执行的函数，因为那个Dom元素还没有加载好，所以叫notAvail
            element, i, v, override,
            tryAgain = !loadComplete || (retryCount > 0);
            // 这几行代码挺绕的，意思是这样的
            // loadComplete代表window的onload事件触发，默认值是false，这个前面说过
            // tryAgain主要是依据window是否load完成，和notAvail中是否还有未执行完成的
            // notAvail如果有没有需要执行的了话，retryCount等于0

        if(!locked){ // 此函数可以多次运行，但是onAvailStack是共享的，所以要锁一下
            locked = true;
            for(var i=0,len=onAvailStack.length; i<len; ++i){ // 遍历onAvialStack，尝试执行一遍里面的函数
                v = onAvailStack[i];
                // 下面是连续的短路判断
                // checkReady默认是false，其意思就是是否等Dom加载好了，再执行
                // loadComplete开始是false，表示window的load事件是否加载好了
                // el.nextSibling引用的是该节点的下一个兄弟节点
                // document && document.body这个表示的body标签是否都加载好了
                if(v && (element = doc.getElementById(v.id))){
                    if(!v.checkReady || loadComplete || element.nextSibling || (doc && doc.body)){
                        override = v.override;
                        element = override ? (override === true ? v.obj : override) : element; // 下面是可以重新设置这个scope的值，需要设置一下override的值
                        v.fn.call(element, v.obj);
                        onAvailStack.remove(v);
                        --i;
                    } else {
                        notAvail.push(v);
                    }
                }
            }
            // 如果都执行成功，则retryCount为0，否则，retryCount每次减1，初始值是200
            retryCount = (notAvail.length === 0) ? 0 : retryCount - 1;
            if(tryAgain){ // startInterval函数还会调用此函数，继续轮回
                startInterval();
            } else { // 不需要再执行了，就清除了
                clearInterval(_interval);
                _interval = null;
            }
            ret = !(locked = false);
        }
        return ret;
    }
    function startInterval(){
        if(_interval){
            var callback = function(){
                _tryPreloadAttach();
            };
            _interval = setInterval(callback, POLL_INTERVAL);
        }
    }
    // 针对ie, 获取滚动值
    function getScroll(){
        var dd = doc.documentElement,
            db = doc.body;
        if(dd && dd[SCROLLLEFT] || dd[SCROLLTOP]){
            return [dd[SCROLLLEFT, dd[SCROLLTOP]]];
        } else if(db){
            return [db[SCROLLLEFT, db[SCROLLTOP]]];
        } else {
            return [0, 0];
        }
    }
    // 获取鼠标事件时相对于文档的坐标(水平，垂直)
    function getPageCoord(ev, xy){
        ev = ev.browserEvent || ev;
        var coord = ev['page' + xy]; // firefox
        if(!coord && coord !== 0){
            coord = ev['client' + xy] || 0; // Safari/Chrome/Opera
            if(Ice.isIE){
                coord += getScroll()[xy == 'X' ? 0 : 1];
            }
        }
        return coord;
    }
    pub = { // 猜测pub是public的简写
        iceAdapter: true,
        // 当id为p_id的元素加载好了，就执行p_fn函数，p_obj是p_fn的第一个参数，如果p_override没有，则p_fn函数的this指向p_id元素
        // 如果p_override为true，则this指向p_obj，其他则this指向p_override
        onAvailable: function(p_id, p_fn, p_obj, p_override){
            onAvailStack.push({
                id: p_id,
                fn: p_fn,
                obj: p_obj,
                override: p_override,
                checkReady: false
            });
            retryCount = POLL_RETRYS;
            startInterval();
        },
        /**
         * 为元素添加事件
         * @param el 添加事件的元素
         * @param eventName 事件名称（如click）
         * @param fn 为响应函数（hanlder）
         */
        addListener: function(el, eventName, fn){
            el = Ice.getDom(el);
            if(el && fn){
                if(eventName == UNLOAD){ // 对“unload”事件做了单独处理
                    if(unloadListeners[el.id] === undefined){
                        unloadListeners[el.id] = [];
                    }
                    unloadListeners[el.id].push([eventName, fn]);
                    return fn;
                }
                return doAdd(el, eventName, fn, false);
            }
            return false;
        },
        // 这两个函数都有个注释：This function should ALWAYS be called from Ext.EventManager
        // 可以发现，真正客户端程序员在使用Ext库时并不直接使用Ext.lib.Event.addListener / Ext.lib.Event.removeListener添加或删除事件。
        // 而是使用Ext.EventManager.addListener / Ext.EventManager.removeListener或者它们的缩写Ext.EventManager.on / Ext.EventManager.un。
        // Ext.EventManager对事件管理提供了更高层次的封装
        removeListener: function(el, eventName, fn){
            el = Ice.getDom(el);
            var i, len, li, lis;
            if(el && fn){
                if(eventName == UNLOAD){
                    if((lis = unloadListeners[el.id]) !== undefined){
                        for(i=0,len=lis.length; i<len; i++){
                            if((li = lis[i]) && li[TYPE] == eventName && li[FN] == fn){
                                unloadListeners[el.id].splice(i, 1);
                            }
                        }
                    }
                    return;
                }
                doRemove(el, eventName, fn, false);
            }
        },
        // 获取当前事件源对象
        // W3C标准使用 target ，IE6/7/8使用了专有的 srcElement 。
        // 令人惊奇的是Safari/Chrome/Opera也支持IE6/7/8方式，即同时支持标准和IE专有方式。
        // Firefox仅支持标准的target，IE9beta现已支持target
        getTarget: function(ev){
            ev = ev.browserEvent || ev;
            return this.resolveTextNode(ev.target || ev.srcElement);
        },
        resolveTextNode:Ice.isGecko ? function(node){
            if(!node){
                return;
            }
            // firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=101197
            var s = HTMLElement.prototype.toString.call(node);
            if(s == '[xpconnect wrapped native prototype]' || s == '[object XULElement]'){
                return;
            }
            return node.nodeType == 3 ? node.parentNode : node;
        } : function(node){
            return node && node.nodeType == 3 ? node.parentNode : node;
        },
        // 获取事件相关的元素。W3C标准使用 relatedTarget ，IE6/7/8使用了专有的 fromElement / toElement 。
        // 同样Safari/Chrome/Opera也支持IE6/7/8方式，即同时支持标准和IE专有方式。
        // Firefox仅支持标准的relatedTarget，IE9也已支持relatedTarget
        getRelatedTarget: function(ev){
            ev = ev.browserEvent || ev; //
            return this.resolveTextNode(ev.relatedTarget || (/(mouseout|mouveleave)/.test(ev.type) ? ev.toElement : (/(mouseover|mouseenter)/).test(ev.type) ? ev.fromElement : null));
        },
        getPageX: function(ev){
            return getPageCoord(ev, 'X');
        },
        getPageY: function(ev){
            return getPageCoord(ev, 'Y');
        },
        getXY: function(ev){
            return [this.getPageX(), this.getPageY()];
        },
        stopEvent: function(ev){
            this.stopPropagation(ev);
            this.preventDefault(ev);
        },
        // stopPropagation 用来停止事件冒泡。W3C标准使用stopPropagation，IE6/7/8则是设置 cancelBubble 为true。
        // Safari/Chrome/Opera/Firefox也支持IE方式取消冒泡。目前为止这是Firefox唯一的一个支持IE方式的属性。IE9beta现已支持stopPropagation
        stopPropagation: function(ev){
            ev = ev.browserEvent || ev;
            if(ev.stopPropagation){
                ev.stopPropagation();
            } else {
                ev.cancelBubble = true;
            }
        },
        preventDefault: function(ev){
            ev = ev.browserEvent || ev;
            if(ev.preventDefault){
                ev.preventDefault();
            } else {
                ev.returnValue = false;
            }
        },
        // getEvent顾名思义获取事件对象。W3C标准使用响应函数的第一个参数获取，IE6/7/8则使用window.event获取。
        // Safari/Chrome/Opera也支持IE6/7/8方式获取，IE9beta已支持W3C标准方式获取
        // 获取事件的全家 http://www.cnblogs.com/snandy/archive/2011/03/07/1976317.html
        getEvent: function(e){
            e = e || win.event;
            // 下面这段代码是，当ev没有取到值，那么就找父函数的第一个参数，如果第一个参数不是Event类型，那么接着向上找父函数
            if(!e){
                var c = this.getEvent.caller;
                while(c){
                    e = c.arguments[0];
                    if(e && Event == e.constructor){
                        break;
                    }
                    c = c.caller;
                }
            }
            return e;
        },
        // 取得键盘代码
        getCharCode: function(ev){
            ev = ev.browserEvent || ev;
            return ev.charCode ||ev.keyCode || 0;
        },
        _load: function(){
            loadComplete = true;
            if(Ice.isIE && e !== true){
                doRemove(win, 'load', arguments.callee);
            }
        },
        _unload: function(){
            var EU = Ice.lib.Event,
                i, v, ul, id, len, scope;
            for (id in unloadListeners) {
                ul = unloadListeners[id];
                for(i=0,len=ul.length; i<len; i++){
                    v = ul[i];
                    if(v){
                        try {
                            scope = v[ADJ_SCOPE] ? (v[ADJ_SCOPE] === true ? v[OBJ] : v[ADJ_SCOPE]) : win;
                            v[FN].call(scope, EU.getEvent(e), v[OBJ]);
                        } catch(ex) {
                        }
                    }
                }
            }
            Ice.EventManager._unload();
            doRemove(win, UNLOAD, EU._unload);
        }
    };
    // 把addlistener和removeListener注册到on和un上，方便使用
    pub.on = pub.addListener;
    pub.un = pub.removeListener;
    // 判断一下Dom是否加载完成
    if(doc && doc.body){
        // 如果已经加载好了，就执行一下_load函数
        pub._load(true);
    } else {
        // 如果还没有加载好，就注册到window的load事件上
        doAdd(win, 'load', pub._load);
    }
    // 注册unload事件
    doAdd(win, UNLOAD, pub._unload);
    // 这个_tryPreloadAttach函数应该是比_load函数执行的早，可以看做是入口函数
    _tryPreloadAttach();
    return pub;
}();