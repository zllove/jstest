/**
 * @description: Jikey index JavaScript Util
 * @see: <a href="mailto:yonghong.zhang@shnewtouch.cn">jikey</a>
 * @since:version 0.1
 */

var J = {
	$: function(){ return document.getElementById(arguments[0]); },
	
	/**
	 * 为兼容ie6获取失去焦点控制样式
	 * @param {Object} id
	 * @param {Object} newClassName 
	 * @param {Object} oldClassName
	 */
	ie6Focus: function(id, newClassName, oldClassName){
		var obj = this.$(id);
		if(!obj) return false;
		
		if(obj.type == 'text' || obj.type == 'password'){
			this.addFocus(obj, newClassName, oldClassName);
		} else {
			this.addMouse(obj, newClassName, oldClassName);
		}

	},
	
	/**
	 * 添加焦点事件
	 * @param {Object} obj
	 * @param {Object} newClassName
	 * @param {Object} oldClassName
	 */
	addFocus: function(obj, newClassName, oldClassName){

		this.addEvent(obj, 'focus', function(){
			
			obj.className = newClassName;
			if(obj.defaultValue.length > 0){
				if(obj.value == obj.defaultValue){
					obj.value = '';
				} else {
					return false;
				}
			}
		});
		
		this.addEvent(obj, 'blur', function(){
			
			if(obj.value.length < 1){ //没有值
				if(obj.defaultValue.length < 1){ //没有默认值
					this.className = newClassName;
				} else { 
					obj.value = obj.defaultValue;
					this.className = oldClassName;
				}
			} else {
				this.className = newClassName;
			}
		});
		
	},
	
	/**
	 * 添加鼠标事件
	 * @param {Object} obj
	 * @param {Object} newClassName
	 * @param {Object} oldClassName
	 */
	addMouse: function(obj, newClassName, oldClassName){
		this.addEvent(obj, 'mouseover', function(){
			obj.className = newClassName;	
		});
		
		this.addEvent(obj, 'mouseout', function(){
			obj.className = newClassName;	
		});
	},
	
	/**
	 * 添加事件
	 * @param {Object} obj
	 * @param {Object} type 事件类型
	 * @param {Object} fun 事件处理函数
	 */
	addEvent: function(obj, type, fun){
		if(obj.addEventListener){
			obj.addEventListener(type, fun, false);
		} else if(obj.attachEvent){
			obj.attachEvent('on' + type, function() {
	            fun.call(obj, window.event);
	        });
		} else {
			obj['on' + type] = function() {
	            fun.call(obj, window.event);
	        }
		}
	},
	
	/**
	 * 移除事件
	 * @param {Object} obj
	 * @param {Object} type 事件类型
	 * @param {Object} fun 事件处理函数
	 */
	removeEvent: function(obj, type, fun){
		if(obj.removeEventListener){
			obj.removeEventListener(type, fun, false);
		} else if(obj.detachEvent){
			obj.detachEvent('on' + type, fun);
		} else {
			obj['on' + type] = null;
		}
	},
	
	getEvent: function(event){
		return event ? event : window.event;
	},
	
	getTarget: function(event){
		return event.target || event.srcElement;
	},
	
	//取消事件的默认行为
	preventDefault: function(event){
		if(event.preventDefault){
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	},
	
	//阻止事件流
	stopPropagation: function(event){
		if(event.stopPropagation){
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
	},
	
	//得到上一个元素
	getPrev: function(ele){
		var r = ele.previousSibling;
		while(r.nodeType != 1){
			r = r.previousSibling;
		}
		return r;
	},
	
	//得到下一个元素
	getNext: function(ele){
		var r = ele.nextSibling;
		while(r.nodeType != 1){
			r = r.nextSibling;
		}
		return r;
	},
	
	/**
	 * 得到视口的大小
	 */
	getWindowsSize: function(){
		var de = document.documentElement,
			pageWidth = window.innerWidth,
			pageHeight = window.innerHeight;
		if(typeof pageWidth != 'number'){ //如果pageWidth不是数字,则ie,非ie支持innerWidth
			if(document.compatMode == 'CSS1Compat'){ //Standars mode 标准模式，完整dtd
				pageWidth = de.clientWidth;
				pageHeight = de.clientHeight;
			} else { //如果是 Quirks mode
				pageWidth = document.body.clientWidth;
				pageHeight = document.body.clientHeight;
			}
		}
		return {
			width: pageWidth,
			height: pageHeight
		}
	},
	
	/**
	 * 创建标签
	 * @param {String} target 标签名称，为空则创建一个空的div
	 * @param {Object} config 属性列表
	 */
	createElement: function(target, config){
		target = target || 'div';
		config = config || {};
		
		var tag = document.createElement(target);
		for(var p in config){
			if(p.toLowerCase() == 'style'){
				tag.style.cssText = config[p];
			} else if(p.toLowerCase() == 'class' || p.toLowerCase() == 'cls'){
				tag.className = config[p];
			} else if(p.toLowerCase() == 'innerHTML'){
				tag.innerHTML = config[p];
			} else {
				tag.setAttribute(p, config[p]);
			}
		}
		//此处try为释放tag引用，否则创建的DOM永远无法被释放
		try{
			return tag;
		} finally {
			tag = null;
		}
	},
	
	/**
	 * 标签切换
	 * @param {Object} name
	 * @param {Object} cursel
	 * @param {Object} n
	 */
	setTab: function(name, cursel, n){
		for(var i=1; i<=n; i++){ 
			var menu = this.$(name + i); 
			var con = this.$('con_' + name + '_' + i); 
			menu.parentNode.className = i == cursel ? 'current' : ''; 
			con.style.display = i == cursel ? 'block' : 'none'; 
		} 
	},
	
	/**
	 * 函数控制
	 * @param {Object} id
	 */
	tabFn: function(id){
		var that = this,
			uls = this.$(id);
		if(!uls) return false;
		
		var elems = uls.getElementsByTagName('a');
		for(var i=1, len=elems.length; i<=len; i++){
			elems[i-1].i = i;
			this.addEvent(elems[i-1], 'click', function(){
				that.setTab('one', this.i, len);
			})
		}
	},
	
	/**
	 * 单击链接选中radio
	 */
	checkedRadio: function(id){
		var that = this,
			eles = this.$(id);
		if(!eles){ return false; }
		var	authors = eles.getElementsByTagName('a');
		
		for(var i=0, len=authors.length; i<len; i++){
			this.addEvent(authors[i], 'click', function(event){
				
				that.preventDefault(that.getEvent(event));
				that.getPrev(this.parentNode).checked = true;
			})
		}
	},
	
	/**
	 * 弹出窗口
	 * @param {Object} id
	 */
	popWindows: function(pop){
		var ele = this.$(pop),
			winWidth = this.getWindowsSize().width,
			winHeight = this.getWindowsSize().height,
			scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
			mask = this.createElement('div', {
				cls: 'mask',
				id: 'winMask'
			});
		
		if(!ele || !close) return false;
		
		var handler = ele.getElementsByTagName('h1')[0],
			closeBtn = handler.getElementsByTagName('a')[0],
			iframe = this.createElement('iframe', {
				id: 'selectFrame'
			});
			
		if(!this.$('winMask')){
			document.body.appendChild(mask);
			mask.style.cssText = 'width:' + winWidth + 'px;height:' + parseInt(winHeight + scrollTop) + 'px;display:block;top:0';
		}
		
		ele.style.display = 'block';
		ele.style.zIndex = '3';
		ele.style.left = (winWidth - ele.offsetWidth)/2 + 'px';
		ele.style.top = (winHeight - ele.offsetHeight)/2 + scrollTop + 'px';
		
		iframe.width = '100%';
		iframe.height = ele.offsetHeight;
		
		if(!this.$('selectFrame')){
			ele.appendChild(iframe);
		}
		
		closeBtn.onclick = function(){
			ele.removeChild(iframe);
			ele.style.display = 'none';
			document.body.removeChild(mask);
		}
		
	},
	
	/**
	 * 关闭窗口
	 * @param {Object} id
	 */
	closeWindows: function(id){
		var mask = this.$('winMask'),
			ele = this.$(id);
		if(!ele) return false;
		
		ele.removeChild(this.$('selectFrame'));
		ele.style.display = 'none';
		document.body.removeChild(mask);
	},
	
	/**
	 * 拖动窗口
	 * @param {Object} id
	 */
	dragdrop: function(id){
		var that = this,
			ele = this.$(id),
			posx,
			posy;
		if(!ele){ return false; }
		
		var handler = ele.getElementsByTagName('h1')[0],
			closeBtn = handler.getElementsByTagName('a')[0];
		
		handler.onmousedown = function(e){
			e = that.getEvent(e);
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			
			
			posx = e.clientX - parseInt(ele.style.left);
			posy = e.clientY - (parseInt(ele.style.top) - parseInt(scrollTop));
			
			if (handler.setCapture) { //防止ie下拖动过快丢失对象
                handler.setCapture();
            } else if (window.captureEvents) {
                window.captureEvents(e.MOUSEMOVE | e.MOUSEUP);
            }
			
			document.onmousemove = function(e){
				e = that.getEvent(e);
				
				var l = e.clientX - posx,
					t = e.clientY - posy,
					width = that.getWindowsSize().width,
					height = that.getWindowsSize().height;
					
				//防止拖出视口
				if(l < 0){
					l = 0;
				} else if(l > width - ele.offsetWidth){
					l = width - ele.offsetWidth;
				}
				
				if(t < 0 ){
					t = 0;
					
				} else if(t > height - ele.offsetHeight){
					t = height - ele.offsetHeight;
				}
				document.body.onmousewheel = function(){return;}
				ele.style.left = l + 'px';
				ele.style.top = t + parseInt(scrollTop) + 'px';
				
				window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty(); //取消选择文本
			};
			
			document.onmouseup = function(e){
				e = that.getEvent(e);
				
				if (handler.releaseCapture) {
                    handler.releaseCapture();
                } else if (window.captureEvents) {
                    window.captureEvents(e.MOUSEMOVE | e.MOUSEUP);
                }
				
				document.onmousemove = null;
				document.onmouseup = null;
			};
		}
		
	}
}

/**
 * 注册页面跳转
 */
var regLink = function(){
	var bussines = J.$('bussinessUser'),
		personal = J.$('personalUser');
	if(!bussines || !personal) return false;
	
	J.addEvent(bussines, 'click', function(){
		location.href = 'bussinesReg.html';
	})
	
	J.addEvent(personal, 'click', function(){
		location.href = 'reg.html';
	})
}

/**
 * 收缩菜单
 * @param {Object} id
 */
var sideNav = function(id){
	var	elem = $('#' + id),
		handler = $('#' + id + ' h1'),
		firstHandler = elem.find('h1').eq(0),
		firstCont = firstHandler.next('div');
		
	if(!elem) return false;
	if(firstCont.css('display') == 'none'){
		firstCont.show();
		firstHandler.addClass('show');
	} else {
		firstCont.hide();
		firstHandler.removeClass('show');
	}
	
	handler.click(function(){
		subCont = $(this).next('div');
		
		if(subCont.css('display') == 'none'){
			subCont.siblings('div').slideUp().end().slideDown('300');
			$(this).siblings().removeClass('show').end().addClass('show');
		} else {
			subCont.slideUp('300');
			$(this).siblings().removeClass('show');
		}
	});
};

J.addEvent(window, 'load', function(){
	J.dragdrop('addBlank');
});