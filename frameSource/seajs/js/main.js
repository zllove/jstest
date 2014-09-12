seajs.config({
    base : './js/',
    alias : {
        'jquery' : 'jquery-1.3.2'
//        'plugins' : 'plugins'
    }
});

define('team', function(require){
    require('plugins')();
    $('a').ari();
});
seajs.use('team');