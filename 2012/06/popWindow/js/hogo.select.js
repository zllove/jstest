/**
 * @description: hogo JavaScript Util
 * @see: <a href="mailto:jikeytang@gmail.com">zyh</a>
 * @since:version 0.1
 */
;
(function(hogo){
    hogo.select = function(opts){
        this.init(opts);
    };
    hogo.select.prototype = {
        init: function(opts){
            var me = this,
                defautls = {
                    selected   : '', // 默认select
                    showNode   : '', // 显示的node
                    wrap       : '', // 外部包裹node
                    cssName    : '', // ul 列表 className
                    hoverClass : ''  // li 经过 className
                };
            hogo.apply(me, opts, defautls); // 绑定参数
            me.createElement();
        },
        createElement: function(){
            var me        = this,
                selected  = hogo.id(me.selected),
                showNode  = hogo.id(me.showNode),
                wrap      = hogo.id(me.wrap),
                options   = selected.getElementsByTagName('option'),
                oUl       = hogo.createHtml('ul', {
                    cls: me.cssName
                }),
                oLi       = null,
                i         = 0,
                len       = 0,
                handler   = {
                    // 鼠标经过
                    over: function(e){
                        e = hogo.getEvent(e);
                        var target = hogo.getTarget(e);
                        hogo.addClass(target, me.hoverClass);
                    },
                    // 鼠标移出
                    out: function(e){
                        e = hogo.getEvent(e);
                        var target = hogo.getTarget(e);
                        hogo.removeClass(target, me.hoverClass);
                    },
                    // 点击选项
                    click: function(e){
                        e = hogo.getEvent(e);
                        var target = hogo.getTarget(e);
                        showNode.innerHTML = target.innerHTML;
                        selected.value = showNode.innerHTML; // 更改默认select的value值，以便于后期取值
                        oUl.style.display = 'none';
                        hogo.stopPropagation(e);
                    },
                    // 键盘控制
                    down: function(e){
                        e = hogo.getEvent(e);
                        var key = e.which ? e.which : e.keyCode;
                        var target = e.srcElement || e.target;
                        /*
                        if(key == 40 || key == 38 || key == 36 || key == 35){
                            return false;
                        }
                        */
//                        hogo.removeEvent(document, 'keydown');
                        console.log(target.tagName);
                        switch(key){
                            case 9: // tab
                                return true;
                                break;
                            case 13: // enter
                                me.clearSelect();
                                break;
                            case 27: // esc
                                me.clearSelect();
                                break;
                            case 33: // page up
                                me.keyDownHandler();
                                break;
                            case 34: // page down
                                me.keyDownHandler();
                                break;
                            case 35: // end
                                me.keyDownHandler();
                                break;
                            case 36: // home
                                me.keyDownHandler();
                                break;
                            case 38: // up
                                hogo.preventDefault(e);
                                me.keyDownHandler();
                                break;
                            case 40: // down
                                hogo.preventDefault(e);
                                break;
                            default:
                                hogo.preventDefault(e);
                                break;
                        }
                    }
                },
                showEvent = {
                    showClick: function(e){
                        oUl.style.display = 'block';
                        e = hogo.getEvent(e);
                        hogo.stopPropagation(e);
                    },
                    winClick: function(){
                        oUl.style.display = 'none';
                    }
                };

            showNode.innerHTML = selected.value;
            for (len = options.length; i < len; i++) {
                oLi = hogo.createHtml('li', {
                    html:options[i].value,
                    'tabindex': i
                });
                hogo.addEvent(oLi, 'mouseover', handler.over);
                hogo.addEvent(oLi, 'mouseout', handler.out);
                hogo.addEvent(oLi, 'click', handler.click);
                oUl.appendChild(oLi);
            }
            wrap.appendChild(oUl);

            hogo.addEvent(showNode, 'click', showEvent.showClick); // 单击入口
            hogo.addEvent(document, 'keydown', handler.down);
            hogo.addEvent(document, 'click', showEvent.winClick); // 单击空白处时，隐藏选项
        },
        // 绑定键盘事件
        clearSelect: function(){

        },
        keyDownHandler: function(){
            console.log('keyDownHandler');
        }
    };
    
})(hogo);