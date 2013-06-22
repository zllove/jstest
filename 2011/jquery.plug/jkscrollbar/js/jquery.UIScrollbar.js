/**
 * Copyright (c) 2012
 * Version: 0.0.1
 * Demo:
 */
;
(function($){
	$.fn.extend({
		//滚动条插件
        UIScrollbar: function(options){
			var defaults = {
				pattern: 'blue' //默认的风格
			};
			var opts = $.extend(defaults, options);
            var scrollbar = {
                init: function(opts, me){
                    var that           = this;
                    that.me            = me;
                    that.scrollWrap    = me.wrapInner('<div class="jkscroll-cont"></div>');
                    that.scrollWrap.append('<div class="jkscroll-bar"><div class="jkscroll-bar-top"></div><div class="jkscroll-bar-mid"></div><div class="jkscroll-bar-bot"></div></div>');

                    that.bar           = that.scrollWrap.children('.jkscroll-bar');  // 滚动条容器
                    that.barTop        = that.bar.children('.jkscroll-bar-top');     // 顶部按钮
                    that.barMid        = that.bar.children('.jkscroll-bar-mid');     // 中间滚动条
                    that.barBot        = that.bar.children('.jkscroll-bar-bot');     // 底部按钮
//                    that.content       = that.me.children('.jkscroll-cont');       // 内容区域
                    that.content       = me.parent().find('.jkscroll-cont');         // 内容区域
                    that.sTop          = parseInt(that.barMid.css('top'));                                          // 滚动条当前距顶部的高度
                    that.barBtnWidth   = that.bar.width();                           // 按钮的宽度
                    that.wrapHeight    = that.scrollWrap.height();                   // 容器的高度
                    that.contentHeight = that.content.height();                      // 内容的实际高度
                    that.barHeight     = Math.ceil((that.wrapHeight - 2 * that.barBtnWidth) * that.wrapHeight / that.contentHeight); // 滚动条高度
                    that.topTimer      = 0;
                    that.speed         = 0;
                    that.isBar         = 0;

                    console.log('c1', this.wrapHeight);
                    console.log('c', this.contentHeight);
                    if(this.contentHeight < this.wrapHeight){
                        that.bar.hide();
                        that.isBar = 1;
                    }
                    for (var p in opts) { // opts 绑定到 slide
                        that[p] = opts[p];
                    }
                    that.scrollWrap.addClass('jkscroll-wrap');

                    // 风格设定
                    if(opts.pattern == 'jkscroll-simple'){
                        that.bar.addClass('jkscroll-simple');
                        that.barBtnWidth = 0;
                    } else if(opts.pattern == 'jkscroll-gray'){
                        that.bar.addClass('jkscroll-gray');
                    }

                    // 以下都是做为初始化数据
                    that.barHeight < 10 && (that.barHeight = 10);
                    that.barMid.height(that.barHeight);

                    // 当鼠标拖动滚动条
                    that.barMid.hover(function(){
                        $(this).addClass('hover');
                    }, function(){
                        $(this).removeClass('hover');
                    });
                    that.bindNode().setWheel().bindBar();
                },
                // 绑定节点
                bindNode: function(){
                    this.bindEvent(this.barTop, 'up');
                    this.bindEvent(this.barBot, 'bot');
                    return this;
                },
                // 绑定事件
                bindEvent: function(node, direction){
                    var that = this;

                    // 向上按钮绑定事件
                    node.bind('mousedown', function(){
                        that.setBarTop(direction);
                        $(document).mouseup(function(){
                            $(document).unbind();
                            clearTimeout(that.topTimer);
                            that.speed = 0;
                        });
                        return false;
                    });
                    return this;
                },
                // 绑定中间滚动条
                bindBar: function(){
                    var that   = this,
                        sTop   = that.sTop,
                        barMid = that.barMid;

                    // 滚动条绑定事件
                    barMid.bind('mousedown', function(e){
                        var pageY    = e.pageY,
                            jkBarTop = parseInt($(this).css('top')); // 中间滚动条当前的高度
                        $(document).mousemove(function(ev){
                            sTop = jkBarTop + ev.pageY - pageY;
                            that.setScrollTop(sTop);
                            that.noSelect();
                        });
                        $(document).mouseup(function(){
                            $(document).unbind();
                        });
                        return false;
                    });
                    return that;
                },
                // 设置bar
                setBarTop:function (scrollDir) {
                    var that     = this,
                        sTop     = parseInt(that.barMid.css('top')),
                        speed    = that.speed;

                    if (scrollDir == 'up') {
                        sTop -= 15;
                    } else {
                        sTop += 15;
                    }
                    that.setScrollTop(sTop);
                    speed += 2;
                    var t = 500 - speed * 50;
                    t <= 0 && (t = 0);
                    that.topTimer = setTimeout(function () {
                        that.setBarTop(scrollDir);
                    }, t);
                    return that;
                },
                // 设置滚动
                setScrollTop: function(top){
                    var barMid        = this.barMid,
                        barBtnWidth   = this.barBtnWidth,
                        barHeight     = this.barHeight,
                        contentHeight = this.contentHeight,
                        wrapHeight    = this.wrapHeight,
                        content       = this.content,
                        maxHeight     = wrapHeight - barBtnWidth - barHeight;

                    this.maxHeight = maxHeight;
                    top < barBtnWidth && (top = barBtnWidth); // 防止拖出向上按钮
                    top > maxHeight && (top = maxHeight); // 防止拖出向下按钮
                    content.css({top:-Math.ceil(((top - barBtnWidth) * contentHeight) / (wrapHeight - 2 * barBtnWidth))}); // 设置内容离顶的距离
                    barMid.css({top:top}); // 设置滚动条离顶的距离
                },
                // 拖动时取消选择文本
                noSelect: function(){
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                    return this;
                },
                // 设置滚动键
                setWheel: function(){
                    var that = this,
                        sTop = that.sTop;

                    !that.isBar && $(that.me).mousewheel(function () {
                        if (this.delta > 0) { // 向上
                            sTop -= 15;
                        } else {
                            sTop += 15;
                        }
                        sTop < 0 && (sTop = 0);
                        sTop > that.maxHeight && (sTop = that.maxHeight);
                        if(that.maxHeight && sTop > that.maxHeight){
                            sTop = that.maxHeight;
                        }
                        that.setScrollTop(sTop);
                    });
                    return that;
                }
            }
            return this.each(function(){ // $(a,b) 方式调用
                function F(){};
                F.prototype = scrollbar;
                var obj = new F();
                obj.init(options, $(this));
            });
		},
		// 添加滚动事件
		mousewheel: function(fun){
			return this.each(function(){
				var that = this;
					that.delta = 0; // 滚动方向

                if ($.browser.msie || $.browser.safari) { // IE Safari
                    that.onmousewheel = function () {
                        that.delta = event.wheelDelta; // IE,Opera,Safari,Chrome 使用wheelDelta 只取 +-120
                        event.returnValue = false;
                        fun && fun.call(that); //
                    }
                } else { //Firefox
                    that.addEventListener('DOMMouseScroll', function (e) {
                        that.delta = e.detail > 0 ? -1 : 1; // Firefox 使用 detail 只取 +-3
                        e.preventDefault();
                        fun && fun.call(that);
                    }, false);
                }
			});
		}
	});
})(jQuery);