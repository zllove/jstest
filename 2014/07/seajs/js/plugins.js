define(['jquery'], function(require, exports, module){
    return function(){
        $.fn.ari = function(){
            return this.each(function(){
                console.log(this.innerHTML);
            });
        }
    }
});