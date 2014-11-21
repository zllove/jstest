function startMove(obj, targetJson, options){
    options = options || {};
    options.type = options.type || 'ease-out';
    options.time = options.time || 700;
    options.addNames = options.addNames || 0;
    options.addValue = options.addValue || Math.floor(Math.random() * 101);
    options.cover == undefined && (options.cover = false);
    clearInterval(obj.timer);
    var arrStyle = ['width', 'height', 'top', 'left', 'opacity'];
    for(var name in targetJson){
        var nameTest = module.exports.findIndex(name, arrStyle);
        if(nameTest != -1 && !options.cover){
            arrStyle.splice(nameTest, 1);
        }
    }
    for(var i = 0; i < options.addNames; i++){
        var addName = arrStyle[Math.floor(Math.random() * arrStyle.length)];
        targetJson[addName] = options.addValue;
        arrStyle.splice(module.exports.findIndex(addName, arrStyle), 1);
    }
    var start = {};
    var dis = {};
    var count = Math.floor(options.time / 20);
    for(var name in targetJson){
        if(name == 'opacity'){
            start[name] = Math.round(parseFloat(module.exports.getStyle(obj, name)) * 100);
        } else {
            start[name] = parseInt(module.exports.getStyle(obj, name));
        }
        if(isNaN(start[name])){
            switch(name){
                case 'opacity':
                    start[name] = 100;
                    break;
                case 'left':
                    start[name] = 0;
                    break;
                case 'top':
                    start[name] = 0;
                    break;
                case 'width':
                    start[name] = obj.offsetWidth;
                    break;
                case 'height':
                    start[name] = obj.offsetHeight;
                    break;
                case 'borderWidth':
                    start[name] = 0;
                    break;
            }
        }
        dis[name] = targetJson[name] - start[name];
    }
    var n = 0;
    obj.timer = setInterval(function(){
        n++;
        for(var name in targetJson){
            switch(options.type){
                case 'linear':
                    var a = n / count;
                    var cur = start[name] + dis[name] * a;
                    break;
                case 'ease-in':
                    var a = n / count;
                    var cur = start[name] + dis[name] * a * a * a;
                    break;
                case 'ease-out':
                    var a = 1 - n / count;
                    var cur = start[name] + dis[name] * (1 - a * a * a);
                    break;
            }
            if(name == 'opacity'){
                obj.style[name] = cur / 100;
                obj.style.filter = 'alpha(opacity:' + cur + ')';
            } else {
                obj.style[name] = cur + 'px';
            }
        }
        if(n == count){
            clearInterval(obj.timer);
            options.fnEnd && options.fnEnd();
        }
    }, 20);
}
