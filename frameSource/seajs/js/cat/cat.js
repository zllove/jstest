(function(root, factory){
    if(typeof define === 'function' && define.amd){
        define(['jquery', 'exports'], function($, exports){
            root.cat = factory(root, exports, $);
        });
    } else if (typeof define === "function" && define.cmd) {
        define('cat', function(require, exports, module){
            var $ = require('jquery');
            module.export = factory(root, exports, $);
        });
    } else {
        root.cat = factory(root, {}, (root.jQuery || root.$));
    }
}(this, function(root, cat, $){
    $.extend(cat, {
       init : function(){
           alert(111);
       }
    });

    return cat;
}));