/**
 * Tencent hdPic v0.0.1
 * Author: curls
 */

String.prototype.realLength = function(){
    return this.replace(/[^\x00-\xff]/g,"**").length;
};

String.prototype.cut = function(limit){
    if(this.realLength() <= limit) return this;
    var len = Math.min(this.length, limit);
    var tmp = '';
    for(var i=len; i>=0; --i){
        var tmp = this.substring(0, i);
        if(tmp.realLength() <= limit) return tmp;
    }
    return tmp;
};

//脚本加载器
function loadJs(file, callback){
    var _doc = document.getElementsByTagName('head')[0];
    var js = document.createElement('script');
    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', file);
    _doc.appendChild(js);
    if (!/*@cc_on!@*/0) {
        js.onload = function () {
            callback();
        }
    } else {
        js.onreadystatechange = function () {
            if (js.readyState == 'loaded' || js.readyState == 'complete') {
                js.onreadystatechange = null;
                callback && callback();
            }
        }
    }

    return false;
}

/**
 * 图片头数据加载就绪事件 - 更快获取图片尺寸
 * @param	{String}	图片路径
 * @param	{Function}	尺寸就绪
 * @param	{Function}	加载完毕 (可选)
 * @param	{Function}	加载错误 (可选)
 * @example imgReady(url, function () {
		alert('size ready: width=' + this.width + '; height=' + this.height);
	});
 */
var imgReady = (function () {
    var list = [], intervalId = null,

    // 用来执行队列
        tick = function () {
            var i = 0;
            for (; i < list.length; i++) {
                list[i].end ? list.splice(i--, 1) : list[i]();
            };
            !list.length && stop();
        },

    // 停止所有定时器队列
        stop = function () {
            clearInterval(intervalId);
            intervalId = null;
        };

    return function (url, ready, load, error) {
        var onready, width, height, newWidth, newHeight,
            img = new Image();

        img.src = url;

        // 如果图片被缓存，则直接返回缓存数据
        if (img.complete) {
            ready.call(img);
            load && load.call(img);
            return;
        };

        width = img.width;
        height = img.height;

        // 加载错误后的事件
        img.onerror = function () {
            error && error.call(img);
            onready.end = true;
            img = img.onload = img.onerror = null;
        };

        // 图片尺寸就绪
        onready = function () {
            newWidth = img.width;
            newHeight = img.height;
            if (newWidth !== width || newHeight !== height ||
                // 如果图片已经在其他地方加载可使用面积检测
                newWidth * newHeight > 1024
                ) {
                ready.call(img);
                onready.end = true;
            };
        };
        onready();

        // 完全加载完毕的事件
        img.onload = function () {
            // onload在定时器时间差范围内可能比onready快
            // 这里进行检查并保证onready优先执行
            !onready.end && onready();

            load && load.call(img);

            // IE gif动画会循环执行onload，置空onload即可
            img = img.onload = img.onerror = null;
        };

        // 加入队列中定期执行
        if (!onready.end) {
            list.push(onready);
            // 无论何时只允许出现一个定时器，减少浏览器性能损耗
            if (intervalId === null) intervalId = setInterval(tick, 40);
        };
    };
})();

var hdPic = window.hdPic = function(p){
    return hdPic.fn.init(p);
};
hdPic.fn = hdPic.prototype = {
    _tmpArray: [],
    _lastUrl: "",
    _lastTitle: "",
    _isgoOn: false,
    _coentArray: "",
    _pageNow: 0,
    _pageOld: 0,
    _isMove: false,
    _dragx: 0,
    _isAuto: false,
    _autoTimer: null,
    _nowSrc: new Image(),
    _preloadN: new Image(),
    _preloadP: new Image(),
    _sourName: "",
    _sourUrl: "",
    _pubTime: "",
    _siteName: "",
    _siteLink: "",
    _isPic: true,
    _isCiment: false,
    _aid: 0,
    _siteEname: "news",
    _auth: "",
    _specificID: "",
    _record: false,
    _clickSum: 0,
    _tempTime: null,
    _isDoc: false,
    _isAD: false,
    _AD_id: '',
    _listLen: 7,
    _timer: null,
    _infoHeight: 120, // 图注高度

    _getReady: function(){//大图首次载入ready，初始化播放器区域高度，图片切换效果、hover效果
        if($("#Main-D").css("display")=="block"){
            $("#Main-D").fadeTo('slow',1).fadeTo('slow',0.2).fadeTo('slow',1);
        }
        $("#Main-C").fadeTo('slow',1).fadeTo('slow',0.2).fadeTo('slow',1);
    },

    nowSite: function(){
        var siteName = window.location.href, siteN=siteName.match(/http:\/\/([^\/]+)\//i)[1], nowSite=siteN.split(".")[0];
        return nowSite;
    },
    secondSite : function(){
        var siteName = window.location.href, siteN=siteName.match(/http:\/\/([^\/]+)\//i)[1], secondSite=siteN.split(".")[1];
        return secondSite;
    },
    _createAD: function(){
        var _this = this;
        var lastAD = $('#lastAD'), html = '';
        var isShowAD = false;
        if(this.nowSite() == 'news' && hdPic.fn._isShowLastAD && hdPic.fn._isShowLastAD == 1){
            isShowAD = true;
        }
        if(NoLastAD.indexOf(_this.nowSite())==-1 || isShowAD ){
            this._AD_id = 'gaoqing_F_N_pic';
            html = '<div id="gaoqing_F_N_pic" style="width:564px;height:362px;" class="l_qq_com"></div>';
        }else{
            $.each(LastADSet, function(o){
                if(this.split('|')[0] == _this.nowSite()){
                    html = '<div id="' + this.split('|')[1] + '" style="width:564px;height:362px;" class="l_qq_com"></div>';
                    _this._AD_id = this.split('|')[1];
                }
            });
        }
        lastAD.html(html);
    },
    _buttonAD: function(){
        var _this = this, mainC = $('#Main-C'), BtnAdSite = '',//显示Button广告的频道
            _buttonAdHtml = '<div class="smallPic-wrap">'+
                '<div class="smallPic">'+
                '<a href="javascript:void(0);" onfocus="this.blur()" class="left" id="goleft"></a>'+
                '<div class="left" id="SmallWarp">'+
                '<ul id="Smailllist"> loading.. </ul>'+
                '<a href="javascript:void(0)" onfocus="this.blur()" class="mask"></a>'+
                '</div>'+
                '<a href="javascript:void(0);" onfocus="this.blur()" class="right" id="goright"></a>'+
                '</div>'+
                '<div class="scrollLine"><span class="scrollButton"></span></div>'+
                '</div>'+
                '<div class="smallPic-AD" id="smallPic-AD"><div id="gaoqing_F_slt_button"></div></div>';

        if(new RegExp(_this.nowSite(), 'gi').test(BtnAdSite)){
            mainC.html(_buttonAdHtml);
            mainC.addClass('btnAd');
            crystal.request('gaoqing_F_slt_button');
            this._listLen = 5;
        }else{
            mainC.addClass('noBtnAd');
            this._listLen = 7;
        }

    },
    _lastAD: function(data,siteN){
        var _self = this, lastAD = $('#lastAD');
        $("#lastAD").css({'left':'30px','top':'188px','z-index':'999'});

        $('#enterPicSite').attr('href', siteLink);
        $('#endAD').html('<a href="' + ad_last_r.url + '" target="_blank"><img src="' + ad_last_r.pic + '" /></a>');

        //调查问卷
        $('.endMain .hd').append('<a style="position:absolute; right:305px; top:30px; color:#cd0000" href="http://exp.qq.com/ur/?urid=8198#page=0" target="_blank" class="active">新版高清页邀您反馈  您的意见很重要</a>');

        setTimeout(function(){//末页推荐延迟100ms
            _self._showLast(data,siteN);
            if(_self._AD_id){
                $("#lastAD").css('display','block');//准备好广告位
                crystal.getArea(_self._AD_id).invoke('open');
            }
        },100);
    },
    _insetAD: function(){
        var _this = this, insetAD = $('#insetAD'), NoInsetAdSite = 'news, finance, house',//不显示插页广告的频道
            _insetAdHtml = '<div id="gaoqing_F_gqfycb" style="width:564px;height:362px;display:none;" class="l_qq_com"></div>';
        if(NoInsetAdSite.indexOf(_this.nowSite()) == -1 && _this.secondSite() != 'house'){
            insetAD.html(_insetAdHtml);
        }
    },
    _getLast: function(data){//末页推荐
        //console.log('_getLast');
        var siteName = window.location.href;
        var siteN=siteName.match(/http:\/\/([^\/]+)\//i)[1];
        this._lastAD(data,siteN);
    },
    _showLast: function(data,siteN){
        //console.log('_showLast');
        this.AD = true;
        var h = $(window).height()/2 - 40;
        $("#Main-A").height($("#Main-A").height());
        $("#end").css({top: h}).animate({opacity: 1}, 'slow', function(){
            $("#end").css({opacity: ''})
        });
        $(".endSider h2").html($(".title h1").html());
        $("#replayPic").bind("click",function(){
            hdPic.fn._hideLast();
            hdPic.fn._pageNow = 0;
            hdPic.fn._showBig(data,hdPic.fn._pageNow);
        });

        this._showMask();

        $("a.lastClose").bind("click",function(){
            hdPic.fn._hideLast();
            //hdPic.fn._showBig(data,hdPic.fn._pageNow);
        });

        //末页脚本
        if(this._lastData && this._lastData.length === 0) { this._lastArr(); $('#end').show() }

        //曝光
        var para = {
            qq: _cookie("uin") ? Number(_cookie("uin").substring(1)) : '',
            sBiz: 'qqFB',
            iTy: 1604,
            sOp: 'EXgqFB',
            sUrl: escape(location.href)
        }
        bossHD(para)

        if(siteN.split(".")[0] == "finance" || siteN.split(".")[0] == "kid"){
            $("#lastAD").hide();
        }else{
            setTimeout(function(){//5s后判断广告层是否存在
                $("#lastAD").hide();
            },5000);
        }
    },
    _hideLast: function(){//隐藏末页推荐
        var _this = this;this._isAD = false;
        $("#end").animate({opacity: 0}, 'fast', function(){
            $("#end").css({top: '-999px'});
        });
        this._hideMask();
    },
    _lastTmpl: '<li bosszone="gqRe{N}"><a href="{url}#pref=hdpicture" target="_blank"><img src="{imgUrl}" title="{title}" /></a><a class="lastTxt" bosszone="gqRe{n}" href="{url}#pref=hdpicture" target="_blank" title="{title}">{shortTitle}</a></li>',
    _formatTmpl: function(obj, html, n){
        var str = html.replace(/\{([^\}]+)\}/gi, function(m, r){
            switch(r){
                case 'N':
                    return (n > 3) ? 2 : 1;
                case 'n':
                    return n;
                case 'url':
                    return obj.Url;
                case 'title':
                    return obj.Title;
                case 'shortTitle':
                    return obj.Title.realLength() > 40 ? (obj.Title.cut(38) + '…') : obj.Title;
                case 'imgUrl':
                    return obj.ImgUrl;
            }
        });
        return str;
    },
    _lastData : [],
    _lastArr: function(){
        var _this = this, arr = window['lastPic_hd'] || [], _this = this, i = 0, lastData, len;
        arr = arr.concat(lastPic_hd_4);
        arr.splice(4, arr.length - 4);

        lastData = arr.concat(lastPic_hd_8);

        len = lastData.length;

        for(i = 0; i < len; i++){
            _this._lastData.push(_this._formatTmpl(lastData[i], _this._lastTmpl, i));
        }
        $('#listCon').html(_this._lastData.join(''));
    },
    _delay: 0,
    _clickleft: function(data){
        var t = new Date().getTime();
        if(t - this._delay > 200 ) {
            if(hdPic.fn._pageNow>0){
                $('#BtnLeft').show();
                hdPic.fn._pageNow--;
                if(hdPic.fn._pageNow == 0) $('#BtnLeft').hide();
                hdPic.fn._showBig(data,hdPic.fn._pageNow);
            }else{
                hdPic.fn._pageNow = 0;

                return;
            }
            this._delay = t;
        }
    },
    _clickright: function(data){
        var t = new Date().getTime();
        if(t - this._delay > 200){
            if(hdPic.fn._pageNow < data.length - 1){
                this._isAD = false;
                hdPic.fn._pageNow++;
                $('#BtnLeft').show();
                hdPic.fn._showBig(data,hdPic.fn._pageNow);
            }else{
                var left1 = 131*(hdPic.fn._tmpArray.length - 7), left2 = parseInt($("#Smailllist").css('left'));
                if(!this._isAD) { this._getLast(data);this._isAD = true;}

            }
            this._delay = t;
        }
    },
    _clickListLeft: function(){
        this._listMove(1);

    },
    _clickListRight: function(){
        this._listMove(2);

    },
    _listMove: function(n){

        var wrap = $('#SmallWarp'), list = $('#Smailllist'), lw = list.width(), w = wrap.width(),wLi = 150, l = parseInt(list.css('left'));
        if( list.is(":animated")) return;

        if(n == 2 && Math.abs(l) + w < lw){
            if(150*(hdPic.fn._pageNow+1) + w >= list.width()){
                list.animate({left: '-' + (list.width() - w)}, 'slow', 'swing', function(){});
            }
            else{
                list.animate({left: '-' + (Math.abs(l) + w)}, 'slow', 'swing', function(){});
            }
        }
        if(n == 1 && l < 0){
            list.animate({left: (l + w > 0 ? 0 : (l + w))}, 'slow', 'swing', function(){});
        }
    },

    _bindClick: function(data){//为各种按钮绑定事件、拖拽浏览、快捷键、页面初始焦点
        var _this = this;
        $("#Smailllist li").each(function(i){
            $(this).click(function(){
                hdPic.fn._showBig(data, i);
            })
        });
        $("#BtnRight").bind('click',function(){
            hdPic.fn._clickright(data);

        });
        $("#goright").bind('click',function(){
            hdPic.fn._clickListRight();
        });
        $("#BtnLeft").bind('click',function(){
            hdPic.fn._clickleft(data);
        });
        $("#goleft").bind('click',function(){
            hdPic.fn._clickListLeft();
        });

        $('#mouseMask').bind('click', function(){

            if ($(this).hasClass("cursor-left")){
                hdPic.fn._clickleft(data);
            }
            if ($(this).hasClass("cursor-right")){
                hdPic.fn._clickright(data);
            }

            //boss
            var b = $(this).attr('bosszone');
            if(registerZone2) registerZone2({bossZone: b, url: ''}, 1);


        });

        $('#mouseMask').bind('mousemove', function(event){
            var w = $('#Main-A').width()/2, X = $('#Main-A').offset().left,
                x = event.pageX;
            if(x - X >= w){
                $(this).get(0).className = 'cursor-right';
                $('#BtnRight').css({visibility: 'visible'});
                $('#BtnLeft').css({visibility: 'hidden'});
                $(this).attr('bosszone', 'gqRight');
            }else{
                $(this).get(0).className = 'cursor-left';
                $('#BtnLeft').css({visibility: 'visible'});
                $('#BtnRight').css({visibility: 'hidden'});
                $(this).attr('bosszone', 'gqLeft');
            }
        });

        //快捷键
        $(document).bind("keydown",function(e){
            e = window.event || e;
            e.keyCode == 37 && hdPic.fn._clickleft(data);
            e.keyCode == 39 && hdPic.fn._clickright(data);
        });
        //首页滚动定位
        //var _topnav = $(".body").offset().top + 'px';
        //$('body').animate({scrollTop: _topnav}, 1000);

        //_createHtml
        $(window).resize(function(){
            clearTimeout(_this._timer);
            _this._timer = setTimeout(function(){
                _this._createHtml(_this._pageNow);
                _this._zoom(hdPic.fn._tmpArray[_this._pageNow]);
                setTimeout(function(){
                    _this._TxtScroll();
                }, 200);
            }, 200);

        });
        this._bindTxt();

    },
    _replaceTitle: function(){//修正标题bug
        var originalTitle = document.title.split("#")[0];
        try {
            document.attachEvent('onpropertychange', function (evt) {
                if(evt.propertyName === 'title' && document.title !== originalTitle) {
                    setTimeout(function () {
                        document.title = originalTitle;
                    }, 1);
                }
            });
        } catch (e) {
            // noop
        }
        document.title = originalTitle;
    },
    _showtit: function(n){//设置图片图注显示
        var sours = hdPic.fn._sourUrl !== "" ? "<a href='" + hdPic.fn._sourUrl + "' target='_blank'>" + hdPic.fn._sourName + "</a>":"<span>" + hdPic.fn._sourName + "</span>";
        var author = hdPic.fn._auth !== "" ? "<span style='padding-left:13px;padding-right:0px;'>" + hdPic.fn._auth + "</span>" : "";
        var cur = n + 1;
        $("#time_source").html('<span>' + hdPic.fn._pubTime + '</span>' + sours + '' + author);
        $('#curNum').html(cur);
        if(this._tmpArray[n].showtit){
            $('#infoCon').show();
            $("#infoTxt").html('<p>' + this._tmpArray[n].showtit + '</p>');//图注装载
            $('#Info').css({background: 'rgba(245, 245, 245, 0.6)', 'filter': 'progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#DDf5f5f5,endColorstr=#DDf5f5f5);'});
            $('#infoNum').css({bottom: '60px'});
            $('#closedTxt').show();
        }else{
            $('#infoCon').hide();
            $("#infoTxt").html('');//图注装载
            $('#Info').css({backgroundColor: 'transparent', 'filter': 'none'});
            $('#infoNum').css({bottom: '10px'});
            $('#closedTxt').hide();
        }


    },
    _delScroll: function(){
        $("#infoTxt").css({marginTop : 0});
        $('#t_scroll').css({top: 0});
    },
    _btnTxt: $('#closedTxt').attr('class'),
    _bindTxt: function(){
        var _this = this;
        var infoTxtWrap = $('#infoTxtWrap'), n;

        $('#closedTxt').bind('click', function(){

            var c = $(this).attr('className');

            if(c.match(/t_close/g)){
                $(this).removeClass('t_close').addClass('t_open').html('显示图注<i></i>');
                infoTxtWrap.slideUp("slow");
                n = 2;
            }

            if(c.match(/t_open/g)){
                $(this).removeClass('t_open').addClass('t_close').html('隐藏图注<i></i>');
                infoTxtWrap.slideDown("slow");
                n = 1;
            }
            _cookie('btnTxt', n, 30, '', 'qq.com');
            _this._btnTxt = $('#closedTxt').attr('class');

            //boss
            if(registerZone2) registerZone2({bossZone: 'gqTuzhu', url: ''}, 1);

        });
    },
    _startDrag: function(btn){
        var _move = false; //移动标记
        var _x,_y; //鼠标离控件左上角的相对位置
        var wH = $('#t_scroll_wrap').height(), bH = btn.height(), txt = $('#infoTxt'), cH = txt.height();

        btn.click(function(){
        }).mousedown(function(e){
                _move=true;
                //_x=e.pageX-parseInt(btn.css("left"));
                _y=e.pageY-parseInt(btn.css("top"));
                btn.fadeTo(20, 0.5); //点击后开始拖动并透明显示
                return false;
            });
        $(document).mousemove(function(e){
            if(_move){
                //var x=e.pageX-_x; //移动时根据鼠标位置计算控件左上角的绝对位置
                var y=e.pageY-_y;
                drag(y);

            }
        }).mouseup(function(){
                _move=false;
                btn.fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
            });

        function drag(y){
            if(y <= 0){
                y = 0;
            }else if( y >= (wH - bH)){
                y = (wH - bH)
            }

            btn.css({top:y});//控件新位置

            var scale = y/(wH - bH);

            txt.css({marginTop: (wH - cH)*scale});
        }

        $('#infoTxtWrap').bind('mousewheel', function(e){
            if($('#t_scroll_wrap').css('display') == 'none') return;
            //console.log(e.wheelDelta);
            var y = parseInt(btn.css('top'));
            if(e.wheelDelta < 0){
                y += 2;
            }else{
                y -= 2;
            }
            drag(y);
            return false;
        });

        $('#infoTxtWrap').bind('DOMMouseScroll', function(e){

            //console.log(e.detail);
            var y = parseInt(btn.css('top'));
            if(e.detail > 0){
                y += 2;
            }else{
                y -= 2;
            }
            drag(y); 
            return false;
        });

    },
    _TxtScroll: function(){
        var _this = this, wrapH = $('#infoCon').height(), conH = $('#infoTxt').height(), srcoll = $('#t_scroll_wrap'), btn = $('#t_scroll');
        var vH = conH - wrapH, v = vH/wrapH;
        _this._delScroll();
        if(vH > 0){
            srcoll.css({height: wrapH});

            srcoll.show();
            hdPic.fn._startDrag(btn);
        }else{
            srcoll.hide();
        }

    },
    _creatUrl: function(n){//创建组图浏览url标识
        var _org = /\#p\=/i.test(window.location.href);
        if(!_org){
            window.location.href = window.location.href+"#p=1";
        }else{
            window.location.href = window.location.href.split("#p=")[0] + "#p="+parseInt(n+1);
        }
    },
    _getUrl: function(){//获得组图url标识
        var str = window.location.href.toString(), pos = str.indexOf("#p=");
        var nub = 1;
        if(pos !== -1){
            nub = str.match(/\#p\=(\d{1,})/i)[1];
            nub = nub >= this._tmpArray.length ? this._tmpArray.length : nub;
        }
        this._pageOld = nub;
        return nub;
    },
    _Pload: function(data, n){//预加载前后
        if(data.length>3){//大于3张 才预加载
            if (n != Number(data.length - 1)) {
                this._preloadN.src = data[n + 1].bigpic
            }
        }
    },
    _mainA: function(){
        var _w = $('.section').width() - 200, _h = $(window).height() - $('.title').height() - $('.header').height() - $('#Main-C').height() - 112;
        return {
            w: _w,
            h: _h
        }
    },
    _buildHtml: function(){

    },
    _createHtml: function(n){
        var _this = this, bH = $('#Main-B').height();
        //set title
        console.log(222);
//        $('.title h1').html(ARTICLE_INFO.title);
        this._listLen = Math.ceil($('#SmallWarp').width()/150);
        $('#Main-A').animate({width: _this._mainA().w + 'px', height: _this._mainA().h + 'px'}, 'fast');
        //list设置宽度
        $('#SmallWarp').width($(window).width() - 60);
    },
    _zoom: function(obj){
        var _this = this, picWrap = $('#picWrap'), w = obj.size.w, h = obj.size.h, W = _this._mainA().w, H = _this._mainA().h + 100,
            v = Math.round(w/h*100)/100, V = Math.round(W/H*100)/100, css = '';

        if(W > w && H > h){
            picWrap.css({position: 'absolute', left: Math.ceil((W-w)/2), top: Math.round((H-h)/2), width: w, height: h});
        }else{
            if(V > v){
                css = {position: 'absolute', left: Math.ceil((W - H*v)/2) + 9, top: 9, width: H*v, height: H }
            }else{
                css = {position: 'absolute', left: 9, top: Math.round((H - W/v)/2) + 9, width: W, height: W/v}
            }
            picWrap.css(css);
        }

    },
    _shareObj: {
        url: location.href,
        title: document.title,
        pic: [],
        pic1: []
    },
    _showMask: function(){
        var _this = this, mask = $('#mask'), win = $('body');
        var w = win.width(), h = win.height();
        mask.css({width: w, height: h});
        mask.show();
    },
    _hideMask: function(){
        var _this = this, mask = $('#mask');
        mask.hide();
    },
    _showBig: function(data, n){//显示大图、显示成功后设置索引值对应的图注、url、组图当前索引值改写、小图位置、统计

        var _this = this;
        $("#download a").attr("href", data[n].bigpic); //原图地址配置
        $("#picWrap").css({opacity: 0});
        this._shareObj.pic = [data[n].bigpic];
        this._shareObj.pic1 = [data[n].smallpic];
        this._nowSrc = data[n].bigpic;
        this._isAD && hdPic.fn._hideLast();

        var img = new Image();
        imgReady(data[n].bigpic, function(){
            var w = this.width, h = this.height;
            if(!hdPic.fn._tmpArray[n].size){
                hdPic.fn._tmpArray[n].size = {
                    w: w,
                    h: h
                }
            }
            _this._zoom(data[n], this);
            $("#picWrap").html(this);
            $(this).attr('id', 'bigPic');
        }, function(){
            $("#picWrap").html(this);
            $(this).attr('id', 'bigPic');
        }, function(){
            //加载失败时的处理
        })
        hdPic.fn._showSmall(n);
        hdPic.fn._showtit(n);
        hdPic.fn._TxtScroll();
        $("#picWrap").animate({ opacity: 1}, 1000);
        hdPic.fn._pageNow = n;
        hdPic.fn._countPV(parseInt(n+1));//统计PGV
        //预加载
        hdPic.fn._Pload(data,n);
    },
    _showSmall: function(n){
        var _this = this, _len = hdPic.fn._tmpArray.length, wLi = 150;
        var aLi = $('#Smailllist li'), list = $("#Smailllist");
        var mask = aLi.eq(n).find('div.mask');
        this._listLen = Math.floor($('#SmallWarp').width()/wLi);
        var _left, _latsindex = this._listLen, _n = Math.floor(this._listLen/2);

        aLi.eq(_this._pageOld).find('div.mask').fadeOut('fast');
        _this._pageOld = n;

        if(_len <= this._listLen){
            mask.fadeIn('fast');
            return false;
        }

        if(n >= _n && n < _len - _n){
            list.stop(true, true).animate({left:-wLi*(n-_n)+"px"},"slow");

            mask.fadeIn('fast');
        }else{
            if(n >= _len-_n){
                _left = (wLi*(_latsindex-(_len-n)))+20+"px";
                list.animate({left:-(_len-this._listLen)*wLi+"px"},"slow");
                mask.fadeIn('fast');
            }else{
                if(n<_n){
                    list.animate({left:"0px"},"slow");
                }
                _left = (wLi*n)+20+"px";
                mask.fadeIn('fast');

            }

        }

    },
    _iwannComent:function(site, id){//评论
        if(hdPic.fn._aid < 100000000){
            $.getScript("http://sum.comment.gtimg.com.cn/php_qqcom/gsum.php?site="+site+"&c_id="+id,function(){
                return false;
            })
        }else{
            $.getScript("http://coral.qq.com/article/batchcommentnum?targetid=" + hdPic.fn._aid + "&callback=_cbSum",function(){
                return false;
            })
        }
    },
    _countIFrame: function(){//创建统计iframe
        $(".footer").append("<iframe id='iframeP' name='iframeP' src='' style='display:none;width:0px;height:0px;'></iframe>");
    },
    _countPV: function(index){//刷新PV
        loadJs("/ent/js/pingV3_1_5.js", function(){
            console.log();
            try{
                var catalogPath = ARTICLE_INFO.catalog_full.toString().replace(/-/g,"."), L, Z, W, M, P;
                if(ARTICLE_INFO.topic.name.length > 0){
                    L = "L.",
                        Z = "Z." + catalogPath + "." + ARTICLE_INFO.topic.name;
                }else{
                    L = "L." + catalogPath,
                        Z = "Z.";
                }
                W = "W." + ARTICLE_INFO.type,
                    M = "M." + ARTICLE_INFO.tpl.type + ARTICLE_INFO.tpl.stype,
                    P = "P." + ARTICLE_INFO.site,
                    pgvInfo = L + "_" + Z + "_" + W + "_" + M + "_" + P;
                if(pvRepeatCount==2){
                    pvRefDomain=window.location.host;
                    pvRefUrl=location.pathname;
                }
                pvRepeatCount = 1;
                if(typeof(pgvMain) == 'function'){if(typeof(pgvInfo) != 'undefined'){pgvMain({pgUserType:pgvInfo});}}
            }catch(e){}
            hdPic.fn._creatUrl(parseInt(index-1));
        });
    },
    _getData: function(data, coent){//第一次加载后，初始化大图、小图、绑定事件、统计等
        var btnTxt = _cookie('btnTxt');
        if(data.length > 0){
            this._small(data);//装载小图
            this._pageNow = parseInt(hdPic.fn._getUrl()-1);
            this._bindClick(data);
            this._showBig(data,parseInt(hdPic.fn._getUrl()-1));

            if(this._pageNow == 0) {
                $('#BtnLeft').hide();
            }

            //1:show 2:hide
            if(btnTxt && btnTxt == 1){
                $('#infoTxtWrap').show();
                $('#closedTxt').attr('class', 'closedTxt t_close').html('隐藏图注<i></i>');

            }else if(btnTxt && btnTxt == 2){
                $('#infoTxtWrap').hide();
                $('#closedTxt').attr('class', 'closedTxt t_open').html('显示图注<i></i>');
            }
        }
    },
    _falshInt: function(data){
        loadingProcess.initSystems();//初始化全屏按钮
        loadingProcess.isJsReady = true;
        loadingProcess.setFullScreenDatas(data);//全屏数据传递
    },
    _getDomain: function(){//返回域名
        var Do = window.location.hostname;
        return Do.split(".")[0];
    },
    _small: function(data){//第一次加载后初始化小图
        var _tmp = "", _this = this, ulLength = 150*data.length + 20;
        $.each(data, function(i){

            if(i == 0){
                _tmp += '<li><div><a href="javascript:void(0);" class="select"  onfocus="this.blur()"><img src="' + data[i].smallpic + '" rel="' + data[i].bigpic + '"/><span>' + (i + 1) + "/" + data.length + '</span></a></div><div class="mask"></div></li>';
            }else{
                _tmp += '<li><div><a href="javascript:void(0);"  onfocus="this.blur()"><img src="' + data[i].smallpic + '"  rel="' + data[i].bigpic + '"/><span>' + (i + 1) + "/" + data.length + '</span></a></div><div class="mask"></div></li>';
            }
        });
        $("#Smailllist").width(ulLength);
        $("#Smailllist").html(_tmp);
        //list设置宽度
        $('#SmallWarp').width($(window).width() - 60);

        /*放大镜*/
        if(hdPic.fn._getDomain()=="ent_" || hdPic.fn._getDomain()=="lady_"){//女性、娱乐灰度
            var _width=0,_height=0;
            $("#Smailllist img").each(function(){
                $(this).bind('mouseover',function(e){
                    var _selfs = $(this);
                    $(".sh").html('<img src="'+$(this).attr('rel')+'" id="preloadBig"/>');
                    $("#preloadBig").load(function(){
                        $(".sh").css({'left':_selfs.offset().left-parseInt(130-61)+'px','top':parseInt(_selfs.offset().top-270)+'px'});
                        _width = $(this).width();
                        _height=$(this).height();
                        $("#preloadBig").css({'left':'0px','top':'0px'});
                        $(".sh").fadeIn('slow');
                    });

                });
                $(this).bind('mousemove',function(e){
                    e = e || window.event;
                    var x=e.clientX,y=e.clientY,ori=this.getBoundingClientRect(),z=Math.round($(".sh").width()/2);
                    var zoom = $("#preloadBig").width()/$(this).width();
                    x-=ori.left;
                    y-=ori.top;
                    $("#preloadBig").css({'left':-parseInt(x*zoom)+'px','top':-parseInt(y*zoom)+'px'});

                });
                $("#Smailllist").bind('mouseout',function(){
                    $(".sh").fadeOut('slow');
                })
            })
        }
        /*放大镜*/
    },
    /*
     @个性配置
     */
    _specific:function(){
        if(this._specificID!==""){
            if(this._specificID.indexOf("|")!==-1){
                var DOms = this._specificID.split("|");
                $.each(DOms,function(){
                    try{
                        $(this).hide();
                    }catch(e){}
                })
            }else{
                try{
                    $(this._specificID).css("visibility","hidden");
                }catch(e){

                }
            }

        }
    },
    _query: function(){//第一次加载,使用ajax加载数据,并在成功后把数据格式化到本地
        var org = window.location.href;
        $.ajax({
//            url: org.split(".htm")[0]+".hdBigPic.js",
            url: '/ent/js/hdBigPic.js',
            //url:"js/004363.hdBigPic.js",
            //url:"js/000021.hdBigPic.js",
            type: "GET",
            beforeSend: function(x) {
                x.setRequestHeader("If-Modified-Since","0");
                x.setRequestHeader("Charset", "UTF-8");
                x.setRequestHeader("Cache-Control","no-cache");
            },
            success: function() {
                var arrMe = eval("(" + arguments[0] + ")"),
                    data0 = arrMe.Children[0],
                    length = data0.Children[0].Children[0].Content,//长度
                    data = data0.Children[1], Txt, txt, tit, bigpic, smallpic;

                for(var i=0;i<length;i++){
                    Txt = data.Children[i].Children[3].Children[0].Content;
                    tit = Txt.replace(/\<p\>/i,"").replace(/\<\/p\>/i,""),
                        bigpic = data.Children[i].Children[2].Children[0].Content,
                        smallpic = data.Children[i].Children[1].Children[0].Content,
                        txt = data.Children[i].Children[0].Children[0].Content;
                    hdPic.fn._tmpArray.push({'showtit':tit, 'showtxt': txt, 'smallpic': smallpic, 'bigpic': bigpic})
                }
                hdPic.fn._isgoOn = data0.Children[5].Children[0].Content == 0 ? false : true;//是否连续播放下一组图
                hdPic.fn._lastTitle = data0.Children[3].Children[0].Content;//下一篇组图标题
                hdPic.fn._lastUrl = data0.Children[2].Children[0].Content;//下一篇组图地址

                if(arrMe.Children[0].Children[8].Children.length!==0){
                    hdPic.fn._coentArray = arrMe.Children[0].Children[8].Children[0].Content;//底部文章区
                    $("#Main-D").show();
                }else{
                    hdPic.fn._coentArray = "";
                    $("#Main-D").hide();
                }

                /*尼尔森统计结束*/
                hdPic.fn._countIFrame();//创建统计iframe;

                hdPic.fn._getData(hdPic.fn._tmpArray, hdPic.fn._coentArray);

                if(hdPic.fn._isCiment == "2"){
                    hdPic.fn._iwannComent(hdPic.fn._siteEname, hdPic.fn._aid);
                }else{
                    $("#toolBar").find("ul.right").hide();
                };

                /* 总图片数 */
                $('#tatolNum').html('/' + length);
                hdPic.fn._specific();
            },
            error: function(x, e) {
                $("#Main-P-QQ").html("<div style='margin:100px auto'>数据加载错误!</div>");
            },
            complete: function(x) {
                //  alert(x.responseText);
            }
        });
    },
    showBottomAD: function(){
        if(this.nowSite() == 'news' ){
            if(hdPic.fn._isShowLastAD && hdPic.fn._isShowLastAD == 1){
                $('#adBottom') && $('#adBottom').show();
            }
        }
    },
    init: function(p){
        window.onerror = ResumeError;
        hdPic.fn._sourName = p.name;//来源;
        hdPic.fn._sourUrl = p.url;//来源Url;
        hdPic.fn._pubTime = p.time;//发布时间;
        hdPic.fn._siteName = p.siteName;//站点中文名
        hdPic.fn._siteLink = p.siteLink;//站点链接
        hdPic.fn._isPic = p.ispic;//是否图片站
        hdPic.fn._isCiment = p.isComent;//是否评论
        hdPic.fn._aid = p.aid;//文章ID
        hdPic.fn._siteEname = p.siteEname;//站点英文名
        hdPic.fn._isShowLastAD = p.isShowLastAD;//是否显示末页广告 1 : 显示 0 : 隐藏
        if(typeof hdpic_specifics!=="undefined"){
            hdPic.fn._specificID =hdpic_specifics;//个性配置隐藏区域
        }
        if(typeof p.auth !== "undefined"){
            hdPic.fn._auth = p.auth;//作者
        }
        $(document).ready(function($){
            hdPic.fn._createHtml();
            hdPic.fn._query();

            hdPic.fn._createAD();
            hdPic.fn._buttonAD();
            hdPic.fn._insetAD();
            hdPic.fn.showBottomAD();
            crystal.request();

        });
    }
}

hdPic.fn.init.prototype = hdPic.fn;

function _cbSum(){
    hdPic.fn._siteEname.replace('_', '');
    var n;
    var site = /house/g.test(hdPic.fn._siteEname) ? 'house' : hdPic.fn._siteEname;
    if(hdPic.fn._aid < 100000000){
        n = arguments[0] > 0 ? arguments[0] : 0;
        $("#ComentNum").html(arguments[0]);
        $("#ComentLink").attr("href","http://comment5." + site + ".qq.com/comment.htm?site=" + site + "&id="+hdPic.fn._aid);
    }else{
        n = arguments[0].data[0].commentnum > 0 ? arguments[0].data[0].commentnum : 0;
        $("#ComentNum").html(arguments[0].data[0].commentnum);
        $("#ComentLink").attr("href","http://coral.qq.com/" + hdPic.fn._aid);
    }
};
//menu
function menu(obj){
    var hd = obj.find('.menu-hd'), bd = obj.find('.menu-bd');
    obj.timer = null;
    bd.bind('mouseover', function(){
        if(bd.is(":animated")) return;
        clearTimeout(obj.timer);
        obj.timer = setTimeout(function(){
            bd.slideDown('fast');
            hd.addClass('hover');
        }, 300);
    });
    obj.hover(function(){
        if(bd.is(":animated")) return;
        clearTimeout(obj.timer);
        obj.timer = setTimeout(function(){
            bd.slideDown('fast');
            hd.addClass('hover');
        }, 300);
    }, function(){
        if(bd.is(":animated")) return;
        clearTimeout(obj.timer);
        hd.removeClass('hover');
        bd.slideUp('fast');
    });
}


menu($('#toolBar .menu'));

function _cookie(name, value, expires, path, domain) {
    if (arguments.length == 1) {
        var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
        if(arr != null){
            return decodeURIComponent(arr[2]);
        }
        return null;
    } else {
        if(!arguments[1]){
            document.cookie = name + "=11" + ((path) ? "; path="+path:"; path=/")+((domain) ? "; domain="+domain : "") + "; expires=Fri, 02-Jan-1970 00:00:00 GMT";
        }else{
            e = "";
            e = new Date;
            if (!expires) {
                e.setTime(e.getTime() + 24*60*60*1E3);

            }else{
                e.setTime(e.getTime() + expires*24*60*60*1E3);
            }
            e = "; expires=" + e.toGMTString()
            document.cookie = name + "=" + value + e + ((path) ? "; path=" + path : "; path=/") + ((domain) ? ";domain=" + domain : "");
        }
    }
}


function bossHD(arg){
    var iurl = 'http://btrace.qq.com/collect?sIp=&iQQ=' + arg.qq + '&sBiz=' + arg.sBiz + '&sOp=' + arg.sOp + '&iSta=&iTy=' + arg.iTy + '&iFlow=&sUrl=' + arg.sUrl + '&iBak=&sBak=&ran=' + Math.random();
    gImage = new Image(1,1);
    gImage.src = iurl;
}
