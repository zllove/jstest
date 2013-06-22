/**
 * Copyright (c) 2011 Jikeytang (http://jikey.cnblog.com/)
 * Version: 0.0.1
 * Demo: http://jikey.cnblog.com/
 */
;(function($){
	$.fn.extend({
		//滚动条插件
		jkScrollBar: function(options){
			var defaults = {
				pattern: 'blue' //默认的风格
			};
			var opts = $.extend(defaults, options);
			
			//添加滚动条DOM结构
			var jkScrollWrap = this.wrapInner('<div class="jkscroll-cont"></div>');
				jkScrollWrap.append('<div class="jkscroll-bar"><div class="jkscroll-bar-top"></div><div class="jkscroll-bar-mid"></div><div class="jkscroll-bar-bot"></div></div>');
				
			var jkBar = jkScrollWrap.children('.jkscroll-bar'), //滚动条容器
				jKBarTop = jkBar.children('.jkscroll-bar-top'), //顶部按钮
				jKBarMid = jkBar.children('.jkscroll-bar-mid'), //中间滚动条
				jKBarBot = jkBar.children('.jkscroll-bar-bot'), //底部按钮
				jKCont = jkScrollWrap.children('.jkscroll-cont'); //内容区域
				
			var currentTop = 0, //滚动条当前距顶部的高度
				jkBarBtnWidth = jkBar.width(), //按钮的宽度、高度
				wrapH = jkScrollWrap.height(), //容器的高度
				contH = jKCont.height(), //内容的实际高度
				jkBarH = (wrapH - 2 * jkBarBtnWidth) * wrapH / contH, //滚动条高度
				scrollTopTimer,
				scrollTopSpeed = 0, //滚动速率
				that = this;
			
			jkScrollWrap.addClass('jkscroll-wrap');
			
			//风格设定
			if(opts.pattern == 'jkscroll-simple'){
				jkBar.addClass('jkscroll-simple');
				jkBarBtnWidth = 0;
			} else if(opts.pattern == 'jkscroll-gray'){
				jkBar.addClass('jkscroll-gray');
			}
			
			//以下都是做为初始化数据
			jkBarH < 10 && (jkBarH = 10);
			jKBarMid.height(jkBarH);
			
			//当鼠标拖动滚动条
			jKBarMid.hover(function(){
				$(this).addClass('hover');
			}, function(){
				$(this).removeClass('hover');
			});
			
			//滚动条绑定事件
			jKBarMid.bind('mousedown', function(e){ //为什么要采取 delegate http://article.yeeyan.org/view/213582/179910
				var pageY = e.pageY, //鼠标的位置
					jkBarTop = parseInt($(this).css('top')); //中间滚动条当前的高度
				
				$(document).mousemove(function(e2){
					currentTop = jkBarTop + e2.pageY - pageY;
					setScrollTop();
					
					//拖动时取消选择文本
					window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty(); 
				});
				$(document).mouseup(function(){
					$(document).unbind();
				});
				
				return false;
			});
			
			//向上按钮绑定事件
			jKBarTop.bind('mousedown', function(e){
				that.setBarTop('up');
				$(document).mouseup(function(){
					$(document).unbind();
					clearTimeout(scrollTopTimer);
					scrollTopSpeed = 0;
				});
			});
			
			//向下按钮绑定事件
			jKBarBot.bind('mousedown', function(e){
				that.setBarTop('bot');
				$(document).mouseup(function(){
					$(document).unbind();
					clearTimeout(scrollTopTimer);
					scrollTopSpeed = 0;
				});
			});
			
			//按钮设置高度方法
			that.setBarTop = function(scrollDir){
				if(scrollDir == 'up'){
					currentTop -= 15;
				} else {
					currentTop += 15;
				}
				setScrollTop();
				scrollTopSpeed += 2;
				var t = 500 - scrollTopSpeed * 50;
				t <=0 && (t = 0);
				scrollTopTimer = setTimeout(function(){
					that.setBarTop(scrollDir);
				}, t);
			}
			
			//滚动条设置高度方法
			function setScrollTop(){
				currentTop < jkBarBtnWidth && (currentTop = jkBarBtnWidth); //防止拖出向上按钮
				currentTop > wrapH - jkBarBtnWidth - jkBarH && (currentTop = wrapH - jkBarBtnWidth - jkBarH - 2); //防止拖出向下按钮
				jKBarMid.css({top: currentTop}); //设置滚动条离顶的距离
				
				var jkContTop = ((currentTop - jkBarBtnWidth) * contH)/(wrapH - 2 * jkBarBtnWidth);
				
				jKCont.css({top: -jkContTop}); //设置内容离顶的距离
			};
			
			$(that).mousewheel(function(){
				if(this.delta > 0){ //如果大于零，则向上，反之向下。
					currentTop -= 15;
				} else {
					currentTop += 15;
				}
				setScrollTop();
			});
			return this;
		},
		//添加滚动事件
		mousewheel: function(fun){
			return this.each(function(){
				var that = this;
					that.delta = 0; //滚动方向
				
				if($.browser.msie || $.browser.safari){ //IE Safari 
					that.onmousewheel = function(){
						that.delta = event.wheelDelta; // IE,Opera,Safari,Chrome 使用wheelDelta 只取 +-120
						event.returnValue = false;
						fun && fun.call(that); //	
					}
				} else { //Firefox
					that.addEventListener('DOMMouseScroll', function(e){
						that.delta = e.detail > 0 ? -1 : 1; // Firefox 使用 detail 只取 +-3
						e.preventDefault();
						fun && fun.call(that);
					}, false);
				}
			});
		}
	});
})(jQuery);