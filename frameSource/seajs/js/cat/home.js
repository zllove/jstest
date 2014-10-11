define(['cat'], function(){
    var home = {
        init : function(){
            cat.init();
            console.log('home init');
        }
    }
    home.init();

    return home;
});