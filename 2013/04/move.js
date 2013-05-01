function getStyle(obj, attr){
    if (obj.currentStyle) { // ie
    	return obj.currentStyle[attr];
    } else { // firefox,chrome
    	return getComputedStyle(obj, false)[attr];
    }
}

/**
 * start fn
 * @param  {Object} obj     element
 * @param  {string} attr    'width,height'
 * @param  {String} iTarget end value
 * @return {Undefined}         null
 */
function startMove(obj, attr, iTarget, fn){
	clearInterval(obj.timer);

	obj.timer = setInterval(function(){
		var iCur = 0;

		if (attr == 'opacity') {
			iCur = parseInt(parseFloat(getStyle(obj, attr)) * 100);
		} else {
			iCur = parseInt(getStyle(obj, attr));
		}
		var iSpeed = (iTarget - iCur) / 8;
		iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

		if (iCur == iTarget) {
			clearInterval(obj.timer);
			fn && fn();
		} else {
			if (attr == 'opacity') {
				obj.style.filter = 'alpha(opacity:' + (iCur + iSpeed) + ')';
				obj.style.opacity = (iCur + iSpeed) / 100;
			} else {
				obj.style[attr] = iCur + iSpeed + 'px';
			}
		}
	}, 30);
}