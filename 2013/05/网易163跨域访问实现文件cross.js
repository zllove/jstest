/**
 * ==========================================================================================
 * 跨窗体消息交互实现文件<br/>
 * 代码书写规范简述：<br/>
 * <pre>
 *    变量/接口前缀        描述                                           发布时是否混淆
 * ------------------------------------------------------------------------------------------
 *    _                  接口内局部变量或者传递的参数                            Y
 *    _$                 对象外可访问的接口或者属性                             Y/N
 *                       此类接口不允许以字符串形式出现
 *                       如果项目所有js文件一起混淆可以考虑混淆
 *    _$$                类对象，同_$前缀的处理                                Y/N
 *    __                 对象外不可访问的接口或者属性                            Y
 *    无                 没有前缀的接口或者属性可以在对象外访问                     N
 *                       代码中可以以字符串的形式出现
 *    X                  单个大写字母命名表示集合了一些通用的属性和接口的对象
 *                       代码中禁止出现单个大写字母命名的变量                      N
 * ------------------------------------------------------------------------------------------
 * </pre>
 * @version  1.0
 * @author   genify(caijf@163.org)
 * ==========================================================================================
 */
(function(){
// private
var __postMessage,
    __addMsgListener,
	__reghost = /^([\w]+:\/\/.*?)(?=\/|$)/,          // http://aaa.bb.com:8080
	__regdomain = /^(?:[\w]+\:\/\/)?(.*?)(?:\/|$)/i; // aaa.bb.com:8080
/**
 * 返回指定的命名空间，如果不存在则新建一个命名空间<br/>
 * <pre>
 *   P("ui.package");
 *   P("window.ui.package");
 *   // 以上两者都将建立 window.ui, 然后返回 window.ui.package
 * </pre>
 * 注意：命名空间不要使用浏览器保留的关键字
 * @param  {String} _namespace 命名空间的名称
 * @return {Object}            生成的命名空间对象    
 */
window.P = function(_namespace){
    if (!_namespace||!_namespace.length) return null;
    var _package = window;
    for(var a=_namespace.split('.'),
            l=a.length,i=(a[0]=='window')?1:0;i<l;
            _package=_package[a[i]]=_package[a[i]]||{},i++);
    return  _package;
};
// private
var __userAgent = window.navigator.userAgent;
// interface
P('B');
B._$ISIE = /msie\s+(.*?)\;/i.test(__userAgent); // Trident
B._$ISFF = !B._$ISIE&&/rv\:(.*?)\)\s+gecko\//i.test(__userAgent); // Gecko
B._$ISOP = !B._$ISIE&&!B._$ISFF&&/opera\/(.*?)\s/i.test(__userAgent); // Presto
B._$ISSF = !B._$ISIE&&!B._$ISFF&&!B._$ISOP&&/applewebkit\/(.*?)\s/i.test(__userAgent); // WebKit
B._$ISKQ = !B._$ISIE&&!B._$ISFF&&!B._$ISOP&&!B._$ISSF&&/konqueror\/(.*?)\;/i.test(__userAgent); // KHtml
B._$VERSION = RegExp.$1;
B._$ISOLDIE = B._$ISIE&&B._$VERSION<'7.0'; // don't use <='6.0' for 6.0b and so on
// init
if (B._$ISIE) try{document.execCommand('BackgroundImageCache',false,true);}catch(e){}

// private
var __trim  = /(?:^\s+)|(?:\s+$)/g, // space at start or end of string
    __empty = /^\s*$/,              // content is empty
    __remap = {a:{r:/\<|\>|\&|\n|\s|\'|\"/g,'<':'&lt;','>':'&gt;','&':'&amp;',' ':'&nbsp;','"':'&quot;',"'":'&#39;','\n':'<br/>'}
              ,b:{r:/\&(?:lt|gt|amp|nbsp|#39|quot)\;/gi,'&lt;':'<','&gt;':'>','&amp;':'&','&nbsp;':' ','&#39;':"'",'&quot;':'"'}
              ,c:{i:true,r:/\byyyy|yy|MM|M|dd|d|HH|H|mm|ms|ss|m|s\b/g}
              ,d:{r:/\'|\"/g,"'":"\\'",'"':'\\"'}}; // encode map
// interface
P('U');
/**
 * 清除字符串两端的空格，原字符串内容不变
 * @param  {String} _content 待清除的字符串
 * @return {String}         清除两端空格的字符串
 */
U._$trim = function(_content){
    return !!_content&&!!_content.replace
           &&_content.replace(__trim,'')||'';
};
/**
 * 编码字符串
 * @param  {Object} _map     编码规则
 * @param  {String} _content 待编码的字串
 * @return {String}          编码后的字串
 */
U._$encode = function(_map,_content){
    if (!_map||!_content||!_content.replace) return _content||'';
    return _content.replace(_map.r,function($1){return _map[!_map.i?$1.toLowerCase():$1]||$1;});
};
/**
 * 编码html代码，'<' -> '&lt;'
 * @param  {String} _content 待编码串
 * @return {String}          编码后的串
 */
U._$escape = function(_content){
    return U._$encode(__remap.a,_content);
};
/**
 * 反编码html代码，'&lt;' -> '<'
 * @param  {String} _content 待编码串
 * @return {String}          编码后的串
 */
U._$unescape = function(_content){
    return U._$encode(__remap.b,_content);
};
/**
 * 判断数据是否为指定类型
 * @param  {Variable} _data 待判断数据
 * @param  {String}   _type 数据类型
 * @return {Boolean}        是否指定类型
 */
U._$isType = function(_data,_type){
    return Object.prototype.toString.
           call(_data).toLowerCase()==
           ('[object '+_type.toLowerCase()+']');
};
/**
 * 编码字符串，将',"加转义符号
 * @param  {String} _content 待编码串
 * @return {String}          编码后的串
 */
U._$string = function(_content){
    return U._$encode(__remap.d,_content);
};
/**
 * 序列化
 * @param  {Variable} _data 待序列化数据
 * @return {Variable}       序列化后数据
 */
U._$serialize = function(_data){
    if (U._$isType(_data,'number'))  return _data;
    if (U._$isType(_data,'date'))    return _data.getTime();
    if (U._$isType(_data,'boolean')) return !!_data?'true':'false';
    if (U._$isType(_data,'string'))  return "'"+U._$string(_data)+"'";
    if (!_data) return 'null';
    if (U._$isType(_data,'array')){
        var _arr = [];
        for(var i=0,l=_data.length;i<l;
            _arr.push(U._$serialize(_data[i])),i++);
        return '['+_arr.join(',')+']';
    }
    if (U._$isType(_data,'object')){
        var _arr = [];
        for(var p in _data)
            _arr.push(U._$serialize(p)+':'+
                      U._$serialize(_data[p]));
        return '{'+_arr.join(',')+'}';
    }
    return 'null';
};
/**
 * 反序列化串
 * @param  {String}  _content 待反序列化串
 * @return {Variable}         反序列化后的数据
 */
U._$deserialize = function(_content){
    try{return !_content?null:eval('('+_content+')');}catch(e){return null;}
};
// interface
P('E');
/**
 * 根据ID或者节点对象获取节点对象，确保返回的是个节点对象
 * @param  {String|Node} 节点ID或者节点对象
 * @return {Node}        节点对象
 */
E._$getElement = function(_element){
    if (arguments.length<=1)
        return U._$isType(_element,'string')||
               U._$isType(_element,'number')?
               document.getElementById(_element):_element;
    var _result = [];
    for(var i=0,l=arguments.length;i<l;
        _result.push(E._$getElement(arguments[i])),i++);
    return _result;
};
// interface
P('V');
var __events = {};
/*
 * 缓存对象监听的事件，忽略对window和document对象上的事件缓存
 * @param  {HTMLElement} _element  事件源对象
 * @param  {String}      _type     事件类型
 * @param  {Function}    _handler  事件处理过程
 * @return {Void}
 */
var __cacheEvent = function(_element,_type,_handler){
    if (_element==window||_element==document||
        _element==top||_element==parent) return;
    var _sn = _element[__akey];
    _sn ? __cacheEventWithCached(_sn,_type,_handler)
        : __cacheEventWithoutCached(_element,_type,_handler);
};
/*
 * 判断onload是否用onreadystatechange
 * @param  {Node}   _element 节点对象
 * @param  {String} _type    事件类型
 * @return {Void}
 */
var __isOnReadyStateChange = function(_element,_type){
    if (!B._$ISIE||_element==window||
        _element==document||_type!='load')
        return false;
    var _tag = _element.tagName.toLowerCase();
    return _tag=='iframe'||_tag=='script';
};
// 添加、删除事件接口
var __addEvent,__delEvent;
if (!!document.addEventListener) {
__addEvent = function(_element,_type,_handler,_capture){
    _element.addEventListener(_type,_handler,!!_capture);
};
__delEvent = function(_element,_type,_handler,_capture){
    _element.removeEventListener(_type,_handler,!!_capture);
};
}else{
__addEvent = function(_element,_type,_handler){
    _element.attachEvent('on'+_type,_handler);
};
__delEvent = function(_element,_type,_handler){
    _element.detachEvent('on'+_type,_handler);
};}
/**
 * 给节点添加监听事件，忽略处理给定的对象不存在或者事件类型或者事件处理过程没有指定的情况。
 * @param  {String|Node} _element 要添加事件的节点ID或者节点对象
 * @param  {String}      _type    事件类型
 * @param  {Function}    _handler 事件处理过程
 * @param  {Boolean}     _capture 是否捕获阶段
 * @return {Void}
 */
V._$addEvent = function(_element,_type,_handler,_capture){
    _element = E._$getElement(_element);
    if (!_element||!_type||!_handler) return;
    if (__isOnReadyStateChange(_element,_type)){
        _type = 'readystatechange';
        _handler = __onReadyStateChange._$bind(null,_handler);
    }
    if (B._$ISIE&&_type=='input') _type = 'propertychange';
    __addEvent(_element,_type,_handler,_capture);
    __cacheEvent(_element,_type,_handler);
};
P('J');
/*
 * 解析域名
 * @param  {String} _domain 待解析域名
 * @return {String}         解析后域名
 */
var __parseDomain = function(_domain){
	return __regdomain.test(_domain)?RegExp.$1:'';
};
/*
 * 解析目标窗体对象和域信息
 * @param  {String|Window} _window  目标窗体名称,ID或者对象
 * @param  {String}        _origin  目标窗体域，如http://www.genify.com
 *                                  如果第一个参数传入IFrame的ID此参数可不传
 * @return {Array}                  解析后的窗体对象和域信息
 */
var __parseWindowAndOrigin = function(_window,_origin){
    var _iframe;
	if (_window=='top'){
		return [top,document.referrer];
	}
    if (U._$isType(_window,'string')){
        _iframe = document.getElementById(_window);
        _window = !_iframe?window.frames[_window]:_iframe.contentWindow;
    }
    if (!_window) return null;
    if (!_origin&&!!_iframe&&__reghost.test(_iframe.src))
        _origin = RegExp.$1||'';
    if (!_origin&&__reghost.test(location.href))
        _origin = RegExp.$1||'';
    if (!_origin) return null;
	return [_window,_origin];
};
// postmessage and message listener
if (!!window.postMessage){
	__postMessage = function(_window,_message,_origin){
		// [window,origin]
		var _info = __parseWindowAndOrigin(_window,_origin);
		if (!!_info) _info[0].postMessage(_message,_info[1]);
	};
	__addMsgListener = function(_callback){
		V._$addEvent(window,'message',_callback);
	};
}else{
    var __cache   = {},
        __events  = [];
    __postMessage = function(_window,_message,_origin){
		// [window,origin]
        var _info = __parseWindowAndOrigin(_window,_origin);
		if (!_info) return;
		var _domain = __parseDomain(_info[1]);
		var _cache = __cache[_domain];
		if (!_cache) _cache = J._$registXMessage(_domain);
		var _data = {cb:_cache.cbs,msg:''+_message,tgt:_window,src:window!=top?window.name:'top'};
		_cache.div.innerHTML = '<iframe name="'+U._$serialize(_data)+'" src="'+_cache.url+'"></iframe>';
    };
    __addMsgListener = function(_callback){
		if (!_callback) return;
		__events.push(_callback);
    };
	/**
	 * 代理页面回调接口
	 * @param  {Object} _event 事件对象，属性对象同postMessage接口事件对象
	 *                         data   [Variable] - 消息内容
	 *                         origin [String]   - 信息源
	 *                         source [Window]   - 代理窗体对象
	 * @return {Void}
	 */
	J.g = function(_event){
		for(var i=0,l=__events.length;i<l;__events[i](_event),i++);
	};
}
// interface
/**
 * 发送消息
 * @param  {String|Window} _window  目标窗体名称,ID或者对象,对于不支持postMessage的浏览器这里仅允许传ID
 * @param  {String}        _message 消息内容
 * @param  {String}        _origin  目标窗体域，如http://www.genify.com
 *                                  如果第一个参数传入IFrame的ID此参数可不传
 * @return {Void}
 */
J._$postMessage = __postMessage;
/**
 * 添加消息监听回调
 * @param  {Function} _callback 回调接口
 * @return {Void}
 */
J._$addMsgListener = __addMsgListener;
/**
 * 注册跨域数据交互的域信息和对方消息接收接口信息
 * @param  {String} _domain   域信息，或者代理文件地址，默认取根路径下的代理文件
 * @param  {String} _listener 消息接收接口信息
 * @return {Void}
 */
J._$registXMessage = function(_domain,_listener){
	if (!!window.postMessage) return;
	var _dmn = __parseDomain(_domain);
	if (!!__cache[_dmn]) return;
	var _ntmp = document.createElement('div');
	_ntmp.style.display = 'none';
	document.body.appendChild(_ntmp);
	__cache[_dmn] = {div:_ntmp,cbs:_listener||'J.g',
		             url:_domain.toLowerCase().indexOf('http://')>=0
					    ?_domain:'http://'+_domain+'/proxy.html'};
	return __cache[_dmn];
};
})();


(function(){

	/**
	 * 封装跨域调用到mailapi
	 * 首先调用WebmailHelper.init传被跨域调用的host和cross为true
	 * 然后调用跨域方法:WebmailHelper.cross("跨域调用的window.name(或者parent,top等)", "跨域调用的函数", "参数");
	 * webmail的outlink的跨域调用极速4.0的demo: 在webmail地址栏替换#module=的后面为:
	 * outlink.OutlinkModule_0%7C%7B%22url%22%3A%22http%3A//mimg.126.net/mailapi/demo/inner_frame.htm%23%24host%24%22%2C%22key%22%3A%22testCross%22%2C%22title%22%3A%22111%22%2C%22cross%22%3Atrue%7D
	 * @class Cross
	 * @constructor
	 * @return {void} 
	 */
	var Cross = Object.createClass("netease.mail.api.Cross");
	Object.extend(Cross, {
		toJsonString : fNeteaseMailApiToJsonString,
		registXMessage : fNeteaseMailApiRegistXMessage,
		addMsgListener : fNeteaseMailApiAddMsgListener,
		postMessage : fNeteaseMailApiPostMessage,
		callFunc : fNeteaseMailApiCallFunc,
		regAndListen : fNeteaseMailApiRegAndListen,
		initCross : fNeteaseMailApiCrossInit,
		call : {}
	});
	var sOriginHost = "";
	function fNeteaseMailApiCrossInit(oParam) {
		oParam = oParam ||{};
		// 初始化跨域调用
		var sWmsvrHost = netease.mail.api.Core.$.Cookie.get("mail_host") || oParam.host;
		sOriginHost = "http://" + sWmsvrHost;
		if(!oParam.proxy){
			if(sWmsvrHost){
				oParam.proxy = "http://"+ sWmsvrHost +"/app/h/proxy.htm";
			}
		}
		function _() {
			if(oParam.proxy){
				Cross.regAndListen(oParam.proxy, oParam.win || "parent");
			}
		}
		if(document.body){
			_();
		}else{
			if (window.addEventListener) {
				window.addEventListener("load", _);
			}else if(window.attachEvent){
				window.attachEvent("onload", _);
			}
		}
	}
	function fNeteaseMailApiRegAndListen(b, a) {
		Cross.registXMessage(b);
		Cross.addMsgListener(a)
	}
	/**
	 * 解析对象转换成json字符串
	 * @param {obj}oObj 要转换的对象
	 * @param {string}sType object表示是对象，array表示是数组
	 *
	 * @return {string}转换后的字符串
	 */
	function fNeteaseMailApiToJsonString(o,sType){
		var oChar = {'\b': '\\b','\t': '\\t','\n': '\\n','\f': '\\f','\r': '\\r','"' : '\\'+'"','\\': '\\'+'\\'},
		oStr = {
			'array': _a,
			'boolean': _b,
			'null': _n,
			'number': _num,
			'object': _o,
			'string': _s
		};
		function _a(a) {
			var aStr = ['['], bFlag, func, i, l = a.length, o;
			for (i = 0; i < l; i += 1) {
				o = a[i];
				func = oStr[typeof o];
				if (func) {
					o = func(o);
					if (typeof o == 'string') {
						if (bFlag) {
							aStr[aStr.length] = ',';
						}
						aStr[aStr.length] = o;
						bFlag = true;
					}
				}
			}
			aStr[aStr.length] = ']';
			return aStr.join('');
		}
		function _b(s) {
			return String(s);
		}
		function _n(s) {
			return "null";
		}
		function _num(s) {
			return isFinite(s) ? String(s) : 'null';
		}
		function _o(o) {
			if (o) {
				if (o instanceof Array) {
					return oStr.array(o);
				}
				var aStr = ['{'], bFlag, func, i, o;
				for (i in o) {
					oTmp = o[i];
					func = oStr[typeof oTmp];
					if (func) {
						oTmp = func(oTmp);
						if (typeof oTmp == 'string') {
							if (bFlag) {
								aStr[aStr.length] = ',';
							}
							aStr.push(oStr.string(i), ':', oTmp);
							bFlag = true;
						}
					}
				}
				aStr[aStr.length] = '}';
				return aStr.join('');
			}
			return 'null';
		}
		function _s(s){
			if (/["\\\x00-\x1f]/.test(s)) {
				s = s.replace(/([\x00-\x1f\\"])/g, function(sKey, sTmp) {
					var sChar = oChar[sTmp];
					if (sChar) {
						return sChar;
					}
					sChar = sTmp.charCodeAt();
					return '\\u00' + Math.floor(sChar / 16).toString(16) + (sChar % 16).toString(16);
				});
			}
			return '"' + s + '"';
		}
		if(typeof o == "object"){
			if(o){
				if(o.constructor == Array){
					return oStr.array(o);
				}else if(o.constructor == Date){
					return "new Date("+ o.valueOf() +")";
				}else{
					return oStr.object(o);
				}
			}else{
				return oStr.object(o);
			}
		}else{
			return "";
		}
	}

	/**
	 * 跨域调用注册
	 * @param {string}sUrl 注册域的通信url
	 *
	 * @return {void}
	 */
	function fNeteaseMailApiRegistXMessage(sUrl) {
		J._$registXMessage(sUrl);
	}

	/**
	 * 跨域监听调用
	 *
	 * @return {void}
	 */
	function fNeteaseMailApiAddMsgListener(sWin) {
		var that = this;
		J._$addMsgListener(function(o){
			eval('var oData = ' + o.data);

			if(oData.xcall){
				for (var o in oData){
					if(oData[o] && oData[o].isCallback){
						
						Cross.call[o] = function (_o) {
							return function (oParam) {
								oParam = {value : oParam};
								oParam.xcall = _o.name;
								that.postMessage(sWin, oParam);
							}
						}(oData[o])
					}
					if(oData[o] && oData[o].isFunction){
						eval('oData[o] = ' + oData[o].func);
					}
				}
				if(oData._callback){
					eval("var oResult = " + oData.xcall + "(oData)");
					var oResultData = {xcall : oData._callback.name, data : oResult};
					that.postMessage(sWin, oResultData);
				}else{
					eval(oData.xcall + "(oData)");
				}
			}
		});
	}

	/**
	 * 跨域通信
	 *
	 * @return {void}
	 */
	function fNeteaseMailApiPostMessage(sWin, oData) {
		var sJson = this.toJsonString(oData).replace(/\"/gi, "'");
		J._$postMessage(sWin, sJson, sOriginHost);
	}

	/**
	 * 跨域调用函数
	 *
	 * @return {void}
	 */
	function fNeteaseMailApiCallFunc(sWin, sFunc, oData) {
		oData.xcall = sFunc;
		this.postMessage(sWin, oData);
	}
})();