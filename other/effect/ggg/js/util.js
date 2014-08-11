/**
 * User: Administrator
 * Date: 12-9-7
 * Time: 上午9:11
 */
var ggg = {};
ggg.base = {
    supportHTML5: function(){
        var input = document.createElement('input');
        var support_placeholder = 'placeholder' in input;
        if(!support_placeholder){
            $(':input[placeholder]').each(function(){
                var that = $(this);
                if(that.val() === ''){
                    that.val(that.attr('placeholder'));
                }
                that.focus(function(){
                    if(that.val() === that.attr('placeholder')){
                        that.val('');
                    }
                }).blur(function(){
                    if(that.val() === ''){
                        that.val(that.attr('placeholder'));
                    }
                });
            });
        }
        var support_autofocus = 'autofocus' in input;
        if(!support_autofocus){
            $('input[autofocus]').eq(0).focus();
        } else {
            $('input[autofocus]').eq(0).val('');
        }
    },
    jumpURL: function (url){
        location.href = url;
    }
}
ggg.cookie = {
    setCookie: function(){
    },
    getCookie: function(){
    },
    delCookie: function(){
    }
};
(function($){
    $.fn.extend({
        imgSlider: function(options){
            var defaults = {
                    num: 3,
                    speed: 3 // 速度
                },
                that     = $(this),
                size     = that.find('li').length,
                timer    = 0,
                opts     = $.extend({}, defaults, options),
                n        = opts.num;

            if(size > n){
                var page = size + 1, // 页数
                    li_w = that.find('li').outerWidth(),
                    ul_w = li_w * size,
                    ul   = that.find('ul');
                    ul.append(ul.html()).css({'width': 2 * ul_w, 'marginLeft': - ul_w}); // 为了是pre时有图片

                that.find('.sliderNext').bind('click', function(){
                    if(!ul.is(':animated')){
                        if(page < 2 * size - n){ //
                            ul.animate({'marginLeft': '-=' + li_w}, 'slow', 'linear');
                            page ++;
                        } else {
                            ul.animate({'marginLeft': '-=' + li_w}, 'slow', 'linear', function(){
                                ul.css('marginLeft', (n - size) * li_w);
                                page = (size - n) + 1;
                            });
                        }
                    }
                });
                that.find('.sliderPre').bind('click', function(){
                    if(!ul.is(':animated')){
                        if(page > 2){
                            ul.animate({'marginLeft': '+=' + li_w}, 'slow', 'linear');
                            page --;
                        } else {
                            ul.animate({'marginLeft': '+=' + li_w}, 'slow', 'linear', function(){
                                ul.css('marginLeft', - ul_w);
                                page = size + 1;
                            });
                        }
                    }
                });
                that.hover(function(){
                    clearInterval(timer);
                }, function(){
                    timer = setInterval(function(){
                        that.find('.sliderNext').click();
                    }, opts.speed * 1000);
                }).trigger('mouseleave');
            }
        },
        imgAd: function(){
            var that = $(this),
                k    = 0;
            function auto(){
                var len = that.find('li').length - 1;
                if(len <= k){
                    that.find('li').eq(0).fadeIn(1200).siblings().fadeOut(1200);
                    k = 0;
                } else {
                    that.find('li').eq(k + 1).fadeIn(1200).siblings().fadeOut(1200);
                    k ++;
                }
                setTimeout(auto, 2000);
            }
            auto();
        },
        myImgLoad: function(){
            var that    = $(this),
                pageTop = 0,
                src     = '';

            if(that.hasClass('imgLazyLoad')){
//                pageTop = $(document).scrollTop() + $(window).height();
                pageTop = document.documentElement.clientHeight + Math.max(document.documentElement.scrollTop, document.body.scrollTop) + 500;
                console.log(pageTop);
                if(that.offset().top <= pageTop){
                    that.find('img').each(function(){
                        src = $(this).attr('loadsrc');
                        $(this).attr('src', src).removeAttr('loadsrc');
                        that.removeClass('imgLazyLoad');
                    });
                }
            }
        }
    });
})(jQuery);