/**
 * Created by jikey.
 * Link: jikeytang@gmail.com
 * Date: 12-4-13
 * Time: 下午4:57
 * Info:
 */
Ice.ns('Ice.grid', 'Ice.list', 'Ice.dd', 'Ice.tree', 'Ice.form', 'Ice.menu', 'Ice.state', 'Ice.layout', 'Ice.app', 'Ice.ux', 'Ice.chart', 'Ice.direct');
Ice.apply(Ice, function(){
    var I = Ice,
        idSeed = 0,
        scrollWidth = null;
    return {
        emptyFn: function(){},
        extendX: function(supr, fn){
            return Ice.extend(supr, fn(supr.prototype));
        },
        getDOC: function(){
            return Ice.get(document);
        },
        // 验证v是否为数值，不是返回defaultValue
        num: function(v, defaultValue){
            v = Number(Ice.isEmpty(v) || Ice.isArray(v) || typeof v == 'boolean' || (typeof v == 'string' && v.trim().length == 0) ? NaN : v);
            return isNaN(v) ? defaultValue : v;
        },
        // 判断v是否为空，空则返回defaultValue
        value: function(v, defaultValue, allowBlank){
            return Ice.isEmpty(v, allowBlank) ? defaultValue : v;
        },
        // 避免传递的字符串参数被正则表达式读取
        escapeRe: function(s){
            return s.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');;
        },
        /**
         * 把o[name]转换为一组合函数
         * @param o
         * @param name
         * @param fn
         * @param scope
         */
        sequence: function(o, name, fn, scope){
            o[name] = o[name].createSequence(fn, scope);
        },
        // 页面被初始化完毕后，在元素上绑定事件监听。事件名在'@'符号后
        addBehaviors: function(o){
        },
        /**
         * 精确的计算了滚动条的宽度
         * @param force （可选）如果为true则强制重算该值
         */
        getScrollBarWidth: function(force){
            if(!Ice.isReady){
                return 0;
            }
            /*
            if(force == true && scrollWidth === null){
                var div = Ice.getBody().createChild('<div class="x-hide-offsets" style="width:100px;height:50px;overflow:hidden;"><div style="height:200px;"></div></div>'),
                    child = div.child('div', true);
            }
            */
            // TODO 未完成
        },
        /**
         * 复制源对象身上指定的属性到目标对象
         * @param dest 目标对象
         * @param source 源对象
         * @param names 可以是属性名称构成的数组，也可以是属性名称构成的字符串，用逗号、分号隔开
         */
        copyTo: function(dest, source, names){
            if(typeof names == 'string'){
                names = names.split(/[,;\s]/);
            }
            Ice.each(names, function(name){
                if(source.hasOwnProperty(name)){
                    dest[name] = source[name];
                }
            }, this);
            return dest;
        },
        /**
         * 尝试去移除每个传入的对象，包括DOM，事件侦听者，并呼叫他们的destroy方法（如果存在）
         */
        destroy: function(){
            Ice.each(arguments, function(arg){
                if(arg){
                    if(Ice.isArray(arg)){
                        this.destroy.apply(this, arg);
                    } else if(typeof arg.destroy == 'function'){
                        arg.destroy();
                    } else if(arg.dom){
                        arg.remove();
                    }
                }
            }, this);
        },
        /**
         * 删除对象的指定属性（支持传入多参，同时删除多个属性）
         * @param o
         * @param arg1
         * @param arg2
         * @param etc
         */
        destroyMembers: function(o, arg1, arg2, etc){
            for(var i=1,a = arguments, len=a.length; i<len; i++){
                Ice.destroy(o[a[i]]);
                delete o[a[i]];
            }
        },
        /**
         * 复制传入的数组，并删除没有意义的元素，比如 0 null undefined 等
         * @param arr
         */
        clean: function(arr){
            var ret = [];
            Ice.each(arr, function(v){
                if(!!v){
                    ret.push(v);
                }
            });
            return ret;
        },
        // 过滤掉重复值
        unique: function(arr){
            var ret = [], collect = {};
            Ice.each(arr, function(v){
                if(!collect[v]){
                    ret.push(v);
                }
                collect[v] = true;
            });
            return ret;
        },
        // 将嵌套的多维数组合并成一个一维数组
        flatten: function(arr){
            var worker = [];
            function rflatten(a){
                Ice.each(a, function(v){
                    if(Ice.isArray(v)){
                        rflatten(v);
                    } else {
                        worker.push(v);
                    }
                });
                return worker;
            }
            return rflatten(arr);
        },
        /**
         * 返回数组中的最小值
         * @param arr
         * @param comp
         */
        min: function(arr, comp){
            var ret = arr[0];
            comp = comp || function(a, b){ return a < b ? -1 : 1; };
            Ice.each(arr, function(v){
                ret = comp(ret, v) == -1 ? ret : v;
            });
            return ret;
        },
        max: function(arr, comp){
            var ret = arr[0];
            comp = comp || function(a, b){ return a > b ? 1 : -1; };
            Ice.each(arr, function(v){
                ret = comp(ret, v) == 1 ? ret : v;
            });
            return ret;
        },
        // 计算数组的平均值
        mean: function(arr){
            return arr.length > 0 ? Ice.sum(arr) / arr.length : undefined;
        },
        // 计算数组的和
        sum: function(arr){
            var ret = 0;
            Ice.each(arr, function(v){
                ret += v;
            });
            return ret;
        },
        // 分割一个集合为两个: 一个true集合和一个false
        partition: function(arr, truth){
            var ret = [[], []];
            Ice.each(arr, function(v, i, a){
                ret[(truth && truth(v, i, a)) || (!truth && v) ? 0 : 1].push(v);
            });
            return ret;
        },
        // 在数组中的每个元素上调用同一方法
        invoke: function(arr, methodName){
            var ret = [],
                arg = Array.prototype.slice(arguments, 2);
            Ice.each(arr, function(v, i){
                if(v && typeof v[methodName] == 'function'){
                    ret.push(v[methodName].apply(v, arg));
                } else {
                    ret.push(undefined);
                }
            });
            return ret;
        },
        // 从数组中的每个元素中提取属性的值
        pluck: function(arr, prop){
            var ret = [];
            Ice.each(arr, function(v){
                ret.push(v[prop]);
            });
            return ret;
        },
        // 返回参数类型的详细信息。如果送入的对象是null或undefined那么返回false
        type: function(o){
            if(o === undefined || o === null){
                return false;
            }
            /*
            if(o.htmlElment){
                return 'element';
            }
            */
            var t = typeof o;
            if(t == 'object' && o.nodeName){
                switch(o.nodeType){
                    case 1: return 'element';
                    case 3: return (/\S/).test(o.nodeValue) ? 'textnode' : 'whitespace';
                }
            }
            if(t == 'object' || t == 'function'){
                switch(o.constructor){
                    case Array: return 'array';
                    case RegExp: return 'regexp';
                    case Date: return 'date';
                }
                if(typeof o.length == 'number' && typeof o.item == 'function'){
                    return 'nodelist';
                }
            }
            return t;
        },
        intercept: function(o, name, fn, scope){
            o[name] = o[name].createInterceptor(fn, scope);
        },
        callback: function(cb, scope, args, delay){
            if(typeof cb == 'function'){
                if(delay){
                    cb.defer(delay, scope, args || []);
                } else {
                    cb.apply(scope, args || []);
                }
            }
        }
    };
}());
Ice.applyIf(String, {
    // 把输入的 ' 与 \ 字符转义
    escape: function(string){
        return string.replace(/('|\\)/g, '\\$1');
    },
    // 在字符串左边填充指定字符。这对于统一字符或日期标准格式非常有用
    leftPad: function(val, size, ch){
        var ret = String(val);
        if(!ch){
            ch = ' ';
        }
        while(ret.length < size){
            ret = ch + ret;
        }
        return ret;
    }
});
String.prototype.toggle = function(value, other){
    return this == value ? other : value;
};
// 去除两边空格
String.prototype.trim = function(){
    var re = /^\s+|\s$/g;
    return function(){
        return this.replace(re, '');
    }
}();
// 得到时间差
Date.prototype.getElapsed = function(date){
    return Math.abs((date || new Date()).getTime() - this.getTime());
}
Ice.applyIf(Number.prototype, {
    // 如果数值在min和max之间，则返回该数值，如果不在该范围内，则返回靠近min或max的值
    constrain: function(min, max){
        return Math.min(Math.max(this, min), max);
    }
});