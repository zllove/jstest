seajs.config({
    base : './js/',
    alias : {
        'jquery' : 'jquery-1.3.2',
//        'jquery' : 'cat/jquery-1.10.2.min',
        'cat': 'cat/cat'
//        'plugins' : 'plugins'
    }
});

define('team', function(require, exports, module){
    var cat = require('cat');

    var home = {
        init : function(){
            cat.init();
            console.log('home init');
        }
    }
    home.init();
    return home;

});
seajs.use('team', function(t){
//    t.home.init();
});

