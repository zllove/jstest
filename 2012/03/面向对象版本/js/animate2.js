function css(obj, attr, value) {
    if (arguments.length == 2) {
        if (attr != 'opacity') {
            return parseInt(obj.currentStyle ? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj, false)[attr]);
        }
        else {
            return Math.round(100 * parseFloat(obj.currentStyle ? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj, false)[attr]));
        }
    } else if (arguments.length == 3)
        switch (attr) {
            case 'width':
            case 'height':
            case 'paddingLeft':
            case 'paddingTop':
            case 'paddingRight':
            case 'paddingBottom':
                value = Math.max(value, 0);
            case 'left':
            case 'top':
            case 'marginLeft':
            case 'marginTop':
            case 'marginRight':
            case 'marginBottom':
                obj.style[attr] = value + 'px';
                break;
            case 'opacity':
                obj.style.filter = "alpha(opacity:" + value + ")";
                obj.style.opacity = value / 100;
                break;
            default:
                obj.style[attr] = value;
        }
    return function (attr_in, value_in) {
        css(obj, attr_in, value_in)
    };
}
var move_type = {
    buffer:1,
    flex  :2
};
function stopMove(obj) {
    clearInterval(obj.timer);
}
function startMove(obj, oTarget, iType, fnCallBack, fnDuring) {
//obj是指要运动的物体
//itype是要采取哪种类型的运动move_type.buffer为缓冲运动，move_type.flex弹性运动。
//oTarget是目标要运行到多少来.默认是px所以不需要带单位。
//fnCallBack运动结束要做些什么。
//fnduring在运动中要进行什么
    var fnMove = null;
    if (obj.timer) {
        clearInterval(obj.timer);
    }
    switch (iType) {
        case move_type.buffer:
            fnMove = doMoveBuffer;
            break;
        case move_type.flex:
            fnMove = doMoveFlex;
            break;
    }
    obj.timer = setInterval(function () {
        fnMove(obj, oTarget, fnCallBack, fnDuring);
    }, 30);
}
function doMoveBuffer(obj, oTarget, fnCallBack, fnDuring) {
    var bStop = true;
    var attr = '';
    var speed = 0;
    var cur = 0;
    for (attr in oTarget) {
        cur = css(obj, attr);
        if (oTarget[attr] != cur) {
            bStop = false;
            speed = (oTarget[attr] - cur) / 5;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            css(obj, attr, cur + speed);
        }
    }
    if (fnDuring)fnDuring.call(obj);
    if (bStop) {
        clearInterval(obj.timer);
        obj.timer = null;
        if (fnCallBack)fnCallBack.call(obj);
    }
}
function doMoveFlex(obj, oTarget, fnCallBack, fnDuring) {
    var bStop = true;
    var attr = '';
    var speed = 0;
    var cur = 0;
    for (attr in oTarget) {
        if (!obj.oSpeed)obj.oSpeed = {};
        if (!obj.oSpeed[attr])obj.oSpeed[attr] = 0;
        cur = css(obj, attr);
        if (Math.abs(oTarget[attr] - cur) >= 1 || Math.abs(obj.oSpeed[attr]) >= 1) {
            bStop = false;
            obj.oSpeed[attr] += (oTarget[attr] - cur) / 5;
            obj.oSpeed[attr] *= 0.7;
            css(obj, attr, cur + obj.oSpeed[attr]);
        }
    }
    if (fnDuring)fnDuring.call(obj);
    if (bStop) {
        clearInterval(obj.timer);
        obj.timer = null;
        if (fnCallBack)fnCallBack.call(obj);
    }
}