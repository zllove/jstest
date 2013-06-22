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
                fullWin     :false,    // 是否最大化
                mask        :false,    // 是否遮罩
                position    :'',       // 定位
                left        :'',       // 距屏幕左的位置
                top         :'',       // 距屏幕顶的位置
                isScroll    :false,    // 弹出后滚动条是否滚动
                maxBtn      :false,    // 是否显示最大化按钮
                callOnOpen  :null,     // 打开后调用
                callOnClose :null,     // 关闭后调用
                winID       :'',       // 弹出层需要的ID
                winClass    :'',       // 弹出层需要的class
                dragable    :true,     // 是否需要拖动
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
            /**
             * 拖动对象
             * @param {Object} o 参数选项
             */
            var UIWindow = function (o) {
                var that = this;
                that.setOpts(o); // 设定参数
                var eventType = that.eventType;
//                var rel = event.rel
                if(eventType){ // 如果是有事件支持，比如:click,mouseover
                    self.bind(that.eventType, function(event){ // 如果是 $(). 方式调用
                        that.init(self);
                    });
                } else { // 如果是 $.function 方式调用
                    that.init();
                }
            }
            UIWindow.prototype = {
                /**
                 * 设置参数
                 * @param {Object} o 参数选项
                 */
                setOpts:function (o /* Object */) {
                    this.pattern     = o.pattern;           // 风格
                    this.title       = o.title;             // 标题
                    this.width       = o.width;             // 宽度
                    this.height      = o.height;            // 高度
                    this.minWidth    = o.minWidth;          // 最小宽度
                    this.minHeight   = o.minHeight;         // 最小高度
                    this.padding     = o.padding;           // 内填充
                    this.ESC         = o.ESC;               // 退出按键
                    this.url         = o.url;               // 外部url, 一般为 iframe
                    this.cont        = o.content;           // 内容
                    this.timer       = o.timer;             // 消失时间
                    this.fullWin     = o.fullWin;           // 是否最大化
                    this.maskWin     = o.mask;              // 是否遮罩
                    this.position    = o.position;          //
                    this.left        = o.left;              //
                    this.top         = o.top;               //
                    this.isScroll    = o.isScroll;          // 弹出后滚动条是否滚动
                    this.maxBtn      = o.maxBtn;            // 最大化按钮
                    this.callOnOpen  = o.callOnOpen;        // 打开后调用
                    this.callOnClose = o.callOnClose;       // 关闭后调用
                    this.winID       = o.winID;             // 弹出需要的id
                    this.winClass    = o.winClass;          // 弹出需要的class
                    this.dragable    = o.dragable;          // 是否拖动
                    this.eventType   = o.eventType;         // 单击事件

                    this.IE          = $.browser.msie;      // IE
                    this.IE6         = this.IE && $.browser.version == '6.0';  // IE6
                    this.WEBKIT      = $.browser.webkit;    // Webkit(Chrome, Safari)
                    this.FIREFOX     = $.browser.mozilla;   // Firefox
                    this.window      = $(window);
                    this.document    = $(document);
                    this.body        = $(document.body);

                    return this;
                },
                // 初始化
                init   :function (mouseEle) {
                    var that   = this,
                        win    = that.createWrap(that.title, that.cont),
                        close  = win.find('a.ui-closeWin'),
                        max    = win.find('a.ui-maxwin'),
                        mask   = that.createMask();

                    that.win = win; // win 对象绑定到全局，方便调用
                    that.mask = mask;
                    win.fadeIn('slow', function(){
                        that.callOnOpen && that.callOnOpen();  // 呼叫被调函数
                    }).focus();
                    !that.maskWin && mask.fadeTo('slow', 0.5); // 设置遮罩
                    // 单击遮罩也可以关闭
                    mask.click(function(){
                        that.closeWin();
                    });

                    that.setZIndex().closeBtn(close); // 全局设置index，防止层上层之后，遮罩不跟随
                    that.maxWin(win, max); // 绑定双击最大化事件
                    // 全局ESC快捷键
                    that.ESC && that.document.bind('keydown', function (e) {
                        if (/^INPUT|TEXTAREA$/.test(e.target.nodeName)) { return; }
                        if (e.keyCode == 27) {
                            win.fadeOut().remove();
                            mask.fadeOut().remove();
                        }
                    });

                    that.timer != null && (that.slowOut(win, true).slowOut(mask, true)); // 数秒后，自动隐藏
                    that.position && that.win.css('position', that.position); // 绝对定位设置
                    if(that.isScroll){ // 如果不希望滚动
                        !that.IE && (that.body).css({'overflow': 'hidden', 'paddingRight': '17px'});
                        that.IE && $(document.documentElement).css({'overflow': 'hidden', 'paddingRight': '17px'});
                    }
                },
                /**
                 * 创建基本容器
                 * @param {String} title
                 * @param {String} cont
                 */
                createWrap:function (title /* String */, cont /* String */) {
                    var that       = this,
                        body       = that.body,
                        wrap       = $(that.createEle('div', 'ui-win-wrap')), // 最外边的容器
                        contwrap   = that.createEle('div', 'ui-win-body'),    // 内容区域
                        contfooter = that.createEle('div', 'ui-win-footer'),  // 弹出窗底部
                        closeBtn   = that.createEle('a', 'ui-closeWin'),      // 关闭按钮
                        max        = that.createEle('a', 'ui-maxwin'),        // 最大化按钮
                        text       = document.createTextNode('关闭'),          // 按钮文本
                        maxText    = document.createTextNode('最大化'),        // 按钮文本
                        header     = that.createEle('h1');                    // 拖动手柄

                    if(that.winID){ // 如果ID不为空
                        contwrap.innerHTML += $(that.winID).html() + '<br/>';
                    }
                    if(that.winClass){ // 如果class不为空
                        contwrap.innerHTML = $(that.winClass).html() + '<br/>';
                    }
                    if (cont) { // 如果cont不为空
                        contwrap.innerHTML += cont;
                    } else if(that.url != null){  // 如果是 iframe
                        $(contwrap).append("<iframe src='" + that.url + "' id='_UIWindowFrame_" + "' allowTransparency='true' width=95% height=100% frameborder='0' style='background-color:#transparent;border:none;overflow-x:hidden;'></iframe>");
                    }
                    header.innerHTML = title; // 标题
                    max.href = closeBtn.href = 'javascript:void(0)';
                    closeBtn.appendChild(text);
                    that.maxBtn && max.appendChild(maxText); // 最大化
                    header.appendChild(closeBtn);
                    header.appendChild(max);
                    // 需要插入的内容添加到拖动层中
                    $(contwrap).css({padding:opts.padding});
                    !title && (header.style.display = 'none'); // 隐藏标题
                    wrap.append(header).append(contwrap);
                    body.append(wrap);

                    that.setSize(wrap); // 设置大小位置信息
                    that.dragable && that.setDrag($(header)); // 如果dragable为false，则设为不拖动
                    that.IE6 && wrap.css({position:'absolute'}); // 如果是IE6则单独处理拖动是抖动问题 http://www.cnblogs.com/cloudgamer/archive/2010/10/11/AlertBox.html//                    var a = b.append(jkWinWrap);
                    return wrap;
                },
                /**
                 * 快速创建元素
                 * @param {String} ele 要创建的DOM类型
                 * @param {String} cls ClassName
                 */
                createEle:function (ele /* String */, cls /* String */) {
                    ele = document.createElement(ele);
                    cls && $(ele).addClass(cls);
                    return ele;
                },
                /**
                 * 创建遮罩
                 */
                createMask:function () {
                    var that = this,
                        m = $(that.createEle('div', 'ui-mask')),
                        b = that.body,
                        windowWidth = that.window.width(),
                        w = that.isScroll ? that.window.width() + 17 : that.window.width(); // 如果不希望滚动

                    m.css({width:w, height:that.document.height()}).hide(); // 设置大小，初始化时隐藏
                    that.IE6 && m.html('<iframe src="about:blank" style="width:100%;height:100%;position:absolute;top:0;left:0;z-index:-1;filter:alpha(opacity=0)"></iframe>'); // 添加全屏iframe以防止select穿透
                    that.setZIndex();
                    b.append(m);
                    return m;
                },
                /**
                 * 设置弹出窗口的大小位置
                 * @param {Object} ele
                 */
                setSize:function (ele /* Object */) {
                    var that = this,
                        defaultTop = Math.floor((that.window.height() - (typeof this.height == 'number' ? this.height : ele.outerHeight())) / 2), // 初始化离顶部的距离
                        left, top;

                    if (typeof that.width == 'number' || typeof that.height == 'number') { // 如果有值
                        ele.css({width:Math.max(that.minWidth, that.width), height:Math.max(that.minHeight, that.height)});
                    } else {
                        ele.css({width:'auto', height:'auto'});
                    }
                    left = that.left ? that.left : (that.window.width() - ele.width()) / 2; // 如果设置了 left 值
                    top = that.top ? that.top : defaultTop; // 如果设置了 top 值
                    ele.css({left:left + 'px', top:top + 'px'}).hide(); // 设置 left,top值
                    if(that.fullWin){ // 设置全屏
                        ele.css({width: that.window.width() - 20, height: that.window.height() - 20, left:0, top:0});
                    }
                    return that;
                },
                /**
                 * 设置Ｚ轴的堆叠值
                 * @param ele 控制层
                 */
                setZIndex:function () {
                    var that = this,
                        win  = that.win,
                        mask = that.mask,
                        z    = $.UIWindow.globalIndex++; // 引用全局变量，否则每次初始化后值为原始值

                    win && win.css({zIndex: z});
                    mask && mask.css({zIndex:z - 1});
                    return that;
                },
                /**
                 * 设置拖动
                 * @param {Object} handler 拖动手柄
                 */
                setDrag:function (handler /* Object */) {
                    var that = this,
                        posx, // 初始位置
                        posy, // 初始位置
                        parent = handler.parent('div.ui-win-wrap'), // 父容器
                        max = handler.find('.ui-maxwin');
                    // 拖动
                    handler.mousedown(function (e) {
                        $(this).css('cursor', 'move'); // 只有拖动时鼠标为手型
                        posx = e.pageX - parseInt(parent.css('left'));
                        posy = e.pageY - parseInt(parent.css('top'));

                        this.setCapture && this.setCapture(); // 防止拖动过快丢失对象
                        that.document.mousemove(function (e) {
                            var l = e.pageX - posx,
                                t = e.pageY - posy,
                                st = that.IE6 ? that.document.scrollTop() : 0;
                            l = Math.max(0, Math.min(that.window.width() - parent.outerWidth(), l)); // 防止拖出窗口
                            t = Math.max(st, Math.min(that.window.height() - parent.outerHeight() + st, t));
                            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty(); // 取消选择文本
                            parent.css({left:l, top:t});
                        });
                        return false; // 防止拖动时Chrome滚屏，防止丢失cursor:move样式，也可用下面方法解决
                    });
                    // 当滚动条拖动时保持固定位置
                    that.window.bind('scroll', function () {
                        var endTop  = parent.css('top'),
                            endLeft = parent.css('left'),
                            t       = that.IE6 ? that.document.scrollTop() + endTop : endTop;
                        parent.css({top:t});

                        that.maxWin(parent, max, endTop, endLeft);
                    });
                    /*
                     // 在chrome下防止拖动时丢失cursor:move样式
                     // From: http://forum.jquery.com/topic/chrome-text-select-cursor-on-drag
                     that.WEBKIT && handler.mousemove(function(){
                         document.onselectstart = function(){ return false; };
                     }).mouseout(function(){
                         document.onselectstart = null;
                     });
                     */
                    // 释放拖动
                    that.document.mouseup(function () {
                        handler.css('cursor', 'auto'); // 释放拖动时鼠标恢复原状
                        handler[0].releaseCapture && handler[0].releaseCapture(); // 防止拖动过快丢失对象
                        that.document.unbind('mousemove');
                    });
                    return this;
                },
                /**
                 * 通过按钮关闭
                 * @param close
                 */
                closeBtn:function (close) {
                    var that = this,
                        btn  = close;
                    // 从DOM中移除拖动层
                    btn.bind('click', function () {
                        that.closeWin();
                    });
                    return that;
                },
                // 关闭窗口
                closeWin: function(){
                    var that = this,
                        ele  = that.win,
                        mask = that.mask;

                    if(that.isScroll){ // 如果不希望滚动
                        !that.IE && that.body.css({'overflow': 'auto', 'paddingRight': '0'});
                        that.IE && $(document.documentElement).css({'overflow': 'auto', 'paddingRight': '0'});
                    }
                    mask.unbind('click');
                    that.slowOut(ele).slowOut(mask);
                    return that;
                },
                /**
                 * 渐隐并移除DOM
                 * @param ele 渐隐对象
                 * @param speed 渐隐速率 如果delay为true，则延迟消失
                 */
                slowOut:function (ele, speed, delay) {
                    var that = this;
                    typeof speed == 'boolean' ? delay = speed : (speed = speed || 'slow'); // 如果delay为空，则交换参数值
                    console.log(ele);

                    $(ele).delay((delay ? this.timer : 0) * 1000).fadeOut(speed, function(){
                        ele == that.win && that.callOnClose && that.callOnClose(); // 关闭弹窗后调用方法
                        $(this).remove();
                    });
                    return that;
                },
                /**
                 * 最大化&最小化窗口
                 * @param {Object} win 控制层
                 * @param {Object} o 关闭按钮
                 * @param {String} t 初始top值
                 * @param {String} l 初始left值
                 */
                maxWin:function (win /* Object */, o /* Object */, t /* String */, l /* String */) {
                    var that    = this,
                        w       = win.outerWidth(),        // 包括border的宽度
                        h       = win.outerHeight(),       // 包括border的高度
                        maxW    = that.window.width(),     // 当前视窗的宽度
                        maxH    = that.window.height(),    // 当前视窗的高度
                        borderW = w - win.width(),         // 当前弹出层 border 的宽度
                        borderH = h - win.height(),        // 当前弹出层 border 的高度
                        handler = o.parent('h1');          // 当前拖动手柄

                    if (typeof t == 'undefined' && typeof l == 'undefined') { // 当前如果没有设置t,l,则取原始值
                        t = win.css('top');
                        l = win.css('left');
                    }
                    // 点击关闭按钮时放大缩小窗口
                    o.click(function (e) {
                        maxFn.call(this, e, win, maxW, maxH, borderW, borderH, t, l);
                    });
                    // 高级用户功能: 双击标题栏可放大缩小
                    handler.dblclick(function (e) {
                        maxFn.call(this, e, win, maxW, maxH, borderW, borderH, t, l);
                    });
                    /**
                     * 最大化窗口公用函数
                     * @param {Event} e
                     * @param {Object} win
                     * @param {String} maxW
                     * @param {String} maxH
                     * @param {String} borderW
                     * @param {String} t
                     * @param {String} l
                     */
                    function maxFn(e /* Event */, win /* Object */, maxW /* String */, maxH /* String */, borderW /* String */,borderH /* String */, t /* String */, l /* String */) {
                        var cur    = (e.currentTarget == handler[0]) ? $(this) : $(this).parent('h1'),
                            author = (e.currentTarget == handler[0]) ? $(this).find('a.jk-maxwin') : $(this);

                        if (win.width() < maxW - borderW) { // 当窗口还是最小化时，放大
                            win.animate({
                                width:maxW - borderW, height:maxH - borderH, top:0, left:0
                            }, 500);
                            author.html('最小化');
                            cur.css('cursor', 'auto');
                        } else { // 缩小窗口
                            win.animate({
                                width:w, height:h, top:t, left:l
                            }, 'slow');
                            author.html('最大化');
                            cur.css('cursor', 'move');
                        }
                    }
                },
                maxWinFn: function(){
                }
                // fn end
            }
            var uiWindow = new UIWindow(opts);
            return this;
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
    $.UIWindow = function(s){
        $.fn.UIWindow(s);
    };
    $.UIWindow.globalIndex = new Date().getFullYear() + '' + new Date().getHours();  // 全局堆叠值,不能超过最大值(2147483647) From: http://softwareas.com/whats-the-maximum-z-index
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
