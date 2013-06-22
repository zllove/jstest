/**
 * Created by jikey.
 * Link: jikeytang@gmail.com
 * Date: 12-4-13
 * Time: 下午4:57
 * Info:
 */
// 兼容旧浏览器，早期的浏览器实现中，undefined并不是全局变量。就是说，你要判断一个变量是否是没定义，
// 你需要这样写if (typeof  a == 'undefined')，不可以写成if (a == undefined)。所以，上面的代码就可以理解了。
// 右面的window["undefined"]，因为window对象没有undefined属性，所以其值为undefined，
// 把undefined赋值给window的undefined属性上，就相当于把undefined设置成了全局变量，
// 这样以后你再判断一个变量是否是未定义的时候，就不需要使用typeof，直接判断就可以了。
window.undefined = window.undefined;
// 创建Ext全局对象，大多数JS库为了避免和其他JS库命名冲突，都会把自己创建的类或函数封装到一个全局变量中去，
// 这样就相当于创造了自己的命名空间，可以算是一个单例模式。例如，jQuery就是全部都封装到$变量中去。
Ice = {
    version: '3.3.1'
};
/**
 * apply方法，把对象c中的属性复制到对象o中，支持默认属性defaults设置。这个方法属于对象属性的一个浅拷贝函数
 * @param o 属性接受方对象
 * @param c 属性源对象
 * @param defaults 默认对象，如果该参数存在，obj将会得到那些defaults有而config没有的属性
 */
Ice.apply = function (o, c, defaults){
    if(defaults){ // 如果有三个参数，则把第三个参数复制给 o
        Ice.apply(o, defaults);
    }
    if(o && c && typeof c == 'object'){
        for (var p in c) {
            o[p] = c[p];
        }
    }
    return o;
};
(function(){
    var idSeed = 0, // idSeed，用来生成自增长的id值
        toString = Object.prototype.toString,
        ua = navigator.userAgent.toLowerCase(), // ua，浏览器的用户代理，主要用来识别浏览器的型号、版本、内核和操作系统等
        check = function(r){
            return r.test(ua);
        },
        DOC = document,
        docMode = DOC.documentMode,
        isStrict = DOC.compatMode == 'CSS1Compat', // isStrict，表示当前浏览器是否是标准模式
        isOpera = check(/opera/),
        isChrome = check(/\bchrome\b/),
        isWebKit = check(/webkit/), // isWebKit，表示当前浏览器是否使用WebKit引擎。   WebKit是浏览器内核，Safari和Chrome使用WebKit引擎
        isSafari = !isChrome && check(/safari/),
        isIE = !isOpera && check(/msie/),
        isIE6 = check(/msie 6/),
        isBorderBox = isIE && !isStrict, // isBorderBox，表示浏览器是否是IE的盒模式
        isGecko = !isWebKit && check(/gecko/), // firefox
        isSecure = /^https/i.test(window.location.protocol); // 判断采用https或是其它

    Ice.apply(Ice, {
        isStrict: isStrict,
        isReady: false,
        // 是否自动清理无用对象
        enableGarbageCollector: true,
        /**
         * 复制所有config的属性至obj，如果obj已有该属性，则不复制（第一个参数为obj，第二个参数为config）
         * 把对象c的属性复制到对象o上，只复制o没有的属性
         * @param o 接受方对象
         * @param c 源对象
         */
        applyIf: function(o, c){
            if(o){
                for (var p in c) {
                    if(!Ice.isDefined(o[p])){
                        o[p] = c[p];
                    }
                }
            }
            return o;
        },
        // 对页面元素生成唯一id，如果该元素已存在id，则不会再生成。
        id: function (el, prefix){
            el = Ice.getDom(el, true) || {};
            if(!el.id){
                el.id = (prefix || 'ice-gen') + (++idSeed);
            }
            return el.id;
        },
        // OO继承，并由传递的值决定是否覆盖原对象的属性。返回的类对象中也增加了“override()”函数，用于覆盖实例的成员。
        extend2: function (){
            var inlineOverride = function (o){
                for (var m in o) {
                    this[m] = o[m];
                }
            };
            var oc = Object.prototype.constructor;
            return function(subFn, superFn, overrides){
                if(typeof superFn == 'object'){
                    overrides = superFn;
                    superFn = subFn;
                    subFn = overrides.constructor != oc ? overrides.constructor : function(){ superFn.apply(this, arguments); };
                    // 省略第一个参数时候的处理，位置变换+第一个参数生成
                };
                var F = function(){},
                    subFnPrototype,
                    superFnPrototype = superFn.prototype; //@1
                // 原型链继承基本原理的实现只有这三行的部分代码，其他代码都具有技巧性，都是为了达到一定的效果或者避免一些缺点
                F.prototype = superFnPrototype;
                subFnPrototype = subFn.prototype = new F(); // 用空函数可以避免子类或得父类的实例变量，即直接定义在构造函数中的变量，避免浪费，也正是这个原因，我们需要的constructor superclass要采用下面的处理。
                subFnPrototype.constructor = subFn; //@2 设置子函数的构造函数 为什么不是sb.constructor=sb呢,请了解javascript 关于constructor的知识，主意是作为类来使用的，constructor属性为类的实例提供方便，参考@1
                subFn.superclass = superFnPrototype; // 这里是apply sbp的superclass 这样做不仅sb的实例可以得到superclass sb本身也可以得到
                if(superFnPrototype.constructor == oc){
                    superFnPrototype.constructor = superFn; // 父类sp到达继承链的顶级 如{} 等 得指定他们的spp的构造函数 方便所有继承系列中的子类能正确调用到父类的构造函数 避免调用到Object.prototype.constructor
                }
                subFn.override = function(o){ //@3
                    Ice.override(subFn, o);
                }; // 给子类本身加上override方法 方便sb的重载、重写实现
                subFnPrototype.superclass = subFnPrototype.supr = (function(){
                    return superFnPrototype;
                });
                // 给子类本身加上override方法，方便sb的重载、重写实现
                subFnPrototype.override = inlineOverride;
                Ice.override(subFn, overrides); // override属性，类级别的，区别前面,只有一个参数的，是实例级别的，没啥好说的吧？
                subFn.extend = function(o){ return Ice.extend(subFn, o); };
                return subFn;
            }
        }(),
        extend : function(){
            // inline overrides
            var io = function(o){
                for(var m in o){
                    this[m] = o[m];
                }
            };
            var oc = Object.prototype.constructor;

            return function(sb, sp, overrides){
                if(typeof sp == 'object'){
                    overrides = sp;
                    sp = sb;
                    sb = overrides.constructor != oc ? overrides.constructor : function(){sp.apply(this, arguments);};
                }
                var F = function(){},
                    sbp,
                    spp = sp.prototype;

                F.prototype = spp;
                sbp = sb.prototype = new F();
                sbp.constructor=sb;
                sb.superclass=spp;
                if(spp.constructor == oc){
                    spp.constructor=sp;
                }
                sb.override = function(o){
                    Ext.override(sb, o);
                };
                sbp.superclass = sbp.supr = (function(){
                    return spp;
                });
                sbp.override = io;
                Ext.override(sb, overrides);
                sb.extend = function(o){return Ext.extend(sb, o);};
                return sb;
            };
        }(),
        // 在类上添加overrides指定的方法（多个方法），同名则覆盖
        override: function(origclass, overrides){
            if(overrides){
                var p = origclass.prototype;
                Ice.apply(p, overrides);
                // IE中for in不能遍历对象的Object的toSting等方法，因此需要特别处理一下
                if(Ice.isIE && overrides.hasOwnProperty('toString')){
                    p.toString = overrides.toString;
                }
            }
        },
        // 用来管理Ico库命名空间的方法
        namespace: function(){
            var o,d;
            Ice.each(arguments, function(v){ // 循环遍历所传的参数
                d = v.split('.'); // 返回字符串数组
                o = window[d[0]] = window[d[0]] || {}; // 把数组第一个元素作为window对象的子对象
                Ice.each(d.slice(1), function (v2){ // 再把数组中其他元素按顺序作为为的子对象，注意是逐级的，即第二个元素是o的子对象，第三个元素是o的子对象的子对象，依次类推
                    o = o[v2] = o[v2] || {};
                });
            });
            return o;
        },
        toArray: function(){
            return isIE ? function(a, i, j, res){
                res = [];
                for(var x=0,len=a.length; x<len; x++){
                    res.push(a[x]);
                }
                return res.slice(i || 0, j || res.length);
            } : function(a, i, j){
                return Array.prototype.slice.call(a, i || 0, j || a.length);
            };
        }(),
        isIterable: function(v){
            if(Ice.isArray(v) || v.callee){
                return true;
            }
            if(/NodeList|HTMLCollection/.test(toString.call(v))){
                return true;
            }
            return ((typeof v.nextNode != 'undefined' || v.item) && Ice.isNumber(v.length));
        },
        /**
         * 迭代一个数组，数组中每个成员都将调用一次所传函数，直到函数返回false才停止执行。
         * 如果传递的数组并非一个真正的数组，所传递的函数只调用它一次
         * @param array 如果传递进来的数组不是一个真实的数组，你的function只会被用这个伪数组作参数调用一次
         * @param fn 该function会被每个数组中的元素当做参数调用，如果function返回false，则停止迭代然后会返回当前的 index
         * @param scope 作用域 指定方法执行的 作用域 ( this 的引用 )
         */
        each: function(array, fn, scope){
            if(Ice.isEmpty(array, true)){
                return;
            }
            // 判断array是否可迭代，对于数组、NodeList、HTMLCollection都是可迭代的，即返回true
            // 或者是字符型，数字型和布尔型时直接封装成数组
            if(!Ice.isIterable(array) || Ice.isPrimitive(array)){
                array = [array];
            }
            for(var i=0,len=array.length; i<len; i++){
                // fn 的第一个参数为集合元素，第二个参数i为索引，第三个参数为被迭代元素自身
                if(fn.call(scope || array[i], array[i], i, array) === false){
                    return i;
                }
            }
        },
        // 这是一个通用迭代器，可以迭代数组，也可以是对象
        iterate: function(obj, fn, scope){
            if(Ice.isEmpty(obj)){ // 如果为空，则直接返回
                return;
            }
            if(Ice.isIterable(obj)){
                Ice.each(obj, fn, scope);
                return;
            } else if(typeof obj == 'object'){
                for (var prop in obj) {
                    if(obj.hasOwnProperty(prop)){
                        if(fn.call(scope || obj, prop, obj[prop], obj) === false){
                            return;
                        }
                    }
                }
            }
        },
        // 返回dom对象，参数可以是string(id)，dom node，或Ext.Element
        getDom: function(el, strict){
            if(!el || !DOC){
                return null;
            }
            if(el.dom){
                return el.dom;
            } else {
                if(typeof el == 'string'){
                    var e = DOC.getElementById(el);
                    // 如果是ie则会得到name与id同样的值
                    if(e && isIE && strict){
                        if(el == e.getAttribute('id')){
                            return e;
                        } else {
                            return null;
                        }
                    }
                    return e;
                } else {
                    return el;
                }
            }
        },
        // 将当前文档的body以一个 Ice.Element的形式返回
        getBody: function(){
            return Ice.get(DOC.body || DOC.documentElement);
        },
        getHead: function(){
            var head;
            return function(){
                if(head == undefined){
                    head = Ice.get(DOC.getElementsByTagName('head')[0]);
                } 
                return head;
            }
        }(),
        isEmpty: function(v, allowBlank){
            // 如果传入null, undefined 或空字符串或空数组，则返回 true
            return v === null || v === undefined || ((Ice.isArray(v) && !v.length)) || (!allowBlank ? v === '' : false); // (Ice.isArray(v) && !v.length) 检查是否为数组，是否为空
        },
        isArray: function(v){
            return toString.apply(v) === '[object Array]';
        },
        isDate: function(v){
            return toString.apply(v) === '[object Date]';
        },
        // 是否为js对象
        isObject: function(v){
            return !!v && Object.prototype.toString.call(v) === '[object Object]';;
        },
        // 如果传递的值是一个string, number 或 boolean类型则返回true
        isPrimitive: function(v){
            return Ice.isString(v) || Ice.isNumber(v) || Ice.isBoolean(v);
        },
        // 是否为函数
        isFunction: function(v){
            return toString.apply(v) === '[object Function]';
        },
        // 是否为数字
        isNumber: function(v){
            return typeof v === 'number' && isFinite(v);
        },
        // 是否为字符串
        isString: function(v){
            return typeof v === 'string';
        },
        // 是否为布尔值
        isBoolean: function(v){
            return typeof v === 'boolean';
        },
        // 如果传递的值时HTMLElement则返回true
        isElement: function(v){
            return v ? !!v.tagName : false;
        },
        isDefined: function(v){
            return typeof v !== 'undefined';
        },
        isIE: isIE, 
        isIE6: isIE6,
        isWebKit: isWebKit,
        isChrome: isChrome,
        isSafari: isSafari,
        isOpera: isOpera,
        isGecko: isGecko
    });
    Ice.ns = Ice.namespace;
})();
// (): 通过私有作用域隐藏私有变量，而且不需要实例化
Ice.ns('Ice.util', 'Ice.lib', 'Ice.data', 'Ice.supports');
Ice.elCache = {};
// Function的扩展
Ice.apply(Function.prototype, {
    /**
     * 创建一个拦截函数。传入的函数在原始的函数之前执行。
     * 如果传入的函数返回false，就不执行原始的函数。
     * 最终函数返回原始函数的执行结果。传递进来的函数使用原始函数的参数来调用
     * @param fcn 需要在原始函数调用之前被调用的函数
     * @param scope (可选)作用域( this 引用)传递进来的函数将会在此作用域内执行。 
     * 如果省略此参数，默认在原始函数被调用的那个作用域，或者在浏览器的window作用域中执行。
     * 这个就是完全的函数代理了，和Spring的AOP是一个概念
     */
    createInterceptor: function(fcn, scope){
        var method = this;
        return !Ice.isFunction(fcn) ? this : function(){
            var me = this, args = arguments;
            fcn.target = me;
            fcn.method = method;
            return (fcn.apply(scope || me || window, args) !== false) ? method.apply(me || window, args) : null;
        };
    },
    // 创建一个回调函数
    createCallback: function(){
        var method = this, args = arguments;
        return function(){
            return method.apply(window, args);
        }
    },
    /**
     * 创建一个代理（回调）函数，把作用域设置到参数obj上
     * @param obj （可选的）自定义的作用域对象
     * @param args （可选的） 覆盖该次调用的参数列表
     * @param appendArgs Boolean/Number（可选的） 如果该参数为true，将args加载到该函数的后面，如果该参数为数字类型，则args将插入到所指定的位置
     */
    createDelegate: function(obj, args, appendArgs){
        var method = this;
        return function(){
            var callArgs = args || arguments;
            if(appendArgs === true){
                callArgs = Array.prototype.slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            } else if(Ice.isNumber(appendArgs)){
                callArgs = Array.prototype.slice.call(arguments, 0);
                var applyArgs = [appendArgs, 0].concat(args);
                Array.prototype.splice.apply(callArgs, applyArgs);
            }
            return method.apply(obj || window, callArgs);
        }
    },
    /**
     * 在指定的毫秒数之后调用函数，同时可以指定特定的作用域
     * @param millis 延迟时间，以毫秒为单位（如果是0则立即执行）
     * @param obj fcn的作用域（默认指向原函数或window）
     * @param args 覆盖原函数的参数列表（默认为该函数的arguments）
     * @param appendArgs 如果该参数为true，将args加载到该函数的后面，如果该参数为数字类型，则args将插入到所指定的位置
     */
    defer: function(millis, obj, args, appendArgs){
        var fn = this.createDelegate(obj, args, appendArgs);
        if(millis > 0){
            return setTimeout(fn, millis);
        }
        fn();
        return 0;
    }
});
// String的扩展
Ice.applyIf(String, {
    // 把字符串中特殊写法({0},{1})用指定的变量替换
    format: function(format){
        var args = Ice.toArray(arguments, 1);
        return format.replace(/\{(\d+)\}/g, function(m, i){
            return args[i];
        });
    }
});
// Array的扩展
Ice.applyIf(Array.prototype, {
    /**
     * 查找数组中是否存在指定的对象
     * @param o 需要查找的对象
     * @param from (可选)开始查找的起始索引
     */
    indexOf: function(o, from){
        var len = this.length;
        from = from || 0;
//        from += (from < 0) ? len : 0;
        for(; from < len; ++from){
            if(this[from] === o){
                return from;
            }
        }
        return -1;
    },
    // 删除数组中指定对象。如果该对象不在数组中，则不进行操作
    remove: function(o){
        var index = this.indexOf(o);
        if(index != -1){
            this.splice(index, 1);
        }
        return this;
    },
    // 删除指定位置的元素
    removeAt: function(index){
        if(index != -1){
            this.splice(index, 1);
        }
        return this;
    }
});
