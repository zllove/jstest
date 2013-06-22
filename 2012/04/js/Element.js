/**
 * Created by jikey.
 * Link: jikeytang@gmail.com
 * Date: 12-4-17
 * Time: 下午2:21
 * Info:
 */
(function(){
    var DOC = document;
    Ice.Element = function(element, forceNew){
        var dom = typeof DOC.getElementById(element) == 'string' ? DOC.getElementById(element) : element, id;
        if(!dom){ return null; }
        id = dom.id;
        if(!forceNew && id && Ice.elCache[id]){
            return Ice.elCache[id].el;
        }
        this.dom = dom;
        this.id = id || Ice.id(dom);
    };
    var DH = Ice.DomHelper, El = Ice.Element, EC = Ice.elCache;
    El.prototype = {
        // 从DOM里面移除当前元素，并从缓存中删除
        remove: function(){
            var me = this, dom = me.down;
            if(dom){
                delete me.down;
                Ice.removeNode(dom);
            }
        }
    };
    var ep = El.prototype;
    // 使用该方法为Ext.Element类的原型上添加属性，方法
    El.addMethods = function(o){
        Ice.apply(ep, o);
    };
    var docEl;
    /**
     * 这个方法用来捕获Ext.Element对象，而不能用来捕获 Components. 此方法捕获的Ext.Element包装了原始的DOM元素
     * @param el 节点的id，一个DOM节点或者是已存的Element.
     */
    El.get = function(el){
        var ex,
            elm,
            id;
        if(!el) return null;
        if(typeof el == 'string'){ // 传id
            if(!(elm = DOC.getElementById(el))){
                return null;
            }
            if(EC[el] && EC[el].el){ // 存在的话，先从缓存(Ext.elCache)中取，否则new一个Ext.Element再将其置入缓存中(Ext.elCache)
                ex = EC[el];
                ex.dom = el;
            } else {
                ex = El.addToCache(new El(elm));
            }
            return ex;
        }  else if(el.tagName){ // 传HTMLElement对象
            if(!(id = el.id)){
                id = Ice.id(el);
            }
            if(EC[id] && EC[id].el){
                ex = EC[id].el;
                ex.dom = el;
            } else {
                ex = El.addToCache(new El(el));
            }
            return ex;
        } else if(el instanceof El){ // 传Ice.Element对象, 如果不是docEl(一个临时类)，则修改所传参数的dom属性（更新dom）然后返回
            if(el != docEl){
                if(Ice.isIE && (el.id == undefined || el.id == '')){
                    el.dom = el.dom;
                } else {
                    el.dom = DOC.getElementById(el.id) || el.dom;
                }
            }
            return el;
        } else if(el.isComposite){ // 传Ice.CompositeElementLite对象
            return el;
        } else if(Ice.isArray(el)){ // 传数组
//            return Ice.select(el); // 使用El.select返回
        } else if(el == DOC){ // 传document
            if(!docEl){ // 如果docEl不存在则创建，因为document是唯一的，因此该对象只创建一次。后续直接返回即可。可以看到docEl与普通Ext.Element不同之处在于其dom属性一个是document，另一个则不是
                var f = function(){};
                f.prototype = El.prototype;
                docEl = new f();
                docEl.dom = DOC;
            }
            return docEl;
        }
        return null;
    };
    // 把Ice.Element元素以id为key存放到Ice.elCache中
    El.addToCache = function(el, id){
        id = id || el.id;
        EC[id] = {
            el: el, // Ext.Element的实例对象
            data: {}, // 存储数据(El.data用到)
            events: {} // 事件
        };
        return el;
    };
    // 缓存数据
    El.data = function(el, key, value){
        el = El.get(el);
        if(!el) { return null; };
        var c = EC[el.id].data;
        if(arguments.length == 2){    
            return c[key]; // getter
        } else {
            return c[key] = value; // setter
        }
    };
    // 垃圾回收
    function garbageCollect(){
    }
    var flyFn = function(){};
    flyFn.prototype = El.prototype;
    El.Flyweight = function(dom){ // 享元模式
        this.dom = dom;
    };
    El.Flyweight.prototype = new flyFn(); // El.Flyweight类继承了Ice.Element类原型上的所有属性，方法
    El.Flyweight.prototype.isFlyweight = true; // 标示对象是否为Ext.Element.Flyweight类型对象
    El._flyweights = {};
    El.fly = function(el, named){
        var ret = null;
        if(el = Ice.getDom(el)){
            (El._flyweights[named] = El._flyweights[named] || new El.Flyweight()).dom = el;
            ret = El._flyweights[named];
        }
        return ret;
    };
    Ice.get = El.get;
    Ice.fly = El.fly;
    
})();
