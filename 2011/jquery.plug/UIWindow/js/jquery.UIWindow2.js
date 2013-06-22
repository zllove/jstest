/**
 * Copyright (c) 2011 Jikeytang (http://jikey.cnblog.com/)
 * Version: 0.0.1
 * Demo: http://jikey.cnblog.com/
 */
;
(function ($) {
    
    $.fn.extend({
        //弹出小窗口插件
        UIWindow     :function (options) {
            var self = this;
            var shortcut = $.fn.UIWindow;
            shortcut.defaults = {
                pattern     :'blue',   // 默认风格
                title       :'消息',   // 默认标题
                width       :'auto',   // 自动适应宽度
                height      :'auto',   // 自动适应高度
                minWidth    :'200',    // 最小宽度
                minHeight   :'130',    // 最小高度
                padding     :'15px',   // 内填充
                timer       :null,     // 关闭延迟时间
                ESC         :true,     // ESC退出
                url         :null,     // iframe地址
                isMaxWin    :false,    // 是否最大化
                isMask      :true,     // 是否遮罩
                position    :false,       // 定位
                left        :false,       // 距屏幕左的位置
                top         :false,       // 距屏幕顶的位置
                isScroll    :false,    // 弹出后滚动条是否滚动
                maxBtn      :false,    // 是否显示最大化按钮
                callOnOpen  :null,     // 打开后调用
                callOnClose :null,     // 关闭后调用
                winID       :'',       // 弹出层需要的ID
                isDrag      :true,     // 是否需要拖动
                eventType   :null      // click, blur, change, dblclick, error, focus, load, mousedown, mouseout, mouseup
            };
            if(typeof options != 'object') {
                alert('请正确输入参数!');
                return;
            }
            // 若参数为非对象，且为字符串，数组，数字型时
            if(typeof options != 'object' || options.constructor == Array) {
                options = {cont: options};
            }
            var opts = $.extend(shortcut.defaults, options);
            var eventType = opts.eventType;
            if(eventType){
                self.bind(eventType, function(event){
                    shortcut.init(opts);
                });
            } else {
                shortcut.init(opts);
            }
        },
        // 添加滚动事件
        mousewheel:function (fun) {
            return this.each(function () {
                var that   = this;
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
    $.extend($.fn.UIWindow, {
        // 设置参数
        setOptions: function(o){
            this.title       = o.title;                 // 标题
            this.width       = o.width;                 // 宽度
            this.height      = o.height;                // 高度
            this.minWidth    = o.minWidth;              // 最小宽度
            this.minHeight   = o.minHeight;             // 最小高度
            this.padding     = o.padding;               // 内填充
            this.url         = o.url;                   // 延迟时间
            this.winID       = o.winID;                 // 弹出层需要的ID
            this.content     = o.content;               // 内容
            this.timer       = o.timer;                 // 延迟时间
            this.isMask      = o.isMask;                // 是否遮罩
            this.isDrag      = o.isDrag;                // 是否需要拖动
            this.position    = o.position;              // 是否需要绝对定位
            this.left        = o.left;                  // 距屏幕左的位置
            this.top         = o.top;                   // 距屏幕顶的位置
            this.callOnOpen  = o.callOnOpen;            // 打开后调用
            this.IE6         = $.browser.version == 6;
            this.window      = $(window);
            this.document    = $(document);
            this.body        = $(document.body);
//            console.log($.fn.UIWindow.defaults.pattern);
        },
        // 初始化
        init: function(o){
            var that = this,
                isDelay = null,
                cache = $.UIWindow.cache;
            that.setOptions(o);
            that.createWin();
            that.createMask(); // 创建蒙版
            var win = that.win,
                mask = that.mask;
            win.fadeIn('slow', function(){ that.callOnOpen && that.callOnOpen(); });
            that.isMask && mask.fadeTo('slow', 0.5);
            that.setZIndex();
            mask.click(function(){ that.closeWin(); }); // 单击遮罩可关闭
            cache.push(win);
            cache.push(mask);
            that.timer ? isDelay = true : ''; // 如果timer有值则表示延迟关闭,并调用关闭方法
            that.timer && that.closeWin(isDelay);
            that.position && win.css('position', that.position);
        },
        // 创建容器
        createWin: function(){
            var that = this,
                body = that.body,
                win = $('<div class="ui-win-wrap"></div>').appendTo(body).hide(), // 整个弹出层外部容器
                winTitle = $('<h1 class="ui-win-title"></h1>').appendTo(win), // 标题
                winCont =  $('<div class="ui-win-body"></div>').appendTo(win); // 内容
            that.win = win; // win 对象绑定到全局，方便全局调用
            that.title ? winTitle.append(that.title) : winTitle.hide();
            titleClose = $('<a class="ui-closeWin" href="###">关闭</a>').appendTo(winTitle); // 关闭按钮
//            that.setWinContent([that.winID, that.winClass, that.content], winCont);
            that.winID && winCont.append($(that.winID).html()).wrapInner('<div class="ui-win-content" />');
            that.content && winCont.append(that.content).wrapInner('<div class="ui-win-content" />');
            that.url && winCont.append("<iframe src='" + that.url + "' id='_UIWindowFrame_" + "' allowTransparency='true' width=95% height=100% frameborder='0' style='background-color:#transparent;border:none;overflow-x:hidden;'></iframe>");
            that.setSize(); // 设置大小
            that.isDrag && that.setDrag(winTitle);
            that.padding && winCont.css({padding: that.padding}); // 设置内填充
            titleClose.click(function(event){ that.closeWin(); }); // 单击关闭按钮关闭
            return that;
        },
        setWinContent: function(ele, parentEle){
            var that = this;
            for(var i=0, len=ele.length; i<len; i++){
                var contEle = ele[i];
                contEle &&  parentEle.append($(contEle).html() ? $(contEle).html() : contEle).wrapInner('<div />');
                if(!contEle) continue;
            }
            return this;
        },
        // 创建遮罩
        createMask: function(){
            var that = this,
                body = that.body,
                windowWidth = that.window.width(),
                mask = $('<div class="ui-mask"></div>').appendTo(body).hide();
            that.mask = mask;
            mask.css({width: windowWidth, height: that.document.height()});
            that.IE6 && m.html('<iframe src="about:blank" style="width:100%;height:100%;position:absolute;top:0;left:0;z-index:-1;filter:alpha(opacity=0)"></iframe>'); // 添加全屏iframe以防止select穿透
            return that;
        },
        // 设置大小
        setSize: function(){
            var that = this,
                win = that.win,
                window = that.window,
                windowWidth = window.width(),
                windowHeight = window.height(),
                left, top;
            if(typeof that.width == 'number' || typeof that.height == 'number'){
                win.css({width: Math.max(that.minWidth, that.width), height:Math.max(that.minHeight, that.height)});
            } else {
                win.css({width: 'auto', height: 'auto'});
            }
            var defaultTop = Math.floor((windowHeight - win.outerHeight()) / 2); // 初始化顶部的距离，居中
            left = (typeof that.left == 'number' ? that.left : (windowWidth - win.width()) / 2);
            top = (typeof that.top == 'number' ? that.top : defaultTop);
            win.css({left:left + 'px', top:top + 'px'});
            return that;
        },
        // 设置堆叠值
        setZIndex: function(){
            var that = this,
                win = that.win,
                mask = that.mask,
                zVal = $.UIWindow.globalIndex++; // 引用全局变量值
            win && win.css({zIndex: zVal});
            mask && mask.css({zIndex: zVal - 1});
            return that;
        },
        /**
         * 设置拖动
         * @param {Object} handler 拖动手柄
         */
        setDrag: function(handler /* Object */){
            var that = this,
                startX, startY,
                parentEle = handler.parent(), // 父容器
                $window = that.window,
                $document = that.document;
            handler.mousedown(function(e){
                $(this).css('cursor', 'move');
                startX = e.pageX - parseInt(parentEle.css('left'));
                startY = e.pageY - parseInt(parentEle.css('top'));
                this.setCapture && this.setCapture(); // IE 下防止拖动过快丢失对象
                // 开始拖动
                $document.mousemove(function(e){
                    var endX = e.pageX - startX,
                        endY = e.pageY - startY,
                        scrollTop = that.IE6 ? $document.scrollTop() : 0;
                    endX = Math.max(0, Math.min($window.width() - parentEle.outerWidth(), endX)); // 防止拖出窗口
                    endY = Math.max(scrollTop, Math.min($window.height() - parentEle.outerHeight() + scrollTop, endY)); // 防止拖出窗口
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty(); // 取消选择文本
                    parentEle.css({left:endX, top: endY});
                });
                return false; // 防止在 chrome 下滚屏，并丢失 cursor:move 样式
            });
            // 当滚动时保持固定位置不变
            $window.bind('scroll', function(){
                var endX = parentEle.css('top'),
                    scrollTop = that.IE6 ? $document.scrollTop() + endX : endX;
                parentEle.css({top: scrollTop});
            });
            // 释放拖动
            $document.mouseup(function(){
                handler.css('cursor', 'auto');
                handler[0].releaseCapture && handler[0].releaseCapture(); // 防止拖动过快丢失对象
                $document.unbind('mousemove');
            });
        },
        // 通过btn关闭
        closeByBtn: function(){},
        // 关闭窗口
        closeWin: function(delay){
            var that = this,
                cache = $.UIWindow.cache,
                mask = cache[cache.length - 1],
                win = cache[cache.length - 2];
            win.trigger('unload').unbind('click');
            mask.trigger('unload').unbind('click');
            that.slowOut(win, delay).slowOut(mask, delay);
            cache.splice(cache.length-2, 2);
            return that;
        },
        /**
         * 渐隐并移除 DOM
         * @param ele
         * @param speed 移除速率
         * @param delay 是否延迟
         */
        slowOut: function(ele, speed, delay){
            var that = this;
            (typeof speed == 'boolean') ? (delay = speed) : (speed || 'slow');
            ele.delay((delay ? that.timer : 0) * 1000).fadeOut(speed, function(){
                ele == that.win && that.callOnClose && that.callOnClose(); // 关闭弹窗后调用方法
                $(this).remove();
            });
            return that;
        },
        // 最大化&最小化窗口
        maxWin: function(){},
        // 最大化
        maxWinFn: function(){}
    });
    $.UIWindow = function(s){
        $.fn.UIWindow(s);
    };
    $.UIWindow.globalIndex = new Date().getFullYear() + '' + new Date().getHours();  // 全局堆叠值,不能超过最大值(2147483647) From: http://softwareas.com/whats-the-maximum-z-index
    $.UIWindow.cache = []; // 缓存对象
})(jQuery);
// From: http://stackoverflow.com/questions/7825448/webkit-issues-with-event-layerx-and-event-layery
(function () {
    // remove layerX and layerY
    var all = $.event.props,
        len = all.length,
        res = [];
    while (len--) {
        var el = all[len];
        if (el != 'layerX' && el != 'layerY') res.push(el);
    }
    $.event.props = res;
}());
