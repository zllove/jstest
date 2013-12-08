(function(window, document, xiaomo) {
	var xiaomo = window.xiaomo || {};
	xiaomo.$ = function(obj) {
		return document.getElementById(obj)
	};
	xiaomo.tagName = function(obj, parent) {
		return parent.getElementsByTagName(obj)
	};
	Number.prototype.getRondom = function(x) {
		return Math.abs(Math.ceil(Math.random() * this) - x)
	}
	xiaomo.getByClass = function(className, context) {
		context = context || document;
		if (context.getElementsByClassName) {
			return context.getElementsByClassName(className);
		}
		var nodes = context.getElementsByTagName('*'),
			ret = [];
		for (var i = 0; i < nodes.length; i++) {
			if (xiaomo.hasClass(nodes[i], className)) ret.push(nodes[i]);
		}
		return ret;
	}
	xiaomo.hasClass = function(node, className) {
		var names = node.className.split(/\s+/);
		for (var i = 0; i < names.length; i++) {
			if (names[i] == className) return true;
		}
		return false;
	}
	xiaomo.addEvent = function(obj, type, fn) {
		if (obj.addEventListener) {
			obj.addEventListener(type, function() {
				fn.call(obj)
			}, false) //for ff
		} else {
			obj.attachEvent("on" + type, function() {
				fn.call(obj)
			}) //for ie
		}
	}
	xiaomo.css = function css(obj, attr, value) {
		if (arguments.length == 2) {
			if (attr != 'opacity') {
				return parseInt(obj.currentStyle ? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj, false)[attr]);
			} else {
				return Math.round(100 * parseFloat(obj.currentStyle ? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj, false)[attr]));
			}
		} else if (arguments.length == 3) switch (attr) {
		case 'width':
		case 'height':
		case 'paddingLeft':
		case 'paddingTop':
		case 'paddingRight':
		case 'paddingBottom':
			value = Math.max(value, 0);
		case 'left':
		case 'top':
		case 'right':
		case 'bottom':
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
		return function(attr_in, value_in) {
			css(obj, attr_in, value_in)
		};
	}
	xiaomo.startMove = function(obj, oTarget, iType, fnCallBack, fnDuring) {
		var bStop = true;
		var attr = '';
		var speed = 0;
		var cur = 0;
		if (obj.timer) {
			clearInterval(obj.timer);
		}
		obj.timer = setInterval(function() {
			xiaomo.startMove(obj, oTarget, iType, fnCallBack, fnDuring);
		}, 30);
		for (attr in oTarget) {
			if (iType == 'buffer') {
				cur = xiaomo.css(obj, attr);
				if (oTarget[attr] != cur) {
					bStop = false;
					speed = (oTarget[attr] - cur) / 5;
					speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
					xiaomo.css(obj, attr, cur + speed);
				}
			} else if (iType == 'flex') {
				if (!obj.oSpeed) obj.oSpeed = {};
				if (!obj.oSpeed[attr]) obj.oSpeed[attr] = 0;
				cur = xiaomo.css(obj, attr);
				if (Math.abs(oTarget[attr] - cur) >= 1 || Math.abs(obj.oSpeed[attr]) >= 1) {
					bStop = false;
					obj.oSpeed[attr] += (oTarget[attr] - cur) / 5;
					obj.oSpeed[attr] *= 0.7;
					xiaomo.css(obj, attr, cur + obj.oSpeed[attr]);
				}
			}
		}
		if (fnDuring) fnDuring.call(obj);
		if (bStop) {
			clearInterval(obj.timer);
			obj.timer = null;
			if (fnCallBack) fnCallBack.call(obj);
		}
	}
	xiaomo.getOffset = function(o) {
		var x = y = 0,
			de = document.documentElement;
		if (o == de) {
			return {
				x: de.scrollLeft,
				y: de.scrollTop
			};
		}
		while (o) {
			x += o.offsetLeft;
			y += o.offsetTop;
			o = o.offsetParent;
			if (o && o != de) {
				x += o.clientLeft;
				y += o.clientTop;
			}
		}
		return {
			left: x,
			top: y
		};
	}
	xiaomo.judgeBrowser = function() {
		var nav = window.navigator.userAgent
		if (nav.indexOf("MSIE 6.0") != -1) {} else if (nav.indexOf("MSIE 7.0") != -1) {} else if (nav.indexOf("MSIE 8.0") != -1) {
			autoRun()
		} else if (nav.indexOf("MSIE 9.0") != -1) {
			autoRun()
		} else if (nav.indexOf("Firefox") != -1) {
			autoRun()
		} else if (nav.indexOf("Chrome") != -1) {
			autoRun()
		} else if (nav.indexOf("Safari") != -1) {
			autoRun()
		}
	}
	xiaomo.Ajax = function(url, fnSucc, fnFaild) {
		var oAjax = null;
		if (window.XMLHttpRequest) {
			oAjax = new XMLHttpRequest();
		} else {
			oAjax = new ActiveXObject("Microsoft.XMLHTTP");
		}
		oAjax.open('GET', url, true);
		oAjax.send();
		oAjax.onreadystatechange = function() {
			if (oAjax.readyState == 4)
			{
				if (oAjax.status == 200)
				{
					fnSucc(oAjax.responseText);
				} else {
					if (fnFaild) fnFaild(oAjax.status);
				}
			}
		};
	}
	window.xiaomo = xiaomo
})(window, document, 'xiaomo')