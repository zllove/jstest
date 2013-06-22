/**
 * @description: hogo JavaScript Util
 * @see: <a href="mailto:jikeytang@gmail.com">zyh</a>
 * @since:version 0.1
 */
;
(function(hogo){
    var windowWidth  = hogo.viewSize.width,
        windowHeight = hogo.viewSize.height,
        cache        = [],                                                      // 缓存对象，以便于多个新建多个对象
        INDEX        = new Date().getFullYear() + '' + new Date().getHours(),  // 全局堆叠值,不能超过最大值(2147483647) From: http://softwareas.com/whats-the-maximum-z-index
        uitpl        = '<table width="100%" class="ui-tpl-tab"><thead><tr><td class="ui-tpl-tl"></td><td class="ui-tpl-tc"></td><td class="ui-tpl-tr"></td></tr></thead><tbody><tr><td class="ui-tpl-ml"></td><td class="ui-tpl-mc"></td><td class="ui-tpl-mr"></td></tr></tbody><tfoot><tr><td class="ui-tpl-bl"></td><td class="ui-tpl-bc"></td><td class="ui-tpl-br"></td></tr></tfoot></table>'


    hogo.uiwindow = function(opts){
        this.init(opts);
    };
    hogo.uiwindow.prototype = {
        // 初始化
        init: function(opts){
            var me = this,
                defautls = {
                    pattern       : 'default', // 主题样式
                    title         : '消息', // 标题
                    width         : 'auto', // 宽度
                    height        : 'auto', // 高度
                    minWidth      : 'auto', // 最小宽度
                    minHeight     : 'auto', // 最小高度
                    padding       : '15px', // 内填充
                    timer         : null,   // 关闭延迟时间
                    isMax         : false,  // 是否最大化
                    isMask        : true,   // 是否遮罩
                    positionStyle : false,  // 定位类型
                    top           : 0,      // top 值
                    left          : 0,      // left 值
                    callOpen      : null,   // 打开后执行函数
                    callClose     : null,   // 关闭后执行函数
                    isDrag        : true,   // 是否拖动
                    idContent     : '',     // 内容ID
                    content       : '',     // 内容
                    full          : null,   // 是否全屏弹出
                    eventType     : null    // 打开事件类型
                };

            hogo.apply(me, opts, defautls); // 绑定参数
            me.createElement();
            this.callOpen && this.callOpen();
        },
        // 创建结构
        createElement: function(){
            var ele         = null,
                h1          = null,
                closeBtn    = null,
                subContent  = null,
                mask        = null,
                title       = this.title,
                width       = this.width,
                height      = this.height;

            this.ele = ele = hogo.createHtml('div', {
                cls  : 'ui-wrap',
                style: 'width:' + width + 'px;height:' + height + 'px;',
                html : uitpl
            });
            h1 = hogo.createHtml('h1', {
                html: title
            });
            closeBtn = hogo.createHtml('a', {
                cls  : 'ui-close',
                html : '关闭',
                title: '关闭',
                href : 'javascript:void(0)'
            });
            subContent = hogo.createHtml('div', {
                cls: 'ui-content',
                html: this.content
            });
            document.body.appendChild(ele);
            var tplTop     = ele.getElementsByTagName('thead')[0].getElementsByTagName('td')[1],
                tplContent = ele.getElementsByTagName('tbody')[0].getElementsByTagName('td')[1];

            h1.appendChild(closeBtn);
            tplTop.appendChild(h1);
            if(typeof title == 'boolean' && title == false){
                h1.style.display = 'none';
            } else if(title == true) {
                alert('请填写正确的标题！');
                return ;
            }
            tplContent.appendChild(subContent);
            tplContent.style.height = '245px';
            if(typeof this.content == 'object'){
                this.content.style.display = this.content.style.display == 'none' ? 'block' : '';
            }
            ele.style.display = 'block';
            hogo.isIE6 && (ele.style.position = 'absolute');

            this.setSize();
            this.pattern && hogo.addClass(ele, this.pattern);
            this.isMask && this.createMask();
            this.isDrag && this.setDrag(h1); // 设置拖动
            this.setZIndex();
            hogo.addEvent(closeBtn, 'click', this.close);
            cache.push(ele, this.mask); // 添加到数组中，以便多窗口弹出
        },
        // 创建遮罩
        createMask: function(){
            var mask  = null;

            this.mask = mask = hogo.createHtml('div', {
                cls   : 'ui-mask',
                style : 'width:100%;height:100%;position:fixed;'
            });
            document.body.appendChild(mask);
            hogo.addEvent(mask, 'click', this.close); // 单击遮罩可以关闭，增强用户体验
            if(hogo.isIE6){
                mask.innerHTML = '<iframe src="about:blank" style="width:100%;height:100%;position:absolute;top:0;left:0;z-index:-1;filter:alpha(opacity=0)"></iframe>';
            }

            return this;
        },
        // 设置大小
        setSize: function(){
            var ele       = this.ele,
                eleWidth  = ele.clientWidth,
                eleHeight = ele.clientHeight,
                left      = 0,
                top       = 0;

            top  = (windowHeight - eleHeight) / 2 + 'px';
            left = (windowWidth - eleWidth) / 2 + 'px';
            ele.style.top  = top;
            ele.style.left = left;

            return this;
        },
        // 设置全局堆叠值，防止z-index穿透
        setZIndex: function(){
            var i    = INDEX ++,
                ele  = this.ele,
                mask = this.mask;
            
            ele && (ele.style.zIndex   = i);
            mask && (mask.style.zIndex = i - 1);
            return this;
        },
        close: function(){
            var ele  = cache[cache.length - 2],
                mask = cache[cache.length - 1],
                content = this.content;

            if(this.content && typeof this.content == 'object'){
                document.body.appendChild(this.content.parentNode);
                this.content.style.display = 'none';
            }
            this.callClose && this.callClose();
            cache.splice(cache.length - 2, 2); // 删除数组中最后两个
            document.body.removeChild(ele);
            document.body.removeChild(mask);
        },
        // 设置拖动
        setDrag: function(handler){
            var me      = this,
                startX  = 0,
                startY  = 0,
                lastX   = 0,
                lastY   = 0,
                box     = this.ele, // handler.parentNode
                width   = hogo.viewSize.width,
                height  = hogo.viewSize.height,
                drag    = {
                    down: function(e){
                        e                    = hogo.getEvent(e);
                        handler.style.cursor = 'move';
                        startX               = e.clientX - parseInt(box.style.left);
                        startY               = e.clientY - parseInt(box.style.top);
                        this.setCapture && this.setCapture(); // IE 下防止拖动过快丢失对象
                        hogo.addEvent(document, 'mousemove', drag.move);
                        hogo.addEvent(document, 'mouseup', drag.up);
                        return false; // 防止在 chrome 下滚屏，并丢失 cursor:move 样式
                    },
                    move: function(e){
                        e                 = hogo.getEvent(e);
                        hogo.stopPropagation(e);
                        lastX             = e.clientX - startX;
                        lastY             = e.clientY - startY;
                        lastX             = Math.max(0, Math.min(width - box.clientWidth - 19, lastX));
                        lastY             = Math.max(0, Math.min(height - box.clientHeight - 2, lastY));
                        box.style.top     = lastY + 'px';
                        box.style.left    = lastX + 'px';
                        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty(); // 取消选择文本
                    },
                    up: function(){
                        handler.style.cursor = 'auto';
                        hogo.removeEvent(document, 'mousemove', drag.move);
                        hogo.removeEvent(document, 'mouseup', drag.up);
                        handler.releaseCapture && handler.releaseCapture(); // 防止拖动过快丢失对象
                    }
                };
            hogo.addEvent(handler, 'mousedown', drag.down);
        }

    }
})(hogo);

