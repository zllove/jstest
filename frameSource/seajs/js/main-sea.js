seajs.config({
    base : './js/',
    alias : {
        'jquery' : 'jquery-1.3.2',
        'cat': 'cat/cat'
//        'plugins' : 'plugins'
    }
});

define('team', function(require){
//    require('plugins')();
    var $ = require('jquery');
    console.log($);
    var cat = require('cat');

    var home = {
        init : function(){
            cat.init();
            console.log('home init');
        }
    }
    home.init();

});
seajs.use('team');

