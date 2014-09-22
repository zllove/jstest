/*
require.config({
    paths : {
        jquery : 'jquery1.9.1'
    }
});
require(['jquery'], function($){
    alert($(window).width());
});
*/

require.config({
    baseUrl : 'js'
});

require(['selector'], function(query){
    var els = query('.wrapper');
    console.log(els);
});