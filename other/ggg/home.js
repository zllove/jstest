//首页js越来越多，需要整体的优化（待优化）
$(function() {
    //轮播广告
    $("#rotateTop").pubAd();
    $("#rotateBtm").pubAd();
    $("#rotateBanner").pubAd();
    $("#rotateFooter").pubAd();
    //美女左右移动
    $("#buIndex").imgSlider(5);
    //底部美女图片按需加载
    $(window).scroll(function() {
        $('#buIndex').imgLazyLoad();
    });
    //解决满足条件的预加载
    $('#buIndex').imgLazyLoad();
});//自定义事件

$(function() {
    //游戏模块的选项卡和按需加载
    $(".gameTab .pubTab li").hover(function() {
        var idx = $(this).index();
        $(this).addClass("on").siblings().removeClass("on");
        $(this).closest(".gameTab").find(".pubTabc:eq(" + (idx) + ")").show().siblings(".pubTabc").hide();
        $(".gameTab .lazy").each(function() {
            var src2 = $(this).attr("src2");
            $(this).attr("src", src2).removeAttr("src2").removeClass("lazy");
        });
    });
    //newstab
    $("#newstab .pubTab li").hover(function() {
        var idx = $(this).index();
        $(this).addClass("on").siblings().removeClass("on");
        $("#newstab").find(".pubTabc").eq(idx).show().siblings(".pubTabc").hide();
    });
    //video
    $("#videotab .toptab dd").hover(function() {
        var idx = $(this).index();
        $(this).addClass("on_tab").siblings().removeClass("on_tab");
        $("#videotab").find(".videotab").eq(idx).show().siblings(".videotab").hide();
    });
    //index left video
    $(".subTab li").hover(function() {
        var idx = $(this).index();
        $(this).addClass("on").siblings().removeClass("on");
        $("#indexVideo").find(".videoC").eq(idx).show().siblings(".videoC").hide();
    });
});//选项卡

$(function() {
    $(".gameTab figure").hover(function() {
        $(this).css("position", "relative");
        $(this).children(".gDetail").show("fast");
    }, function() {
        $(this).css("position", "");
        $(this).children(".gDetail").hide();
    });
});//游戏弹层

$(function() {
    //ranks
    $("#ranks li:odd").css('backgroundColor', '#f3f3f3');

    $("#ranks dt a, #ranks .list a").click(function() {
        var gameName = $(this).closest("li").find("a.n").text();
        _gaq.push(['_trackPageview', 'm_download_game_index_top_ginfo_' + gameName]);
        doDownload('game_top_ginfo', gameName);
    });

    $("#ranks .r a").click(function() {
        var gameName = $(this).closest("li").find("a.n").text();
        _gaq.push(['_trackPageview', 'm_download_game_index_top_' + gameName]);
        doDownload('game_top', gameName);
    });

    $("#activityBox a").live('click', function() {
        var gameName = $(this).closest("li").find("a.g").text();
        _gaq.push(['_trackPageview', 'm_download_game_index_feed_' + gameName]);
        doDownload('game_feed', gameName);
    });

    // 首页PV统计
    var event = "{\"etc\":\"p.w.pv\",\"des\":\"home\",\"c\":1}";
    $.ajax({url : '/webservice/rest/1.0/pevent',
        async : false, cache : false, type : 'POST', contentType : 'application/json', data : event});
});//部分连接统计代码的添加

$(function() {
    var size = $('#spotlight li').length;
    if (size > 5) {
        var li_w = $('#spotlight li').outerWidth([true]);
        var ul_w = size * li_w;
        var $ul = $('#spotlight ul');
        var page = size + 1;
        $ul.append($ul.html()).css({'width' : 2 * ul_w, 'left' : -ul_w});
        $('#spotlight li:eq(' + (size) + ')').addClass('on');
        $('#spotlight span.pre').click(function() {
            if (!$ul.is(':animated')) {
                var cur = $('#spotlight li.on').index();
                if (page > 2 && cur % size > 0) {
                    $('#spotlight div.on').removeClass('on').hide().prev().fadeIn().addClass('on');
                    $('#spotlight li.on').removeClass().prev().addClass('on');
                    $ul.animate({'left' : '+=' + li_w}, 'normal', 'linear');
                    page--;
                } else if (page > 2 && cur % size <= 0) {
                    $('#spotlight div.on').removeClass('on').hide();
                    $('#spotlight .panel:eq(' + (size - 1) + ')').fadeIn().addClass('on');
                    $('#spotlight li.on').removeClass().prev().addClass('on');
                    $ul.animate({'left' : '+=' + li_w}, 'normal', 'linear');
                    page--;
                } else {
                    $('#spotlight div.on').removeClass('on').hide().prev().fadeIn().addClass('on');
                    $('#spotlight li.on').removeClass('on');
                    $('#spotlight li:eq(' + (size + cur - 1) + ')').addClass('on');
                    $ul.animate({'left' : '+=' + li_w}, 'normal', 'linear', function() {
                        $ul.css("left", -ul_w);
                        page = size + 1;
                    });
                }
            }
        });
        $('#spotlight span.next').click(function() {
            if (!$ul.is(':animated')) {
                var cur = $('#spotlight li.on').index();
                if (page < 2 * size - 5 && cur % size < size - 1) {
                    $('#spotlight div.on').removeClass('on').hide().next().fadeIn().addClass('on');
                    $('#spotlight li.on').removeClass().next().addClass('on');
                    $ul.animate({'left' : '-=' + li_w}, 'normal', 'linear');
                    page++;
                } else if (page < 2 * size - 5 && cur % size >= size - 1) {
                    $('#spotlight div.on').removeClass('on').hide();
                    $('#spotlight .panel:eq(0)').fadeIn().addClass('on');
                    $('#spotlight li.on').removeClass().next().addClass('on');
                    $ul.animate({'left' : '-=' + li_w}, 'normal', 'linear');
                    page++;
                } else {
                    $('#spotlight div.on').removeClass('on').hide().next().fadeIn().addClass('on');
                    $('#spotlight li.on').removeClass('on');
                    $('#spotlight li:eq(' + (cur - size + 1) + ')').addClass('on');
                    $ul.animate({'left' : '-=' + li_w}, 'normal', 'linear', function() {
                        $ul.css("left", (5 - size) * li_w);
                        page = size - 5 + 1;
                    });
                }
            }
        });
    } else {
        $('#spotlight li:eq(0)').addClass('on');
    }
    $('#spotlight li').click(function() {
        var cur = $(this).index();
        $('#spotlight li.on').removeClass('on');
        $(this).addClass('on');
        $('#spotlight div.on').removeClass('on').hide();
        $('#spotlight .panel:eq(' + (cur % size) + ')').fadeIn().addClass('on');
    });
    //hover
    $('#spotlight').hover(function() {
        clearInterval(focusTimer);
    },function() {
        focusTimer = setInterval(function() {
            $('#spotlight span.next').click();
        }, 4000);
    }).trigger('mouseleave');
});//首页大眼睛

var resetNumber = {
    reset : 20 - 4, //20 is the total number of list items
    height : 103    //every animate height
};
(function(a) {
    jQuery.ajaxSetup({cache : false});
    $("#activityBox").load('/ajax/recent-activities.cgi', function() {
        $("#activityBox li:lt(" + (a.reset + 1) + ")").css("opacity", "0");
        setTimeout(rightNow, 1000);
    });

    var page = a.reset;

    function rightNow() {
        timer = setInterval(function() {
            if (!$('#activityBox').is(':animated')) {
                if (page > 0) {
                    $("#activityBox").animate({bottom : '-=' + a.height}, 1300, function() {
                        $("#activityBox li:eq(" + (page) + ")").animate({opacity : 1}, 500);
                        page--;
                    });
                } else {
                    clearInterval(timer);
                    jQuery.ajaxSetup({cache : false});
                    $("#activityBox").load('/ajax/recent-activities.cgi', function() {
                        page = a.reset;
                        $("#activityBox").css("bottom", -1);
                        $("#activityBox li:lt(" + (a.reset + 1) + ")").css("opacity", "0");
                        setTimeout(rightNow, 1000);
                    });
                }
            }
        }, 4000);
    }

    $("#activityBox").hover(function() {
        clearInterval(timer);
    }, function() {
        rightNow();
    });
})(resetNumber);//最新动态仿新浪效果


var topAdObj = {
    pic : document.getElementById('topAd'),
    icon : document.getElementById('fixed')
};
(function(o) {
    //第一次执行延时隐藏
    function hideTopAd() {
        $('#topAd').hide(800, function() {
            o.pic.onmouseout = function() {
                o.pic.style.display = 'none';
            }//绑定鼠标滑过的动画
            $('#fixed').fadeIn('fast');
        });
    }

    setTimeout(hideTopAd, 8000);

    var timer = 0;
    if (!o.icon) {
        return;
    }
    //显示图片
    o.icon.onmouseover = function() {
        clearTimeout(timer);
        o.pic.style.position = 'fixed';
        o.pic.style.zIndex = 99999;
        o.pic.style.display = '';

        if (!window.XMLHttpRequest) {
            o.pic.style.position = 'absolute';
        }
    }

    o.icon.onmouseout = function() {
        timer = setTimeout(function() {
            o.pic.style.display = 'none';
        }, 200);
    }

    o.pic.onmouseover = function() {
        clearTimeout(timer);
    }

    o.pic.onmouseout = function() {
        this.style.display = 'none';
    }

    //ie6下fixed属性的hack
    if (!window.XMLHttpRequest) {
        o.icon.style.position = 'absolute';
        var resizeTop = function() {
            o.icon.style.top = o.pic.style.top = Math.max(document.documentElement.scrollTop, document.body.scrollTop) + 6 + 'px';
        }
        resizeTop();
        window.onscroll = resizeTop;
    }
})(topAdObj);//首页顶部广告