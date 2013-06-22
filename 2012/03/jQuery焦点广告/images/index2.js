$(function () {
    //生成下部小按钮
    var length = $('#slideshow_photo a').length;
    for (var i = 0; i < length; i++) {
        $('<span index="' + (length - i) + '"></span>').appendTo('#slideshow_footbar'); // 添加右小角小标识
    }
    $('#slideshow_footbar span:last').addClass('active'); // 添加当前支持
    $('#slideshow_footbar span').mouseenter(function(e) { // 如果鼠标进入则跳转到这个画面
        slideTo(this);
    });
    var indexAllowAutoSlide = true; // 自动切换标识
    $('#slideshow_wrapper').mouseenter(function() { // 如果鼠标进入则停止自动播放
        indexAllowAutoSlide = false;
    }).mouseleave(function() {
        indexAllowAutoSlide = true;
    });
    // 自动播放
    setInterval(function() {
        if (indexAllowAutoSlide) {
            slideDown();
        }
    }, 3000);
});
// 自动播放
function slideDown() {
    var currentBt = $('#slideshow_footbar .active');
    if (currentBt.length <= 0) return;
    var nxt = currentBt.get(0).previousSibling; // 上一个节点 (就是下一个节点, 由于布局的不合理性造成float:right纵排，所以取上一个即是下一个)
    slideTo(nxt ? nxt : $('#slideshow_footbar span:last').get(0)); // 最后一个 (其实是第一个)
}
// 轮播到
function slideTo(o) {
    if (!o) return;
    var currentIndex = $('#slideshow_footbar span.active').attr('index'), // 右下角当前的标识位
        current = $('#slideshow_photo a[index=' + currentIndex + ']'); // 图片当前位置
    var next = $('#slideshow_photo a[index=' + $(o).attr('index') + ']');
    if (currentIndex == $(o).attr('index')) return;
    if (next.find('img[imgsrc]').length > 0) { // 选取拥有imgsrc属性的元素
        var img = next.find('img[imgsrc]');
        img.attr('src', img.attr('imgsrc')).removeAttr('imgsrc');
    }
    $('#slideshow_footbar').find('span').removeClass('active');
    $(o).addClass('active');
    next.css('z-index', 2);
    current.css('z-index', 3).fadeOut(2000, function () {
        $(this).css('z-index', '1').show();
        var img = next.next('a').find('img[imgsrc]');
        if (img.length > 0) {
            img.attr('src', img.attr('imgsrc')).removeAttr('imgsrc');
        }
    });
}
//slideshow end
