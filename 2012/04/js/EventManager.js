/**
 * Created by jikey.
 * Link: jikeytang@gmail.com
 * Date: 12-4-25
 * Time: 下午4:25
 * Info:
 */
Ice.EventManager = function(){
    var docReadyEvent,
        docReadyProcId,
        docReadyState = false,
        DETECT_NATIVE = Ice.isGecko || Ice.isWebKit || Ice.isSafari,
        E = Ice.lib.Event,
        D = Ice.lib.Dom,
        DOC = document,
        WINDOW = window,
        DOMCONTENTLOADED = 'DOMContentLoaded',
        COMPLETE = 'complete',
        propRe = /^(?:scope|delay|buffer|single|stopEvent|preventDefautl|stopPropagation|normalized|args|delegate)$/,
        specialElCache = [];
    function getId(el){
        var id = false,
            i = 0,
            el = specialElCache.length,
            skip = false,
            o;
        if(el){
            if(el.getElementById || el.navigator){
                for(; i < len; ++i){
                    o = specialElCache[i];
                    if(o.el === el){
                        id = o.id;
                        break;
                    }
                }
                if(!id){
                    id = Ice.id(el);
                    specialElCache.push({
                        id: id,
                        el: el
                    });
                    skip = true;
                }
            } else {
                id = Ice.id(el);
            }
            if(!Ice.elCache[id]){
                Ice.Element.addToCache(new Ice.Element(el), id);
                if(skip){
                    Ice.elCache[id].skipGC = true;
                }
            }
        }
        return id;
    }

    /**
     * 添加监听
     * @param el
     * @param ename
     * @param fn
     * @param task
     * @param wrap
     * @param scope
     */
    function addListener(el, ename, fn, task, wrap, scope){
        el = Ice.getDom(el);
        var id = getId(el), // 统一管理事件的id
            es = Ice.elCache[id].event,
            wfn;
        wfn = E.on(el, ename, wrap); // 调用Ext.lib.Event.on添加原生的事件，实现浏览器的兼容
        es[ename] = es[ename] || [];
        es[ename].push([fn, wrap, scope, wfn, task]); // 把监听函数保存到监听集合中对应的事件名的集合中
        if(el.addEventListener && ename == 'mousewheel'){
            var args = ['DOMMouseScroll', wrap, false];
            el.addEventListener.apply(el, args);
            Ice.EventManager.addListener(WINDOW, 'unload', function(){
                el.removeEventListener.apply(el, args);
            });
        }
        if(el == DOC && ename == 'mousedown'){
            Ice.EventManager.stoppedMouseDownEvent.addListener(wrap);
        }
    }
    // 检查 dom 是否加载完成
    function doScrollChk(){
        // 不能在frame,iframe
        if(window != top){
            return false;
        }
        try{
            DOC.documentElement.doScroll('left');
        } catch(e) {
            return false;
        }
        fireDocReady();
        return true;
    }
    // 检查是否已经加载完成
    function checkReadyState(){
        if(Ice.isIE && doScrollChk()){
            return true;
        }
        if(DOC.readyState == COMPLETE){
            fireDocReady();
            return true;
        }
        docReadyState || (docReadProcId = setTimeout(arguments.callee, 2));
        return false;
    }
    function fireDocReady(e){
        if(!docReadyState){
            docReadyState = true;
            if(docReadyProcId){
                clearTimeout(docReadyProcId);
            }
            if(DETECT_NATIVE){
                DOC.removeEventListener(DOMCONTENTLOADED, fireDocReady, false);
            }
            if(Ice.isIE && checkReadyState.bindIE){
                DOC.detachEvent('onreadstatechange', checkReadyState);
            }
            E.un(WINDOW, 'load', arguments.callee);
        }
        if(docReadyEvent && !Ice.isReady){
            Ice.isReady = true;
            docReadyEvent.fire();
            docReadyEvent.listeners = [];
        }
    }
    function createTargeted(h, o){
        return function(){
            var args = Ice.toArray(arguments);
            if(o.target == Ice.EventObject.setEvent(arg[0]).target){
                h.apply(this,args);
            }
        };
    }
    /**
     * @param {} element 要注册监听事件的元素
     * @param {} ename 事件名
     * @param {} opt 配置项
     * @param {} fn 监听函数
     * @param {} scope 上下文（作用域）
     * @return {}
     */
    function listen(element, ename, opt, fn, scope){
        var o = (!opt || typeof opt == 'boolean') ? {} : opt, // 配置对象
            el = Ice.getDom(element), task;
        fn = fn || o.fn; // 监听函数和作用域
        scope = scope || o.scope;
        if(!el){
            throw "Error listening for \"" + ename + '\". Element "' + element + '" doesn\'t exist.';
        }
        function h(e){ // 封装之后的监听函数，用来注册到元素的事件中
            if(!Ice){
                return;
            }
            e = Ice.EventManager.setEvent(e);
            var t;
            if(o.delegate){ // 如果指定了delegate配置项，那么就按其指定找到代理事件源
                if(!(e.getTarget(o.delegate, el))){
                    return;
                }
            } else {
                t = e.target;
            }
            if(o.stopEvent){
                e.stopEvent();
            }
            if(o.preventDefault){
                e.preventDefault();
            }
            if(o.stopPropagation){
                e.stopPropagation();
            }
            if(o.noramlized === false){
                e = e.browserEvent;
            }
            fn.call(scope || el, e, t, o);
        }
        if(o.target){
            h = createTargeted(h, o);
        }
        // TODO 未完
    }
    var pub = {
        /**
         * 加入一个事件处理函数，方法{@link #on}是其简写方式。
         * @param {String/HTMLElement} element 要分配的html元素或者其id。
         * @param {String} eventName 事件处理函数的名称。
         * @param {Function} fn 事件处理函数。该函数会送入以下的参数
         * @param {Object} scope (optional) （可选的）事件处理函数执行时所在的作用域。处理函数“this”的上下文
         * @param {Object} options (optional) （可选的） 包含句柄配置属性的一个对象。该对象可能会下来的属性：
         * 调用addListener时送入的选项对象。
         * <li>scope : Object 事件处理函数执行时所在的作用域。处理函数“this”的上下文环境。
         * <li>delegate : String 一个简易选择符，用于过滤目标，或是查找目标的子孙。
         * <li>stopEvent : Boolean true表示为阻止事件。即停止传播、阻止默认动作。
         * <li>preventDefault : Boolean true表示为阻止默认动作。
         * <li>stopPropagation : Boolean true表示为阻止事件传播。
         * <li>normalized : Boolean false表示对处理函数送入一个原始、未封装过的浏览器对象而非标准的
         * <li>delay : Number  触发事件后处理函数延时执行的时间。
         * <li>single : Boolean true代表为下次事件触发加入一个要处理的函数，然后再移除本身。
         * <li>buffer : Number 若指定一个毫秒数会把该处理函数安排到{@link Ext.util.DelayedTask}延时之后才执行。
         */
        addListener: function(element, eventName, fn, scope, options){
            if(typeof eventName == 'object'){
                var o = eventName, e, val;
                for (e in o) {
                    val = o[e];
                    if(!propRe.test(e)){
                        if(Ice.isFunction(val)){
                            listen(element, e, o, val, o.scope);
                        } else {
                            listen(element, e, val);
                        }
                    }
                }
            } else {
                listen(element, eventName, options, fn, scope);
            }
        }
    }
}();