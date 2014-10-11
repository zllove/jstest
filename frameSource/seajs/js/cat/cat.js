(function(root, factory){
    if(typeof define === 'function' && define.amd){
        define(['jquery', 'exports'], function($, exports){
            root.cat = factory(root, exports, $);
        });
//    } else if(typeof exports !== 'undefined') {
    } else if (typeof define === "function" && define.cmd) {
        var $ = require('jquery');
        factory(root, exports, $);
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