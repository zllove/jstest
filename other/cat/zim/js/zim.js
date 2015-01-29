var mix = function(){
    var copy, name, options;
    var target = arguments[0] || {}, i = 1, length = arguments.length;
    console.log(target);
    if(length === i){
        target = this;
        --i;
    }
    if(typeof target !== "object" && !$.isFunction(target)){ target = {} }
    for(;i<length;i++){
        if((options = arguments[i]) != null){
            for(name in options){
                if(target[name] !== undefined){
                    throw new Error(name + ' in target was defined property.');
                }
                copy = options[name];
                if(target === copy){ continue; }
                if(copy !== undefined){ target[ name ] = copy; }
            }
        }
    }
    return target;
};
var obj = {
    ns:function(strNS, property){
        if (typeof strNS === 'string') {
            var nss = strNS.split('.'), parent = window;
            if (strNS.charAt(0) === '.') {
                nss.shift();
            }
            while (strNS = nss.shift()) {
                parent[strNS] = parent[strNS] || {};
                parent = parent[strNS];
            }
            if ($.isFunction(property)) {
                property.call(parent);
            } else if ($.isPlainObject(property)) {
                mix(parent, property);
            }
            return parent;
        }
        return strNS;
    }
}





