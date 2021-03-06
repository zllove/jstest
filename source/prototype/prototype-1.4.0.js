/*  Prototype JavaScript framework, version 1.4.0
 *  (c) 2005 Sam Stephenson <sam@conio.net>
 *
 *  Prototype is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://prototype.conio.net/
 *
 /*--------------------------------------------------------------------------*/
/**
 * 定义prototype对象，告知版本信息
 */
var Prototype = {
    Version: '1.4.0',
	
    //用于捕获字符串中的<script>标记及其中的内容
    ScriptFragment: '(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)',
	
    //空函数
    emptyFunction: function(){ },
	
	//返回参数自身的函数
    K: function(x){
        return x
    }
}

/**
 * 定义创建类的模式，使用此模式创建的类能够实现构造函数
 * initialize是一个抽象方法，apply能使其得到参数
 */
var Class = {
    create: function(){
        return function(){
            this.initialize.apply(this, arguments);
        }
    }
}

//表示命名空间或抽象的对象，使逻辑更加清楚
var Abstract = new Object();
/**
 * 类继承
 * 	var a = {}, b={p:1}
 *  Object.extend(a, b);
 *  alert(a.p);
 *  可以看到a具有p的属性
 * @param {Object} destination 子对象
 * @param {Object} source 要继承的父对象
 */
Object.extend = function(destination, source){
    for (property in source) {
        destination[property] = source[property];
    }
    return destination;
}

/**
 * 将对象转换为字符串
 * @param {Object} object
 */
Object.inspect = function(object){
    try {
        if (object == undefined) return 'undefined';
        if (object == null) return 'null';
        return object.inspect ? object.inspect() : object.toString();
    } 
    catch (e) {
        if (e instanceof RangeError) 
            return '...';
        throw e;
    }
}

/**
 * 能将函数绑定到对象运行，转换this指向
 * 
 */
Function.prototype.bind = function(){
    var __method = this, args = $A(arguments), object = args.shift();
    return function(){
        return __method.apply(object, args.concat($A(arguments)));
    }
}

/**
 * 将函数作为事件的监听器，这样就可以产生独立而且通用的事件处理程序
 * @param {Object} object
 */
Function.prototype.bindAsEventListener = function(object){
    var __method = this;
    return function(event){
        return __method.call(object, event || window.event);
    }
}

/**
 * 扩展Number
 */
Object.extend(Number.prototype, {
	//转换为16进制，颜色值
    toColorPart: function(){
        var digits = this.toString(16);
        if (this < 16) return '0' + digits;
        return digits;
    },
    //加1
    succ: function(){
        return this + 1;
    },
    //输出指定次数的循环
    times: function(iterator){
        $R(0, this, true).each(iterator);
        return this;
    }
});

var Try = {
	//根据参数指定的参数进行调用，返回第一个成功调用的值
    these: function(){
        var returnValue;
        
        for (var i = 0; i < arguments.length; i++) {
            var lambda = arguments[i];
            try {
                returnValue = lambda();
                break;
            } 
            catch (e) {
            }
        }
        
        return returnValue;
    }
}

/*--------------------------------------------------------------------------*/
/**
 * 定时器类，比window.setInterval()，该类能够使得回调函数不会被并发调用，
 */
var PeriodicalExecuter = Class.create();
PeriodicalExecuter.prototype = {
	//构造函数，指定回调函数和执行频率，单位为秒
    initialize: function(callback, frequency){
        this.callback = callback;
        this.frequency = frequency;
        this.currentlyExecuting = false;
        
        this.registerCallback();
    },
    //开始执行定时器，一般不显示调用，在构造函数中被调用
    registerCallback: function(){
        setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
    },
    //相当于回调函数的一个代理。
	//在传统的setInterval中，时间一到，便强制执行回调函数，这里则加了currentlyExecuting属性判断
	//如果callback函数执行时间超过了一个时间片，则阻止其被重复执行
    onTimerEvent: function(){
        if (!this.currentlyExecuting) {
            try {
                this.currentlyExecuting = true;
                this.callback();
            }
            finally {
                this.currentlyExecuting = false;
            }
        }
    }
}

/*--------------------------------------------------------------------------*/
/**
 * 得到节点元素的集合，可返回多个数组
 */
function $(){
    var elements = new Array();
    
    for (var i = 0; i < arguments.length; i++) {
        var element = arguments[i];
        if (typeof element == 'string') 
            element = document.getElementById(element);
        
        if (arguments.length == 1) 
            return element;
        
        elements.push(element);
    }
    
    return elements;
}
/**
 * 扩展String
 */
Object.extend(String.prototype, {
	//将html转换为纯文本
    stripTags: function(){
        return this.replace(/<\/?[^>]+>/gi, '');
    },
    //删除文本中的脚本代码
    stripScripts: function(){
        return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');
    },
    //提取字符串的脚本，返回所有脚本内容组成的数组
    extractScripts: function(){
        var matchAll = new RegExp(Prototype.ScriptFragment, 'img'); //找到所有包括<script>的代码标记
        var matchOne = new RegExp(Prototype.ScriptFragment, 'im'); //对每个脚本删除<script>标记
        return (this.match(matchAll) || []).map(function(scriptTag){
            return (scriptTag.match(matchOne) || ['', ''])[1];
        });
    },
    //执行这段脚本
    evalScripts: function(){
        return this.extractScripts().map(eval);
    },
    //对html进行编码
    escapeHTML: function(){
        var div = document.createElement('div');
        var text = document.createTextNode(this);
        div.appendChild(text);
        return div.innerHTML;
    },
    //对html进行解码
    unescapeHTML: function(){
        var div = document.createElement('div');
        div.innerHTML = this.stripTags();
        return div.childNodes[0] ? div.childNodes[0].nodeValue : '';
    },
    //查询字符串，得到键值组成的哈希表(对象)；
    toQueryParams: function(){
        var pairs = this.match(/^\??(.*)$/)[1].split('&');
        return pairs.inject({}, function(params, pairString){
            var pair = pairString.split('=');
            params[pair[0]] = pair[1];
            return params;
        });
    },
    //转换成数组
    toArray: function(){
        return this.split('');
    },
    //将 '-' 连接的属性驼峰化
    camelize: function(){
        var oStringList = this.split('-');
        if (oStringList.length == 1) 
            return oStringList[0];
		//如果首个标识是'-'，则处理后一个字母为大写
        var camelizedString = this.indexOf('-') == 0 ? oStringList[0].charAt(0).toUpperCase() + oStringList[0].substring(1) : oStringList[0];
        
        for (var i = 1, len = oStringList.length; i < len; i++) {
            var s = oStringList[i];
            camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
        }
        
        return camelizedString;
    },
    //将字符串转换为可观察的模式
	// var s = 'abc\ndefg'
	// alert(s.inspect()); //abc一行，defg一行
    inspect: function(){
        return "'" + this.replace('\\', '\\\\').replace("'", '\\\'') + "'";
    }
});
//做一个名称链接
String.prototype.parseQuery = String.prototype.toQueryParams;
//定义两个对象
var $break = new Object();
var $continue = new Object();
/**
 * 枚举对象
 * @param {Object} iterator
 */
var Enumerable = {
	/**
	 * 对可枚举对象的每个成员调用iterator()方法
	 * 如果迭代器方法抛出$continue异常，则继续执行，如果抛出$break异常，则不再继续迭代
	 * 
	 * 其中调用了_each这个抽象方法，_each是由具体的继承于Enumerable的类实现的，
	 * index计数器的作用是用于告诉迭代器当前执行到第几个元素，中迭代器的可选实现
	 * @param {Object} iterator
	 */
    each: function(iterator){
        var index = 0;
        try {
            this._each(function(value){
                try {
                    iterator(value, index++);
                } 
                catch (e) {
                    if (e != $continue) 
                        throw e;
                }
            });
        } 
        catch (e) {
            if (e != $break) 
                throw e;
        }
    },
    
	/**
	 * 判断枚举对象中的所有元素是否都能使用iterator，若能使用返回true
	 * 如果没有指定的迭代器，则判断所有的元素是否都对应于布尔类型的true
	 * 使用$break异常，用于实现"逻辑与"操作的短路效果
	 * !!将一个变量强制转换为布尔类型
	 * @param {Object} iterator
	 */
    all: function(iterator){
        var result = true;
        this.each(function(value, index){
            result = result && !!(iterator || Prototype.K)(value, index);
            if (!result) 
                throw $break;
        });
        return result;
    },
    /**
     * 判断枚举对象中的所有元素是否都能使用iterator，若能使用返回true
     * 其原理与all相同
     * @param {Object} iterator
     */
    any: function(iterator){
        var result = true;
        this.each(function(value, index){
            if (result = !!(iterator || Prototype.K)(value, index)) 
                throw $break;
        });
        return result;
    },
    /**
     * 以数组返回所有枚举元素通过迭代器执行的结果
     * @param {Object} iterator
     */
    collect: function(iterator){
        var results = [];
        this.each(function(value, index){
            results.push(iterator(value, index));
        });
        return results;
    },
    /**
     * 返回第一个能够使得迭代器返回true的枚举元素，如果没有，则返回'undefined'，即result没有赋值
     * @param {Object} iterator
     */
    detect: function(iterator){
        var result;
        this.each(function(value, index){
            if (iterator(value, index)) {
                result = value;
                throw $break;
            }
        });
        return result;
    },
    /**
     * 以数组返回所有能使迭代器返回true的枚举元素
     * @param {Object} iterator
     */
    findAll: function(iterator){
        var results = [];
        this.each(function(value, index){
            if (iterator(value, index)) 
                results.push(value);
        });
        return results;
    },
    /**
     * 对所有符合此模式的枚举元素进行迭代运算，返回数组
     * @param {REG} pattern
     * @param {Object} iterator
     */
    grep: function(pattern, iterator){
        var results = [];
        this.each(function(value, index){
            var stringValue = value.toString();
            if (stringValue.match(pattern)) 
                results.push((iterator || Prototype.K)(value, index));
        })
        return results;
    },
    /**
     * 判断枚举元素中是否包含指定值的枚举元素
     * @param {Object} object
     */
    include: function(object){
        var found = false;
        this.each(function(value){
            if (value == object) {
                found = true;
                throw $break;
            }
        });
        return found;
    },
    /**
     * 字面意思注入，其作用相当于将memo作为联系各个迭代器的全局变量，每次迭代都对其进行操作
     * 返回操作的最后结果
     * @param {Object} memo
     * @param {Object} iterator
     */
    inject: function(memo, iterator){
        this.each(function(value, index){
            memo = iterator(memo, value, index);
        });
        return memo;
    },
    /**
     * 在所有枚举元素上调用method,并可以给这个方法传递参数，返回所有method执行结果，以数组返回
     * @param {Object} method
     */
    invoke: function(method){
        var args = $A(arguments).slice(1);
        return this.collect(function(value){
            return value[method].apply(value, args);
        });
    },
    /**
     * 返回最大的迭代器返回值
     * @param {Object} iterator
     */
    max: function(iterator){
        var result;
        this.each(function(value, index){
            value = (iterator || Prototype.K)(value, index);
            if (value >= (result || value)) 
                result = value;
        });
        return result;
    },
    /**
     * 返回最小的迭代器返回值
     * @param {Object} iterator
     */
    min: function(iterator){
        var result;
        this.each(function(value, index){
            value = (iterator || Prototype.K)(value, index);
            if (value <= (result || value)) 
                result = value;
        });
        return result;
    },
    /**
     * 按照迭代器的返回结果，将枚举元素分为两个数组，并且返回
     * @param {Object} iterator
     */
    partition: function(iterator){
        var trues = [], falses = [];
        this.each(function(value, index){
            ((iterator || Prototype.K)(value, index) ? trues : falses).push(value);
        });
        return [trues, falses];
    },
    /**
     * 返回所有枚举元素的property
     * @param {Object} property
     */
    pluck: function(property){
        var results = [];
        this.each(function(value, index){
            results.push(value[property]);
        });
        return results;
    },
    /**
     * 返回所有迭代器执行结果为false的元素
     * @param {Object} iterator
     */
    reject: function(iterator){
        var results = [];
        this.each(function(value, index){
            if (!iterator(value, index)) 
                results.push(value);
        });
        return results;
    },
    /**
     * 根据迭代器iterator的结果对枚举元素进行排序，使iterator执行结果小的元素排在后面
     * @param {Object} iterator
     */
    sortBy: function(iterator){
        return this.collect(function(value, index){
            return {
                value: value,
                criteria: iterator(value, index)
            };
        }).sort(function(left, right){
            var a = left.criteria, b = right.criteria;
            return a < b ? -1 : a > b ? 1 : 0;
        }).pluck('value');
    },
    /**
     * 将枚举对象转换为数组
     */
    toArray: function(){
        return this.collect(Prototype.K);
    },
    /**
     * 压缩函数
     */
    zip: function(){
        var iterator = Prototype.K, args = $A(arguments);
        if (typeof args.last() == 'function') 
            iterator = args.pop();
        
        var collections = [this].concat(args).map($A);
        return this.map(function(value, index){
            iterator(value = collections.pluck(index));
            return value;
        });
    },
    /**
     * 待实现的一个抽象方法
     */
    inspect: function(){
        return '#<Enumerable:' + this.toArray().inspect() + '>';
    }
}
/**
 * 对Enumerable基类的一些方法做了快速链接
 */
Object.extend(Enumerable, {
    map: Enumerable.collect,
    find: Enumerable.detect,
    select: Enumerable.findAll,
    member: Enumerable.include,
    entries: Enumerable.toArray
});
/**
 * 将一个对象转换为数组
 * @param {Object} iterable
 */
var $A = Array.from = function(iterable){
    if (!iterable) 
        return [];
    if (iterable.toArray) {
        return iterable.toArray();
    }
    else {
        var results = [];
        for (var i = 0; i < iterable.length; i++) 
            results.push(iterable[i]);
        return results;
    }
}
//让数组继承Enumerable
Object.extend(Array.prototype, Enumerable);

Array.prototype._reverse = Array.prototype.reverse;
//扩展数组
Object.extend(Array.prototype, {
	//循环数组
    _each: function(iterator){
        for (var i = 0; i < this.length; i++) 
            iterator(this[i]);
    },
    //清空数组
    clear: function(){
        this.length = 0;
        return this;
    },
    //第一个值
    first: function(){
        return this[0];
    },
    //最后一个值
    last: function(){
        return this[this.length - 1];
    },
    //用以删除一个数组中未定义的值和null值
    compact: function(){
        return this.select(function(value){
            return value != undefined || value != null;
        });
    },
    //将一个枚举对象中的所有数组元素全部展开，最后返回一个数组，是一个递归的过程
    flatten: function(){
        return this.inject([], function(array, value){
            return array.concat(value.constructor == Array ? value.flatten() : [value]);
        });
    },
    //从数组中删除参数指定的元素，返回删除后的结果
    without: function(){
        var values = $A(arguments);
        return this.select(function(value){
            return !values.include(value);
        });
    },
    //返回一个元素在数组中的索引
    indexOf: function(object){
        for (var i = 0; i < this.length; i++) 
            if (this[i] == object) 
                return i;
        return -1;
    },
    //将数组逆转
    reverse: function(inline){
        return (inline !== false ? this : this.toArray())._reverse();
    },
    //取出数组的第一个值
    shift: function(){
        var result = this[0];
        for (var i = 0; i < this.length - 1; i++) 
            this[i] = this[i + 1];
        this.length--;
        return result;
    },
    //返回数组的字符串表示
    inspect: function(){
        return '[' + this.map(Object.inspect).join(', ') + ']';
    }
});

/**
 * 定义哈希对象的通用操作
 * @param {Object} iterator
 */
var Hash = {
    _each: function(iterator){
        for (key in this) {
            var value = this[key];
            if (typeof value == 'function') 
                continue;
            
            var pair = [key, value];
            pair.key = key;
            pair.value = value;
            iterator(pair);
        }
    },
    
    keys: function(){
        return this.pluck('key');
    },
    
    values: function(){
        return this.pluck('value');
    },
    
    merge: function(hash){
        return $H(hash).inject($H(this), function(mergedHash, pair){
            mergedHash[pair.key] = pair.value;
            return mergedHash;
        });
    },
    
    toQueryString: function(){
        return this.map(function(pair){
            return pair.map(encodeURIComponent).join('=');
        }).join('&');
    },
    
    inspect: function(){
        return '#<Hash:{' +
        this.map(function(pair){
            return pair.map(Object.inspect).join(': ');
        }).join(', ') +
        '}>';
    }
}

function $H(object){
    var hash = Object.extend({}, object || {});
    Object.extend(hash, Enumerable);
    Object.extend(hash, Hash);
    return hash;
}

ObjectRange = Class.create();
Object.extend(ObjectRange.prototype, Enumerable);
Object.extend(ObjectRange.prototype, {
    initialize: function(start, end, exclusive){
        this.start = start;
        this.end = end;
        this.exclusive = exclusive;
    },
    
    _each: function(iterator){
        var value = this.start;
        do {
            iterator(value);
            value = value.succ();
        }
        while (this.include(value));
    },
    
    include: function(value){
        if (value < this.start) 
            return false;
        if (this.exclusive) 
            return value < this.end;
        return value <= this.end;
    }
});

var $R = function(start, end, exclusive){
    return new ObjectRange(start, end, exclusive);
}

var Ajax = {
    getTransport: function(){
        return Try.these(function(){
            return new ActiveXObject('Msxml2.XMLHTTP')
        }, function(){
            return new ActiveXObject('Microsoft.XMLHTTP')
        }, function(){
            return new XMLHttpRequest()
        }) ||
        false;
    },
    
    activeRequestCount: 0
}

Ajax.Responders = {
    responders: [],
    
    _each: function(iterator){
        this.responders._each(iterator);
    },
    
    register: function(responderToAdd){
        if (!this.include(responderToAdd)) 
            this.responders.push(responderToAdd);
    },
    
    unregister: function(responderToRemove){
        this.responders = this.responders.without(responderToRemove);
    },
    
    dispatch: function(callback, request, transport, json){
        this.each(function(responder){
            if (responder[callback] && typeof responder[callback] == 'function') {
                try {
                    responder[callback].apply(responder, [request, transport, json]);
                } 
                catch (e) {
                }
            }
        });
    }
};

Object.extend(Ajax.Responders, Enumerable);

Ajax.Responders.register({
    onCreate: function(){
        Ajax.activeRequestCount++;
    },
    
    onComplete: function(){
        Ajax.activeRequestCount--;
    }
});

Ajax.Base = function(){
};
Ajax.Base.prototype = {
    setOptions: function(options){
        this.options = {
            method: 'post',
            asynchronous: true,
            parameters: ''
        }
        Object.extend(this.options, options || {});
    },
    
    responseIsSuccess: function(){
        return this.transport.status == undefined ||
        this.transport.status == 0 ||
        (this.transport.status >= 200 && this.transport.status < 300);
    },
    
    responseIsFailure: function(){
        return !this.responseIsSuccess();
    }
}

Ajax.Request = Class.create();
Ajax.Request.Events = ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

Ajax.Request.prototype = Object.extend(new Ajax.Base(), {
    initialize: function(url, options){
        this.transport = Ajax.getTransport();
        this.setOptions(options);
        this.request(url);
    },
    
    request: function(url){
        var parameters = this.options.parameters || '';
        if (parameters.length > 0) 
            parameters += '&_=';
        
        try {
            this.url = url;
            if (this.options.method == 'get' && parameters.length > 0) 
                this.url += (this.url.match(/\?/) ? '&' : '?') + parameters;
            
            Ajax.Responders.dispatch('onCreate', this, this.transport);
            
            this.transport.open(this.options.method, this.url, this.options.asynchronous);
            
            if (this.options.asynchronous) {
                this.transport.onreadystatechange = this.onStateChange.bind(this);
                setTimeout((function(){
                    this.respondToReadyState(1)
                }).bind(this), 10);
            }
            
            this.setRequestHeaders();
            
            var body = this.options.postBody ? this.options.postBody : parameters;
            this.transport.send(this.options.method == 'post' ? body : null);
            
        } 
        catch (e) {
            this.dispatchException(e);
        }
    },
    
    setRequestHeaders: function(){
        var requestHeaders = ['X-Requested-With', 'XMLHttpRequest', 'X-Prototype-Version', Prototype.Version];
        
        if (this.options.method == 'post') {
            requestHeaders.push('Content-type', 'application/x-www-form-urlencoded');
            
            /* Force "Connection: close" for Mozilla browsers to work around
             * a bug where XMLHttpReqeuest sends an incorrect Content-length
             * header. See Mozilla Bugzilla #246651.
             */
            if (this.transport.overrideMimeType) 
                requestHeaders.push('Connection', 'close');
        }
        
        if (this.options.requestHeaders) 
            requestHeaders.push.apply(requestHeaders, this.options.requestHeaders);
        
        for (var i = 0; i < requestHeaders.length; i += 2) 
            this.transport.setRequestHeader(requestHeaders[i], requestHeaders[i + 1]);
    },
    
    onStateChange: function(){
        var readyState = this.transport.readyState;
        if (readyState != 1) 
            this.respondToReadyState(this.transport.readyState);
    },
    
    header: function(name){
        try {
            return this.transport.getResponseHeader(name);
        } 
        catch (e) {
        }
    },
    
    evalJSON: function(){
        try {
            return eval(this.header('X-JSON'));
        } 
        catch (e) {
        }
    },
    
    evalResponse: function(){
        try {
            return eval(this.transport.responseText);
        } 
        catch (e) {
            this.dispatchException(e);
        }
    },
    
    respondToReadyState: function(readyState){
        var event = Ajax.Request.Events[readyState];
        var transport = this.transport, json = this.evalJSON();
        
        if (event == 'Complete') {
            try {
                (this.options['on' + this.transport.status] ||
                this.options['on' + (this.responseIsSuccess() ? 'Success' : 'Failure')] ||
                Prototype.emptyFunction)(transport, json);
            } 
            catch (e) {
                this.dispatchException(e);
            }
            
            if ((this.header('Content-type') || '').match(/^text\/javascript/i)) 
                this.evalResponse();
        }
        
        try {
            (this.options['on' + event] || Prototype.emptyFunction)(transport, json);
            Ajax.Responders.dispatch('on' + event, this, transport, json);
        } 
        catch (e) {
            this.dispatchException(e);
        }
        
        /* Avoid memory leak in MSIE: clean up the oncomplete event handler */
        if (event == 'Complete') 
            this.transport.onreadystatechange = Prototype.emptyFunction;
    },
    
    dispatchException: function(exception){
        (this.options.onException || Prototype.emptyFunction)(this, exception);
        Ajax.Responders.dispatch('onException', this, exception);
    }
});

Ajax.Updater = Class.create();

Object.extend(Object.extend(Ajax.Updater.prototype, Ajax.Request.prototype), {
    initialize: function(container, url, options){
        this.containers = {
            success: container.success ? $(container.success) : $(container),
            failure: container.failure ? $(container.failure) : (container.success ? null : $(container))
        }
        
        this.transport = Ajax.getTransport();
        this.setOptions(options);
        
        var onComplete = this.options.onComplete || Prototype.emptyFunction;
        this.options.onComplete = (function(transport, object){
            this.updateContent();
            onComplete(transport, object);
        }).bind(this);
        
        this.request(url);
    },
    
    updateContent: function(){
        var receiver = this.responseIsSuccess() ? this.containers.success : this.containers.failure;
        var response = this.transport.responseText;
        
        if (!this.options.evalScripts) 
            response = response.stripScripts();
        
        if (receiver) {
            if (this.options.insertion) {
                new this.options.insertion(receiver, response);
            }
            else {
                Element.update(receiver, response);
            }
        }
        
        if (this.responseIsSuccess()) {
            if (this.onComplete) 
                setTimeout(this.onComplete.bind(this), 10);
        }
    }
});

Ajax.PeriodicalUpdater = Class.create();
Ajax.PeriodicalUpdater.prototype = Object.extend(new Ajax.Base(), {
    initialize: function(container, url, options){
        this.setOptions(options);
        this.onComplete = this.options.onComplete;
        
        this.frequency = (this.options.frequency || 2);
        this.decay = (this.options.decay || 1);
        
        this.updater = {};
        this.container = container;
        this.url = url;
        
        this.start();
    },
    
    start: function(){
        this.options.onComplete = this.updateComplete.bind(this);
        this.onTimerEvent();
    },
    
    stop: function(){
        this.updater.onComplete = undefined;
        clearTimeout(this.timer);
        (this.onComplete || Prototype.emptyFunction).apply(this, arguments);
    },
    
    updateComplete: function(request){
        if (this.options.decay) {
            this.decay = (request.responseText == this.lastText ? this.decay * this.options.decay : 1);
            
            this.lastText = request.responseText;
        }
        this.timer = setTimeout(this.onTimerEvent.bind(this), this.decay * this.frequency * 1000);
    },
    
    onTimerEvent: function(){
        this.updater = new Ajax.Updater(this.container, this.url, this.options);
    }
});
document.getElementsByClassName = function(className, parentElement){
    var children = ($(parentElement) || document.body).getElementsByTagName('*');
    return $A(children).inject([], function(elements, child){
        if (child.className.match(new RegExp("(^|\\s)" + className + "(\\s|$)"))) 
            elements.push(child);
        return elements;
    });
}

/*--------------------------------------------------------------------------*/

if (!window.Element) {
    var Element = new Object();
}

Object.extend(Element, {
    visible: function(element){
        return $(element).style.display != 'none';
    },
    
    toggle: function(){
        for (var i = 0; i < arguments.length; i++) {
            var element = $(arguments[i]);
            Element[Element.visible(element) ? 'hide' : 'show'](element);
        }
    },
    
    hide: function(){
        for (var i = 0; i < arguments.length; i++) {
            var element = $(arguments[i]);
            element.style.display = 'none';
        }
    },
    
    show: function(){
        for (var i = 0; i < arguments.length; i++) {
            var element = $(arguments[i]);
            element.style.display = '';
        }
    },
    
    remove: function(element){
        element = $(element);
        element.parentNode.removeChild(element);
    },
    
    update: function(element, html){
        $(element).innerHTML = html.stripScripts();
        setTimeout(function(){
            html.evalScripts()
        }, 10);
    },
    
    getHeight: function(element){
        element = $(element);
        return element.offsetHeight;
    },
    
    classNames: function(element){
        return new Element.ClassNames(element);
    },
    
    hasClassName: function(element, className){
        if (!(element = $(element))) 
            return;
        return Element.classNames(element).include(className);
    },
    
    addClassName: function(element, className){
        if (!(element = $(element))) 
            return;
        return Element.classNames(element).add(className);
    },
    
    removeClassName: function(element, className){
        if (!(element = $(element))) 
            return;
        return Element.classNames(element).remove(className);
    },
    
    // removes whitespace-only text node children
    cleanWhitespace: function(element){
        element = $(element);
        for (var i = 0; i < element.childNodes.length; i++) {
            var node = element.childNodes[i];
            if (node.nodeType == 3 && !/\S/.test(node.nodeValue)) 
                Element.remove(node);
        }
    },
    
    empty: function(element){
        return $(element).innerHTML.match(/^\s*$/);
    },
    
    scrollTo: function(element){
        element = $(element);
        var x = element.x ? element.x : element.offsetLeft, y = element.y ? element.y : element.offsetTop;
        window.scrollTo(x, y);
    },
    
    getStyle: function(element, style){
        element = $(element);
        var value = element.style[style.camelize()];
        if (!value) {
            if (document.defaultView && document.defaultView.getComputedStyle) {
                var css = document.defaultView.getComputedStyle(element, null);
                value = css ? css.getPropertyValue(style) : null;
            }
            else 
                if (element.currentStyle) {
                    value = element.currentStyle[style.camelize()];
                }
        }
        
        if (window.opera && ['left', 'top', 'right', 'bottom'].include(style)) 
            if (Element.getStyle(element, 'position') == 'static') 
                value = 'auto';
        
        return value == 'auto' ? null : value;
    },
    
    setStyle: function(element, style){
        element = $(element);
        for (name in style) 
            element.style[name.camelize()] = style[name];
    },
    
    getDimensions: function(element){
        element = $(element);
        if (Element.getStyle(element, 'display') != 'none') 
            return {
                width: element.offsetWidth,
                height: element.offsetHeight
            };
        
        // All *Width and *Height properties give 0 on elements with display none,
        // so enable the element temporarily
        var els = element.style;
        var originalVisibility = els.visibility;
        var originalPosition = els.position;
        els.visibility = 'hidden';
        els.position = 'absolute';
        els.display = '';
        var originalWidth = element.clientWidth;
        var originalHeight = element.clientHeight;
        els.display = 'none';
        els.position = originalPosition;
        els.visibility = originalVisibility;
        return {
            width: originalWidth,
            height: originalHeight
        };
    },
    
    makePositioned: function(element){
        element = $(element);
        var pos = Element.getStyle(element, 'position');
        if (pos == 'static' || !pos) {
            element._madePositioned = true;
            element.style.position = 'relative';
            // Opera returns the offset relative to the positioning context, when an
            // element is position relative but top and left have not been defined
            if (window.opera) {
                element.style.top = 0;
                element.style.left = 0;
            }
        }
    },
    
    undoPositioned: function(element){
        element = $(element);
        if (element._madePositioned) {
            element._madePositioned = undefined;
            element.style.position = element.style.top = element.style.left = element.style.bottom = element.style.right = '';
        }
    },
    
    makeClipping: function(element){
        element = $(element);
        if (element._overflow) 
            return;
        element._overflow = element.style.overflow;
        if ((Element.getStyle(element, 'overflow') || 'visible') != 'hidden') 
            element.style.overflow = 'hidden';
    },
    
    undoClipping: function(element){
        element = $(element);
        if (element._overflow) 
            return;
        element.style.overflow = element._overflow;
        element._overflow = undefined;
    }
});

var Toggle = new Object();
Toggle.display = Element.toggle;

/*--------------------------------------------------------------------------*/

Abstract.Insertion = function(adjacency){
    this.adjacency = adjacency;
}

Abstract.Insertion.prototype = {
    initialize: function(element, content){
        this.element = $(element);
        this.content = content.stripScripts();
        
        if (this.adjacency && this.element.insertAdjacentHTML) {
            try {
                this.element.insertAdjacentHTML(this.adjacency, this.content);
            } 
            catch (e) {
                if (this.element.tagName.toLowerCase() == 'tbody') {
                    this.insertContent(this.contentFromAnonymousTable());
                }
                else {
                    throw e;
                }
            }
        }
        else {
            this.range = this.element.ownerDocument.createRange();
            if (this.initializeRange) 
                this.initializeRange();
            this.insertContent([this.range.createContextualFragment(this.content)]);
        }
        
        setTimeout(function(){
            content.evalScripts()
        }, 10);
    },
    
    contentFromAnonymousTable: function(){
        var div = document.createElement('div');
        div.innerHTML = '<table><tbody>' + this.content + '</tbody></table>';
        return $A(div.childNodes[0].childNodes[0].childNodes);
    }
}

var Insertion = new Object();

Insertion.Before = Class.create();
Insertion.Before.prototype = Object.extend(new Abstract.Insertion('beforeBegin'), {
    initializeRange: function(){
        this.range.setStartBefore(this.element);
    },
    
    insertContent: function(fragments){
        fragments.each((function(fragment){
            this.element.parentNode.insertBefore(fragment, this.element);
        }).bind(this));
    }
});

Insertion.Top = Class.create();
Insertion.Top.prototype = Object.extend(new Abstract.Insertion('afterBegin'), {
    initializeRange: function(){
        this.range.selectNodeContents(this.element);
        this.range.collapse(true);
    },
    
    insertContent: function(fragments){
        fragments.reverse(false).each((function(fragment){
            this.element.insertBefore(fragment, this.element.firstChild);
        }).bind(this));
    }
});

Insertion.Bottom = Class.create();
Insertion.Bottom.prototype = Object.extend(new Abstract.Insertion('beforeEnd'), {
    initializeRange: function(){
        this.range.selectNodeContents(this.element);
        this.range.collapse(this.element);
    },
    
    insertContent: function(fragments){
        fragments.each((function(fragment){
            this.element.appendChild(fragment);
        }).bind(this));
    }
});

Insertion.After = Class.create();
Insertion.After.prototype = Object.extend(new Abstract.Insertion('afterEnd'), {
    initializeRange: function(){
        this.range.setStartAfter(this.element);
    },
    
    insertContent: function(fragments){
        fragments.each((function(fragment){
            this.element.parentNode.insertBefore(fragment, this.element.nextSibling);
        }).bind(this));
    }
});

/*--------------------------------------------------------------------------*/

Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
    initialize: function(element){
        this.element = $(element);
    },
    
    _each: function(iterator){
        this.element.className.split(/\s+/).select(function(name){
            return name.length > 0;
        })._each(iterator);
    },
    
    set: function(className){
        this.element.className = className;
    },
    
    add: function(classNameToAdd){
        if (this.include(classNameToAdd)) 
            return;
        this.set(this.toArray().concat(classNameToAdd).join(' '));
    },
    
    remove: function(classNameToRemove){
        if (!this.include(classNameToRemove)) 
            return;
        this.set(this.select(function(className){
            return className != classNameToRemove;
        }).join(' '));
    },
    
    toString: function(){
        return this.toArray().join(' ');
    }
}

Object.extend(Element.ClassNames.prototype, Enumerable);
var Field = {
    clear: function(){
        for (var i = 0; i < arguments.length; i++) 
            $(arguments[i]).value = '';
    },
    
    focus: function(element){
        $(element).focus();
    },
    
    present: function(){
        for (var i = 0; i < arguments.length; i++) 
            if ($(arguments[i]).value == '') 
                return false;
        return true;
    },
    
    select: function(element){
        $(element).select();
    },
    
    activate: function(element){
        element = $(element);
        element.focus();
        if (element.select) 
            element.select();
    }
}

/*--------------------------------------------------------------------------*/

var Form = {
    serialize: function(form){
        var elements = Form.getElements($(form));
        var queryComponents = new Array();
        
        for (var i = 0; i < elements.length; i++) {
            var queryComponent = Form.Element.serialize(elements[i]);
            if (queryComponent) 
                queryComponents.push(queryComponent);
        }
        
        return queryComponents.join('&');
    },
    
    getElements: function(form){
        form = $(form);
        var elements = new Array();
        
        for (tagName in Form.Element.Serializers) {
            var tagElements = form.getElementsByTagName(tagName);
            for (var j = 0; j < tagElements.length; j++) 
                elements.push(tagElements[j]);
        }
        return elements;
    },
    
    getInputs: function(form, typeName, name){
        form = $(form);
        var inputs = form.getElementsByTagName('input');
        
        if (!typeName && !name) 
            return inputs;
        
        var matchingInputs = new Array();
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            if ((typeName && input.type != typeName) ||
            (name && input.name != name)) 
                continue;
            matchingInputs.push(input);
        }
        
        return matchingInputs;
    },
    
    disable: function(form){
        var elements = Form.getElements(form);
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            element.blur();
            element.disabled = 'true';
        }
    },
    
    enable: function(form){
        var elements = Form.getElements(form);
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            element.disabled = '';
        }
    },
    
    findFirstElement: function(form){
        return Form.getElements(form).find(function(element){
            return element.type != 'hidden' && !element.disabled &&
            ['input', 'select', 'textarea'].include(element.tagName.toLowerCase());
        });
    },
    
    focusFirstElement: function(form){
        Field.activate(Form.findFirstElement(form));
    },
    
    reset: function(form){
        $(form).reset();
    }
}

Form.Element = {
    serialize: function(element){
        element = $(element);
        var method = element.tagName.toLowerCase();
        var parameter = Form.Element.Serializers[method](element);
        
        if (parameter) {
            var key = encodeURIComponent(parameter[0]);
            if (key.length == 0) 
                return;
            
            if (parameter[1].constructor != Array) 
                parameter[1] = [parameter[1]];
            
            return parameter[1].map(function(value){
                return key + '=' + encodeURIComponent(value);
            }).join('&');
        }
    },
    
    getValue: function(element){
        element = $(element);
        var method = element.tagName.toLowerCase();
        var parameter = Form.Element.Serializers[method](element);
        
        if (parameter) 
            return parameter[1];
    }
}

Form.Element.Serializers = {
    input: function(element){
        switch (element.type.toLowerCase()) {
            case 'submit':
            case 'hidden':
            case 'password':
            case 'text':
                return Form.Element.Serializers.textarea(element);
            case 'checkbox':
            case 'radio':
                return Form.Element.Serializers.inputSelector(element);
        }
        return false;
    },
    
    inputSelector: function(element){
        if (element.checked) 
            return [element.name, element.value];
    },
    
    textarea: function(element){
        return [element.name, element.value];
    },
    
    select: function(element){
        return Form.Element.Serializers[element.type == 'select-one' ? 'selectOne' : 'selectMany'](element);
    },
    
    selectOne: function(element){
        var value = '', opt, index = element.selectedIndex;
        if (index >= 0) {
            opt = element.options[index];
            value = opt.value;
            if (!value && !('value' in opt)) 
                value = opt.text;
        }
        return [element.name, value];
    },
    
    selectMany: function(element){
        var value = new Array();
        for (var i = 0; i < element.length; i++) {
            var opt = element.options[i];
            if (opt.selected) {
                var optValue = opt.value;
                if (!optValue && !('value' in opt)) 
                    optValue = opt.text;
                value.push(optValue);
            }
        }
        return [element.name, value];
    }
}

/*--------------------------------------------------------------------------*/

var $F = Form.Element.getValue;

/*--------------------------------------------------------------------------*/

Abstract.TimedObserver = function(){
}
Abstract.TimedObserver.prototype = {
    initialize: function(element, frequency, callback){
        this.frequency = frequency;
        this.element = $(element);
        this.callback = callback;
        
        this.lastValue = this.getValue();
        this.registerCallback();
    },
    
    registerCallback: function(){
        setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
    },
    
    onTimerEvent: function(){
        var value = this.getValue();
        if (this.lastValue != value) {
            this.callback(this.element, value);
            this.lastValue = value;
        }
    }
}

Form.Element.Observer = Class.create();
Form.Element.Observer.prototype = Object.extend(new Abstract.TimedObserver(), {
    getValue: function(){
        return Form.Element.getValue(this.element);
    }
});

Form.Observer = Class.create();
Form.Observer.prototype = Object.extend(new Abstract.TimedObserver(), {
    getValue: function(){
        return Form.serialize(this.element);
    }
});

/*--------------------------------------------------------------------------*/

Abstract.EventObserver = function(){
}
Abstract.EventObserver.prototype = {
    initialize: function(element, callback){
        this.element = $(element);
        this.callback = callback;
        
        this.lastValue = this.getValue();
        if (this.element.tagName.toLowerCase() == 'form') 
            this.registerFormCallbacks();
        else 
            this.registerCallback(this.element);
    },
    
    onElementEvent: function(){
        var value = this.getValue();
        if (this.lastValue != value) {
            this.callback(this.element, value);
            this.lastValue = value;
        }
    },
    
    registerFormCallbacks: function(){
        var elements = Form.getElements(this.element);
        for (var i = 0; i < elements.length; i++) 
            this.registerCallback(elements[i]);
    },
    
    registerCallback: function(element){
        if (element.type) {
            switch (element.type.toLowerCase()) {
                case 'checkbox':
                case 'radio':
                    Event.observe(element, 'click', this.onElementEvent.bind(this));
                    break;
                case 'password':
                case 'text':
                case 'textarea':
                case 'select-one':
                case 'select-multiple':
                    Event.observe(element, 'change', this.onElementEvent.bind(this));
                    break;
            }
        }
    }
}

Form.Element.EventObserver = Class.create();
Form.Element.EventObserver.prototype = Object.extend(new Abstract.EventObserver(), {
    getValue: function(){
        return Form.Element.getValue(this.element);
    }
});

Form.EventObserver = Class.create();
Form.EventObserver.prototype = Object.extend(new Abstract.EventObserver(), {
    getValue: function(){
        return Form.serialize(this.element);
    }
});
if (!window.Event) {
    var Event = new Object();
}

Object.extend(Event, {
    KEY_BACKSPACE: 8,
    KEY_TAB: 9,
    KEY_RETURN: 13,
    KEY_ESC: 27,
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,
    KEY_DELETE: 46,
    
    element: function(event){
        return event.target || event.srcElement;
    },
    
    isLeftClick: function(event){
        return (((event.which) && (event.which == 1)) ||
        ((event.button) && (event.button == 1)));
    },
    
    pointerX: function(event){
        return event.pageX ||
        (event.clientX +
        (document.documentElement.scrollLeft || document.body.scrollLeft));
    },
    
    pointerY: function(event){
        return event.pageY ||
        (event.clientY +
        (document.documentElement.scrollTop || document.body.scrollTop));
    },
    
    stop: function(event){
        if (event.preventDefault) {
            event.preventDefault();
            event.stopPropagation();
        }
        else {
            event.returnValue = false;
            event.cancelBubble = true;
        }
    },
    
    // find the first node with the given tagName, starting from the
    // node the event was triggered on; traverses the DOM upwards
    findElement: function(event, tagName){
        var element = Event.element(event);
        while (element.parentNode &&
        (!element.tagName ||
        (element.tagName.toUpperCase() != tagName.toUpperCase()))) 
            element = element.parentNode;
        return element;
    },
    
    observers: false,
    
    _observeAndCache: function(element, name, observer, useCapture){
        if (!this.observers) 
            this.observers = [];
        if (element.addEventListener) {
            this.observers.push([element, name, observer, useCapture]);
            element.addEventListener(name, observer, useCapture);
        }
        else 
            if (element.attachEvent) {
                this.observers.push([element, name, observer, useCapture]);
                element.attachEvent('on' + name, observer);
            }
    },
    
    unloadCache: function(){
        if (!Event.observers) 
            return;
        for (var i = 0; i < Event.observers.length; i++) {
            Event.stopObserving.apply(this, Event.observers[i]);
            Event.observers[i][0] = null;
        }
        Event.observers = false;
    },
    
    observe: function(element, name, observer, useCapture){
        var element = $(element);
        useCapture = useCapture || false;
        
        if (name == 'keypress' &&
        (navigator.appVersion.match(/Konqueror|Safari|KHTML/) ||
        element.attachEvent)) 
            name = 'keydown';
        
        this._observeAndCache(element, name, observer, useCapture);
    },
    
    stopObserving: function(element, name, observer, useCapture){
        var element = $(element);
        useCapture = useCapture || false;
        
        if (name == 'keypress' &&
        (navigator.appVersion.match(/Konqueror|Safari|KHTML/) ||
        element.detachEvent)) 
            name = 'keydown';
        
        if (element.removeEventListener) {
            element.removeEventListener(name, observer, useCapture);
        }
        else 
            if (element.detachEvent) {
                element.detachEvent('on' + name, observer);
            }
    }
});

/* prevent memory leaks in IE */
Event.observe(window, 'unload', Event.unloadCache, false);
var Position = {
    // set to true if needed, warning: firefox performance problems
    // NOT neeeded for page scrolling, only if draggable contained in
    // scrollable elements
    includeScrollOffsets: false,
    
    // must be called before calling withinIncludingScrolloffset, every time the
    // page is scrolled
    prepare: function(){
        this.deltaX = window.pageXOffset ||
        document.documentElement.scrollLeft ||
        document.body.scrollLeft ||
        0;
        this.deltaY = window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
    },
    
    realOffset: function(element){
        var valueT = 0, valueL = 0;
        do {
            valueT += element.scrollTop || 0;
            valueL += element.scrollLeft || 0;
            element = element.parentNode;
        }
        while (element);
        return [valueL, valueT];
    },
    
    cumulativeOffset: function(element){
        var valueT = 0, valueL = 0;
        do {
            valueT += element.offsetTop || 0;
            valueL += element.offsetLeft || 0;
            element = element.offsetParent;
        }
        while (element);
        return [valueL, valueT];
    },
    
    positionedOffset: function(element){
        var valueT = 0, valueL = 0;
        do {
            valueT += element.offsetTop || 0;
            valueL += element.offsetLeft || 0;
            element = element.offsetParent;
            if (element) {
                p = Element.getStyle(element, 'position');
                if (p == 'relative' || p == 'absolute') 
                    break;
            }
        }
        while (element);
        return [valueL, valueT];
    },
    
    offsetParent: function(element){
        if (element.offsetParent) 
            return element.offsetParent;
        if (element == document.body) 
            return element;
        
        while ((element = element.parentNode) && element != document.body) 
            if (Element.getStyle(element, 'position') != 'static') 
                return element;
        
        return document.body;
    },
    
    // caches x/y coordinate pair to use with overlap
    within: function(element, x, y){
        if (this.includeScrollOffsets) 
            return this.withinIncludingScrolloffsets(element, x, y);
        this.xcomp = x;
        this.ycomp = y;
        this.offset = this.cumulativeOffset(element);
        
        return (y >= this.offset[1] &&
        y < this.offset[1] + element.offsetHeight &&
        x >= this.offset[0] &&
        x < this.offset[0] + element.offsetWidth);
    },
    
    withinIncludingScrolloffsets: function(element, x, y){
        var offsetcache = this.realOffset(element);
        
        this.xcomp = x + offsetcache[0] - this.deltaX;
        this.ycomp = y + offsetcache[1] - this.deltaY;
        this.offset = this.cumulativeOffset(element);
        
        return (this.ycomp >= this.offset[1] &&
        this.ycomp < this.offset[1] + element.offsetHeight &&
        this.xcomp >= this.offset[0] &&
        this.xcomp < this.offset[0] + element.offsetWidth);
    },
    
    // within must be called directly before
    overlap: function(mode, element){
        if (!mode) 
            return 0;
        if (mode == 'vertical') 
            return ((this.offset[1] + element.offsetHeight) - this.ycomp) /
            element.offsetHeight;
        if (mode == 'horizontal') 
            return ((this.offset[0] + element.offsetWidth) - this.xcomp) /
            element.offsetWidth;
    },
    
    clone: function(source, target){
        source = $(source);
        target = $(target);
        target.style.position = 'absolute';
        var offsets = this.cumulativeOffset(source);
        target.style.top = offsets[1] + 'px';
        target.style.left = offsets[0] + 'px';
        target.style.width = source.offsetWidth + 'px';
        target.style.height = source.offsetHeight + 'px';
    },
    
    page: function(forElement){
        var valueT = 0, valueL = 0;
        
        var element = forElement;
        do {
            valueT += element.offsetTop || 0;
            valueL += element.offsetLeft || 0;
            
            // Safari fix
            if (element.offsetParent == document.body) 
                if (Element.getStyle(element, 'position') == 'absolute') 
                    break;
            
        }
        while (element = element.offsetParent);
        
        element = forElement;
        do {
            valueT -= element.scrollTop || 0;
            valueL -= element.scrollLeft || 0;
        }
        while (element = element.parentNode);
        
        return [valueL, valueT];
    },
    
    clone: function(source, target){
        var options = Object.extend({
            setLeft: true,
            setTop: true,
            setWidth: true,
            setHeight: true,
            offsetTop: 0,
            offsetLeft: 0
        }, arguments[2] || {})
        
        // find page position of source
        source = $(source);
        var p = Position.page(source);
        
        // find coordinate system to use
        target = $(target);
        var delta = [0, 0];
        var parent = null;
        // delta [0,0] will do fine with position: fixed elements,
        // position:absolute needs offsetParent deltas
        if (Element.getStyle(target, 'position') == 'absolute') {
            parent = Position.offsetParent(target);
            delta = Position.page(parent);
        }
        
        // correct by body offsets (fixes Safari)
        if (parent == document.body) {
            delta[0] -= document.body.offsetLeft;
            delta[1] -= document.body.offsetTop;
        }
        
        // set position
        if (options.setLeft) 
            target.style.left = (p[0] - delta[0] + options.offsetLeft) + 'px';
        if (options.setTop) 
            target.style.top = (p[1] - delta[1] + options.offsetTop) + 'px';
        if (options.setWidth) 
            target.style.width = source.offsetWidth + 'px';
        if (options.setHeight) 
            target.style.height = source.offsetHeight + 'px';
    },
    
    absolutize: function(element){
        element = $(element);
        if (element.style.position == 'absolute') 
            return;
        Position.prepare();
        
        var offsets = Position.positionedOffset(element);
        var top = offsets[1];
        var left = offsets[0];
        var width = element.clientWidth;
        var height = element.clientHeight;
        
        element._originalLeft = left - parseFloat(element.style.left || 0);
        element._originalTop = top - parseFloat(element.style.top || 0);
        element._originalWidth = element.style.width;
        element._originalHeight = element.style.height;
        
        element.style.position = 'absolute';
        element.style.top = top + 'px';
        ;
        element.style.left = left + 'px';
        ;
        element.style.width = width + 'px';
        ;
        element.style.height = height + 'px';
        ;
    },
    
    relativize: function(element){
        element = $(element);
        if (element.style.position == 'relative') 
            return;
        Position.prepare();
        
        element.style.position = 'relative';
        var top = parseFloat(element.style.top || 0) - (element._originalTop || 0);
        var left = parseFloat(element.style.left || 0) - (element._originalLeft || 0);
        
        element.style.top = top + 'px';
        element.style.left = left + 'px';
        element.style.height = element._originalHeight;
        element.style.width = element._originalWidth;
    }
}

// Safari returns margins on body which is incorrect if the child is absolutely
// positioned.  For performance reasons, redefine Position.cumulativeOffset for
// KHTML/WebKit only.
if (/Konqueror|Safari|KHTML/.test(navigator.userAgent)) {
    Position.cumulativeOffset = function(element){
        var valueT = 0, valueL = 0;
        do {
            valueT += element.offsetTop || 0;
            valueL += element.offsetLeft || 0;
            if (element.offsetParent == document.body) 
                if (Element.getStyle(element, 'position') == 'absolute') 
                    break;
            
            element = element.offsetParent;
        }
        while (element);
        
        return [valueL, valueT];
    }
}
