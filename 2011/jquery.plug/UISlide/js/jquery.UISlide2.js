/**
 * Copyright (c) 2011 Jikeytang (http://jikey.cnblog.com/)
 * Version: 0.0.1
 * Demo: http://jikey.cnblog.com/
 */
;(function($){
    // 图片轮播插件
    $.fn.UISlide = function(options){
        var defaults = {
            playTime    :3000,            // 间隔时间
            duration    :800,             // 延迟时间
            direction   :'left',          // 方向
            easing      :'easeInOutQuad', // 自动播放时 easing 方式
            clickEasing :'easeOutCubic',  // 点击时 easing 方式
            pattern     :'scroll'
        };
        var opts = $.extend({}, defaults, options); // 参数合并
        var slide = {
            // 播放调用及一些变量的初始化
            play: function(opts, me){
                var that = this,
                    isPlay;
                that.me       = me;
                that.picList  = me.find('ul');            // 图片列表
                that.title    = me.find('div').find('a'); // 图片标题
                that.oNum     = me.find('dl');            // 数字按钮
                that.lis      = that.picList.find('li');  // li
                that.size     = that.lis.length;          // 图片的数量
                that.lisWidth = that.lis.width();
                that.isPlay   = isPlay;                   // 是否自动播放
                for (var p in opts) {                     // opts 绑定到 slide
                    that[p] = opts[p];
                }
                that.setNums().setTitle();
                if(that.pattern == 'fade'){
                    that.lis.css({position: 'absolute', top: 0, left: 0});
                    that.lis.css('z-index', 1);

                }
                // 如果图片数量大于则轮播
                that.size > 1 && that.autoPlay().slideEvent();
            },
            // 设置按钮
            setNums: function(){
                var that = this,
                    links,               // 图片的链接
                    me = that.me,
                    size = that.size,
                    oNum = that.oNum,   // 按钮对象
                    arrTemp = [];
                links = that.picList.find('a').first();
                that.title.html(links[0].title).attr('href', links[0].href); // 把链接的 title 内容放到标题栏上显示
                for(var i=1; i<=size; i++){ // 借鉴司徒正美兄： http://www.cnblogs.com/rubylouvre/archive/2009/07/24/1530264.html 的写法
                    arrTemp.push('<dd>' + i + '</dd>');
                }
                oNum.append(arrTemp.join(''));
                that.slideNum = oNum.find('dd');
                that.numWidth  = (that.slideNum.width() + parseInt(that.slideNum.css('margin-right')) + 2) * size + 1; // 数字按钮宽度
                that.setTitle(); // 底部图片标题设置
                return that;
            },
            // 自动播放
            autoPlay: function(){
                var that = this,
                    activePos,
                    direction = that.direction,
                    picList = that.picList,
                    slideNum = that.slideNum,
                    playTime = that.playTime;
                that.isPlay = setInterval(function (){
                    activePos = that.oNum.find('.active').index(); // 在数字按钮中找到当前活动标签的所在位置
//                    console.log('size', that.size);
                    if(activePos < (that.size - 1)){
//                        direction = 'right';
                        activePos ++;
                    } else if(activePos == (that.size - 1)){
                        activePos = 0;
                    } else{
                        activePos --;
                    }
                    if(that.pattern == 'scroll'){
                        picList.stop().animate({'margin-left': 0 - activePos * (that.lisWidth + 3)}, {duration: that.duration, easing: that.easing});
                    } else {
                        that.lis.stop().animate({opacity: 0}, {duration: that.duration, easing: that.easing});
                        that.lis.eq(activePos).stop().animate({opacity: 1}, {duration: that.duration, easing: that.easing});
                    }
                    slideNum.removeClass('active').eq(activePos).addClass('active');
                    var links = picList.find('a').eq(activePos);
                    that.title.html(links[0].title).attr('href', links[0].href);
                }, playTime);
                return that;
            },
            // 设置标题
            setTitle: function(){
                var that = this;
                that.oNum.width(that.numWidth + 2); // 设置数字按钮宽度
                that.picList.width((that.lisWidth + 3) * that.size); // 设置图片容器总宽度
                that.slideNum.first().addClass('active');
                return that;
            },
            // 绑定数字按钮事件
            slideEvent: function(){
                var that = this,
                    slideNum = that.slideNum;
                slideNum.click(function(){
                    var thisNum = $(this).index();
                    if(that.pattern == 'scroll'){
                        that.picList.stop().animate({"margin-left":0 - thisNum * (that.lisWidth + 3)}, {duration:that.duration, easing:that.clickEasing});
                    } else {
                        that.lis.stop().animate({opacity: 0}, {duration: that.duration, easing: that.easing});
                        that.lis.eq(thisNum).stop().animate({opacity: 1}, {duration: that.duration, easing: that.easing});
                    }
                    slideNum.removeClass('active').eq(thisNum).addClass('active');
                    var links = that.picList.find('a').eq(thisNum);
                    that.title.html(links[0].title).attr('href', links[0].href);
                });
                // 鼠标到画面中任意位置，停止播放
                that.me.hover(function(){
                    clearInterval(that.isPlay);
                }, function(){
                    that.autoPlay();
                })
                return that;
            }
        };
        return this.each(function(){ // $(a,b) 方式调用
            slide.play(opts, $(this));
        });
    }
})(jQuery);
