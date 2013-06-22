$(function () {
        /* 创建幻灯片开始 */
        // 初始化对象
        var s = new slide();
        s.playTime = 2000; // 间隔时间
        s.duration = 800; // 播放速度
        s.easing = "easeInOutQuad"; // 自动 easing 方式
        s.clickEasing = "easeOutCubic"; // 点击时easing方式
        try {
            s.play();
        } catch (e) {
        }
        /*创建幻灯片结束*/
    }
);
/**
 * 幻灯片
 * @param playTime 播放时间
 * @param duration 延迟时间
 * @param easing easing方式
 * @param clickEasing 点击式easing方式
 */
function slide(playTime, duration, easing, clickEasing) {
    var direction = "left"; // 轮播方向
    var flag = false;
    var num = 0;
    var picList = $("#picList"); // 图片列表
    var thumb = $("#slideThumb"); // 数字列表
    var slideNum, // 数字按钮
        size, // 图片数量
        num;
    var _this = this;
    _this.playTime = playTime; // 设置切换秒数
    _this.duration = duration; // 设置滑动延迟秒数
    _this.easing = easing; // 滑动效果
    _this.clickEasing = clickEasing; // 点击时滑动效果

    /* 自动设置缩略图 */
    function setThumb() {
        size = picList.find("li").length; // 图片数量
        var links = $("#picList li a:first"); // 链接
        $("#titleBar h3 a").attr("href", links.attr("href")).html(links.attr("title")); // 把链接的 title 内容放到标题栏上显示
        var sb = new stringBuffer();
        sb.clear();
        for (var i = 1; i <= size; i++) {
            sb.append("<span class=\"slideNum\">" + i + "</span>");
        }
        thumb.html(sb.toString());
        slideNum = thumb.find(".slideNum"); // 数字按钮
        num = (slideNum.width() + parseInt(slideNum.css("margin-right")) + 2) * size + 1;
        slideNum.eq(0).addClass("active");
    }

    //幻灯基本大小设置
    function titleBar() {
        thumb.width(num + 2);
        $("#slide #picList").width(687 * size);
        $("#titleBar h3").width($("#titleBar").width() - num);
        $("#titleBar .slideNum:first").addClass("active");
    }

    //自动播放
    function autoPlay() {
        flag = setInterval(function () {
            num = $("#slideThumb").find(".active").index("#slideThumb .slideNum");
            if (direction == "left") {
                if (num == (size - 1)) {
                    direction = "right";
                    num--;
                } else {
                    num++;
                }
            } else {
                if (num == 0) {
                    direction = "left";
                    num++;
                } else {
                    num--;
                }
            }
            picList.stop().animate({"margin-left":0 - num * 687}, {duration:_this.duration, easing:_this.easing});
            slideNum.removeClass("active").eq(num).addClass("active");
            var links = $("#picList li a").eq(num);
            $("#titleBar h3 a").attr("href", links.attr("href")).html(links.attr("title"));

        }, _this.playTime);
    }

    //点击事件
    function slideEvent() {
        slideNum.click(function () {
            var thisNum = $(this).index("#slideThumb .slideNum");
            picList.stop().animate({"margin-left":0 - $(this).index("#slideThumb .slideNum") * 687}, {duration:_this.duration, easing:_this.clickEasing});
            slideNum.removeClass("active").eq(thisNum).addClass("active");
            var links = $("#picList li a").eq(thisNum);
            $("#titleBar h3 a").attr("href", links.attr("href")).html(links.attr("title"));
        });
        $("#slide").hover(function () {
            clearInterval(flag);
        }, function () {
            autoPlay();
        });
    }

    this.play = function () {
        setThumb();
        titleBar();
        if (size > 1) {
            autoPlay();
            slideEvent();
        }
    }
}

//StringBuffer功能，用于拼接字符串
function stringBuffer() {
    this._strings = new Array();
}
stringBuffer.prototype.append = function (str) {
    this._strings.push(str);
}
stringBuffer.prototype.toString = function () {
    return this._strings.join("");
}
stringBuffer.prototype.clear = function () {
    this._strings = [];
}