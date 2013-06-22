/**
 * Copyright (c) 2011 Jikeytang (http://jikey.cnblog.com/)
 * Version: 0.0.1
 * Demo: http://jikey.cnblog.com/
 */
;
(function ($) {
    $.fn.UIWindow = function (options) {
        var defaults = {
            IE         :$.browser.msie,
            IE6        :!window.XMLHttpRequest,
            FIREFOX    :$.browser.mozilla,
            window     :$(window),
            document   :$(document),
            body       :$(document.body),
            id         :null,          // 需要赋值的ID
            pattern    :'blue',        // 默认风格
            title      :'消息',        // 标题
            width      :'auto',        // 宽
            height     :'auto',        // 高
            minWidth   :'200',         // 最小宽度
            minHeight  :'130',         // 最小高度
            padding    :'15px',        // 内填充
            timer      :null,          // 关闭延迟时间
            isMaxWin   :false,         // 是否最大化
            isMask     :true,          // 是否遮罩
            position   :false,         // 定位
            left       :false,         // 距屏幕左的位置
            top        :false,         // 距屏幕顶的位置
            callOnOpen :null,          // 弹出后调用
            callOnClose:null,          // 关闭后调用
            isDrag     :true,          // 是否需要拖动
            idContent  :'',            // 需要添加的id
            content    :'测试内容',     // 内容
            eventType  :null           // 事件类型 click, blur, change, dblclick, error, focus, load, mousedown, mouseout, mouseup
        };
        var opts = $.extend({}, defaults, options);

        var instance = {
            // 初始化方法
            open        :function (opts, me) {
                var that    = this,
                    cache   = $.UIWindow.cache,
                    isDelay = null;
                that.me = me; // 被调用者
                for (var p in opts) { // opts 绑定到 instance
                    this[p] = opts[p];
                }
                that.createWindow().createMask().setZIndex();
                var win = that.win.fadeIn('slow', function () { that.callOnOpen && that.callOnOpen(); });
                mask = that.mask;
                that.isMask && mask.fadeTo('slow', 0.5).click(function () { that.close(); });
                cache.push(win, mask);
                that.timer ? (isDelay = true, that.close(isDelay)) : ''; // 如果timer有值则表示延迟关闭,并调用关闭方法
                that.position && win.css('position', that.position);
            },
            // 创建容器
            createWindow:function () {
                var that       = this,
                    win        = $('<div class="ui-win-wrap"></div>').appendTo(this.body).hide(), // 整个弹出层外部容器
                    winTitle   = $('<h1 class="ui-win-title"></h1>').appendTo(win), // 标题
                    winBody    = $('<div class="ui-win-body"></div>').appendTo(win), // 内容
                    titleClose = null;
                opts.id && win.attr('id', opts.id);
                that.win = win; // win 绑定到对象，方便对象调用
                that.title ? winTitle.append(that.title) : winTitle.hide();
                titleClose = $('<a class="ui-closeWin" href="javascript:void(0)">关闭</a>').appendTo(winTitle).click(function () { that.close(); }); // 关闭按钮
                that.idContent && winBody.append($(that.idContent).html());
                that.content && winBody.append(that.content);
                that.isDrag && that.setDrag(winTitle);
                that.padding && winBody.css({padding:that.padding}); // 设置内填充
                that.url && winBody.append("<iframe src='" + that.url + "' id='_UIWindowFrame_" + "' allowTransparency='true' width=95% height=100% frameborder='0' style='background-color:#transparent;border:none;overflow-x:hidden;'></iframe>");
//                    winBody.append(that.me.next().html());
                that.IE6 && win.css({position:'absolute'});
                that.setSize();
                return that;
            },
            // 创建遮罩
            createMask  :function () {
                var that        = this,
                    body        = that.body,
                    windowWidth = that.window.width(),
                    mask        = $('<div class="ui-mask"></div>').appendTo(body).hide();
                that.mask = mask;
                mask.css({width:windowWidth, height:that.document.height()});
                that.IE6 && mask.html('<iframe src="about:blank" style="width:100%;height:100%;position:absolute;top:0;left:0;z-index:-1;filter:alpha(opacity=0)"></iframe>'); // 添加全屏iframe以防止select穿透
                return that;
            },
            // 设置大小
            setSize     :function () {
                var that           = this,
                    win            = that.win,
                    window         = that.window,
                    windowWidth    = window.width(),
                    windowHeight   = window.height(),
                    left, top;
                if (typeof that.width == 'number' || typeof that.height == 'number') {
                    win.css({width:Math.max(that.minWidth, that.width), height:Math.max(that.minHeight, that.height)});
                } else {
                    win.css({width:'auto', height:'auto'});
                }
                var defaultTop = Math.floor((windowHeight - win.outerHeight()) / 2);
                left = (typeof that.left == 'number' ? that.left : (windowWidth - win.width()) / 2);
                top = (typeof that.top == 'number' ? that.top : defaultTop);
                win.css({left:left + 'px', top:top + 'px'});
                return that;
            },
            // 设置堆叠值
            setZIndex   :function () {
                var that      = this,
                    win       = that.win,
                    mask      = that.mask,
                    indexVal  = $.UIWindow.globalIndex++; // 引用全局变量，否则每次初始化后值为原始值
                win && win.css({zIndex:indexVal});
                mask && mask.css({zIndex:indexVal - 1});
                return that;
            },
            /**
             * 设置拖动
             * @param {Object} handler 拖动手柄
             */
            setDrag     :function (handler /* Object */) {
                var that      = this,
                    startX, startY,
                    parentEle = handler.closest('div'),
                    $window   = that.window,
                    $document = that.document;
                handler.mousedown(function (e) {
                    $(this).css('cursor', 'move');
                    startX = e.pageX - parseInt(parentEle.css('left'));
                    startY = e.pageY - parseInt(parentEle.css('top'));
                    this.setCapture && this.setCapture(); // IE 下防止拖动过快丢失对象
                    // 开始拖动
                    $document.mousemove(function (e) {
                        var endX = e.pageX - startX,
                            endY = e.pageY - startY,
                            scrollTop = that.IE6 ? $document.scrollTop() : 0;
                        endX = Math.max(0, Math.min($window.width() - parentEle.outerWidth(), endX)); // 防止拖出窗口
                        endY = Math.max(scrollTop, Math.min($window.height() - parentEle.outerHeight() + scrollTop, endY)); // 防止拖出窗口
                        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty(); // 取消选择文本
                        parentEle.css({left:endX, top:endY});
                    });
                    return false; // 防止在 chrome 下滚屏，并丢失 cursor:move 样式
                });
                // 当滚动时保持固定位置不变
                $window.bind('scroll', function () {
                    var endX = parentEle.css('top'),
                        scrollTop = that.IE6 ? $document.scrollTop() + endX : endX;
                    parentEle.css({top:scrollTop});
                });
                // 释放拖动
                $document.mouseup(function () {
                    handler.css('cursor', 'auto');
                    handler[0].releaseCapture && handler[0].releaseCapture(); // 防止拖动过快丢失对象
                    $document.unbind('mousemove');
                });
                return that;
            },
            // 关闭
            close       :function (delay) {
                var that  = this,
                    cache = $.UIWindow.cache,
                    win   = cache[cache.length - 2],
                    mask  = cache[cache.length - 1];
                win.trigger('unload').unbind('click');
                mask.trigger('unload').unbind('click');
                that.slowRemove(win, delay).slowRemove(mask, delay);
                cache.splice(cache.length - 2, 2);
                return that;
            },
            /**
             * 渐隐并移除 DOM
             * @param ele
             * @param speed 移除速率
             * @param delay 是否延迟
             */
            slowRemove  :function (ele, speed, delay) {
                var that = this;
                (typeof speed == 'boolean') ? delay = speed : (speed || 'slow');
                ele.delay((delay ? that.timer : 0) * 1000).fadeOut('slow', function () {
                    that.callOnClose && that.callOnClose();
                    $(this).remove();
                });
                return that;
            }
        };
        var eventType = opts.eventType;
        if (eventType) { // 如果是 $.fn.UIWindow 方式调用
            return this.each(function (index) {
                $(this).bind(eventType, function () {
                    instance.open(opts, $(this));
                    return false;
                });
            });
        } else { // 如果是 $.UIWindow 方式调用
            instance.open(opts, $(this));
        }
    };
    $.UIWindow = function (s) {
        $.fn.UIWindow(s);
    };
    $.UIWindow.globalIndex = new Date().getFullYear() + '' + new Date().getHours();  // 全局堆叠值,不能超过最大值(2147483647) From: http://softwareas.com/whats-the-maximum-z-index
    $.UIWindow.cache = []; // 缓存对象
})(jQuery);