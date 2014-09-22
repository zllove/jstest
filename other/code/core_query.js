//从CORE库提取的选择器,
(function( window, undefined ){
	var
	//当前函数里所有用到的全局对象都会打断在这里
	Function = window.Function,
	RegExp = window.RegExp,
	document = window.document,
	slice = Array.prototype.slice,
	trim = String.prototype.trim || trims;

//去除字符串首尾处的空白字符（或者其他字符）
function trims( a ) {
	for ( var s = 0, d = a || ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000', f = this.length; s < f; s++ ) {
		if ( d.indexOf( this.charAt( s ) ) === -1 ) {
			while ( f-- ) {
				if ( d.indexOf( this.charAt( f ) ) === -1 ) {
					return this.substring( s, f + 1 );
				};
			};
		};
	};
	return '';
};

function $( a, s ) {
	return $.query( a, s );
};

$.query = function(){
	var
	root = document,
	test = root.createElement( 'div' ),
	reid = 0,
	rule = /(,)?([^,]+)/g,
	ready = true,//开启能力测试
	regexp = RegExp,
	func = Function,
	mark = /(\.|#)(\w+)/g;

	//转化数组函数
	function array() {
		for ( var a = 0, s = [], d = this.length; a < d; a++ ) {
			s[ a ] = d[ a ];
		};
		return s;
	};

	function selector( a, s ) {
		if ( s.nodeType === 9 ) {
			return s.querySelectorAll( a );
		};
		arguments = s.id,
		s.id = 'reid' + ( reid++ ),
		a = s.querySelectorAll( a.replace( rule, '$1#' + s.id + ' $2' ) ),
		s.id = arguments;
		return a;
	};

	//判断是否使用原生选择器
	if ( false && test.querySelectorAll ) {
		if ( ready ) {
			//写入测试数据
			test.innerHTML = '<a/>';
			//我们期望的是当给出节点，选择器要从子节点开始匹配
			if ( test.querySelectorAll( 'div a' ).length === 0 ) {
				selector = function( a, s ) {
					return s.querySelectorAll( a );
				};
			};
			//判断是否返回数组
			test = test.querySelectorAll( '*' );
			if ( Object.prototype.toString.call( test ) === '[object Array]' ) {
				return function( a, s ) {
					return selector( a, s || root );
				};
			};
			try {
				slice.call( test ), array = slice;
			} catch ( _ ) {
			};
		};
		return function( a, s ) {
			return array.call( selector( a, s || root ) );
		};
	};

	test = {
		tag : /^\w+/,
		param : /^\[(\w+)(\$\=|\*\=|\=|\^\=|\~\=)?(\'|\")?(\w+)?\3\]/,
		context : /^\s*(\s|\,|\+|\>|\~)\s*/,
		func : function( a ) {
			return func( '$', 'return $' + a );
		},
		has : function( a, s ) {
			if ( a.hasAttribute ) {
				
				return a.hasAttribute( s );
			};
			
			arguments = a.getAttributeNode && a.getAttributeNode( s );
			return arguments ? arguments.specified : a.getAttribute( s ) !== null;
		}
	};

	function param( a, s, d ) {
		return '[' + ( s === '.' ? 'class=' : 'id=' ) + d + ']';
	};

	function query( a, s, d, f ) {
		var g = test.tag.test( d ), h = '', j = 0, k, l;
		if ( g ) {
			d = regexp.rightContext, k = regexp.lastMatch.toUpperCase();
		};
		while ( test.param.test( d ) ) {
			d = regexp.rightContext;
			switch ( regexp.$2 ) {
				case '$=' :
					h += '&&$.getAttribute("' + regexp.$1 + '").slice(-"' + regexp.$4 + '".length)=="' + regexp.$4 + '"';
					continue;
				case '*=' :
					h += '&&$.getAttribute("' + regexp.$1 + '").indexOf("' + regexp.$4 + '")!==-1';
					continue;
				case '=' :
					h += '&&$.getAttribute("' + regexp.$1 + '")=="' + regexp.$4 + '"';
					continue;
				case '^=' :
					h += '&&$.getAttribute("' + regexp.$1 + '").substring(0,"' + regexp.$4 + '".length)=="' + regexp.$4 + '"';
					continue;
				case '~=' :
					h += '&&(" "+$.getAttribute("' + regexp.$1 + '")+" ").indexOf(" ' + regexp.$4 + ' ")!==-1';
					continue;
				default :
					h += '&&this($,"' + regexp.$1 + '")';
			};
		};
		if ( g = test.context.test( d ) ) {
			d = regexp.rightContext, l = regexp.$1;
		} else {
			l = f;
		};
		switch ( f ) {
			case ' ' :
				for ( h = test.func( h ), k = s.getElementsByTagName( k || '*' ); j < k.length; j++ ) {
					if ( h.call( test.has, k[ j ] ) ) {
						g ? query( a, k[ j ], d, l ) : a.push( k[ j ] );
					};
				};
				break;
			case '+' :
				h = test.func( '.' + ( k ? 'tagName=="' + k + '"' : 'nodeType==1' ) + h ), k = s.nextSibling;
				if ( h.call( test.has, k ) ) {
					g ? query( a, k, d, l ) : a.push( k );
				};
				break;
			case ',' :
				for ( h = test.func( h ), k = s.getElementsByTagName( k || '*' ); j < k.length; j++ ) {
					if ( h.call( test.has, k[ j ] ) ) {
						a.push( k[ j ] ), g && query( a, s, d, l );
					};
				};
				break;
			case '>' :
				for ( h = test.func( '.' + ( k ? 'tagName=="' + k + '"' : 'nodeType==1' ) + h ), k = s.childNodes; j < k.length; j++ ) {
					if ( h.call( test.has, k[ j ] ) ) {
						g ? query( a, k[ j ], d, l ) : a.push( k[ j ] );
					};
				};
				break;
			case '~' :
					for ( h = test.func( '.' + ( k ? 'tagName=="' + k + '"' : 'nodeType==1' ) + h ), k = s.nextSibling; k; k = k.nextSibling ) {
						if ( k.parentNode === s.parentNode && h.call( test.has, k ) ) {
							g ? query( a, k, d, l ) : a.push( k );
						};
					};
				break;
			default :
				for ( h = test.func( h ), k = s.getElementsByTagName( k || '*' ); j < k.length; j++ ) {
					if ( h.call( test.has, k[ j ] ) ) {
						g ? query( a, k[ j ], d, l ) : a.push( k[ j ] );
					};
				};
		};
		return a;
	};

	return function( a, s ) {
		return query( [], s || root, trim.call( a ).replace( mark, param ) );
	};
}();

window.CQ = $;
}(this));