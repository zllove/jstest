/**
 *
 */
var Module;
if(Module && (typeof Module != 'object' || Module.NAME)){
    throw new Error('Namespace Module already exists.');
}
Module = {};
Module.NAME = 'Module';
Module.VERSION = 0.1;
Module.EXPORT = ['require', 'importSymbols'];
Module.EXPORT_OK = ['createNamespace', 'isDefined', 'registerInitializationFunction', 'runInitializationFunctions', 'modules', 'globalNamespace'];
Module.globalNamespace = this;
Module.modules = {'Module': Module};

Module.createNamespace = function(name, version){
    if(!name) {
        throw new Error('Module.createNamespace: name required.');
    }
    if(name.charAt(0) == '.' || name.charAt(name.length - 1) == '.' || name.indexOf('..') != -1){
        throw new Error('Module.createNamespace:illegal name:' + name);
    }
    var parts = name.split('.');
    var container = Module.globalNamespace;
    for(var i=0; i<parts.length; i++){
        var part = parts[i];
        if(!container[part]) {
            container[part] = {};
        } else if(typeof container[part] != 'object'){
            var n = parts.slice(0, i).join('.');
            throw new Error(n + ' already exists and is not an object.');
        }
        container = container[part];
    }

    var namespace = container;
    if(namespace.NAME) {
        throw new Error('module' + name + ' is already defined.');
    }
    namespace.NAME = name;
    if(version){
        namespace.VERSION = version;
    }

    Module.modules[name] = namespace;
    return namespace;
}
Module.isDefined = function(name){
    return name in Module.modules;
}
Module.required = function(name, version){
    if(!(name in Module.modules)){
        throw new Error('Module ' + name + ' is not defined.');
    }
    if(!version) {
        return;
    }
    var n = Module.modules[name];
    if(!n.VERSION || n.VERSION < version){
        throw new Error('Module ' + name + ' has version ' + n.VERSION + ' but version ' + version + ' or greater is required.');
    }
}
Module.importSymbols = function(from){
    if(typeof from == 'string') {
        from = Module.modules[from];
    }
    if(!from || typeof from != 'object'){
        throw new Error('Module.importSymbols(): ' + 'namespace object required.');
    }
    var to = Module.globalNamespace;
    var symbols = [];
    var firstsymbol = l;
    if(arguments.length > 1 && typeof arguments[1] == 'object'){
        if(arguments[1] != null) {
            to = arguments[1];
        }
        firstsymbol = 2;
    }
    for(var a=firstsymbol; a<arguments.length; a++){
        symbols.push(arguments[a]);
    }
    if(symbols.length == 0){
        if(from.EXPORT){
            for(var i=0; i<from.EXPORT.length; i++){
                var s = from.EXPORT[i];
                to[s] = from[s];
            }
            return;
        } else if(!from_EXPORT_OK){
            for(s in from){
                to[s] = from[s];
            }
            return;
        }

    }
}



