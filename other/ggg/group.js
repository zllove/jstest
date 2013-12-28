;(function (window) {
    var group = {
        pageFix : function(){
            var myScroll;
            function loaded() {
                myScroll = new iScroll('wrapper');
            }

            document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
            document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);

            var oPage = document.querySelector('#pageNum'),
                oTotal = document.querySelector('#totalPage'),
                oFooterPage = document.querySelector('#footerPage'),
                sOldVal = '';

            oPage.addEventListener('focus', function(){
                this.type = 'number';
                sOldVal = this.value;
            }, false);

            oPage.addEventListener('blur', function(){
                var sVal = this.value;
                this.type = 'text';
                if(sVal != sOldVal){
                    this.value += '/' + oTotal.value;
                }

            }, false);
        },
        /**
         * init loading img
         * @param selector
         * @param errorsrc
         */
        setLoading : function(selector, errorsrc){
            var aImgs = document.querySelectorAll(selector);

            for(var i = 0; i < aImgs.length; i++){
                var curImg = aImgs[i];
                var dataSrc = curImg.getAttribute('data-src');

                this.loadingImg(dataSrc, curImg, function(obj, imgid){
                    imgid.src = obj.src;
                    var loadimg = imgid.parentNode.querySelector('.loadingimg');
                    if(!loadimg){ return; }
                    loadimg.style.display = 'none';
                }, errorsrc);
            }
        },
        /**
         * loadingimg
         * @param url
         * @param imgid
         * @param callback
         * @param errorsrc
         */
        loadingImg : function(url, imgid, callback, errorsrc){
            var val = url;
            var oImg = new Image();
            oImg.addEventListener('load', function(){
                if (oImg.complete == true) {
                    callback(oImg, imgid);
                }
            }, false);

            oImg.addEventListener('error', function(){
                oImg.src = errorsrc;
            }, false);
            oImg.src = val;
        },
        /**
         * set support
         * @param btn
         * @param disCls
         */
        setSupport: function(btn, disCls){
            var aBtn = document.querySelectorAll(btn),
                aNum = null,
                sName = '';

            for(var i = 0; i < aBtn.length; i++){
                aBtn[i].addEventListener('click', function(){
                	$this = this;
                    sName = this.className;
                    aNum = this.getElementsByTagName('i')[0];
                    id = $this.id;

                    if(this.className.indexOf(disCls) == -1){
        			    $.get("/gplus/app/ajax/threadlike.cgi?threadId=" + id + "&t=" + new Date().getTime(), function(data) {
        			    	if (data.voted == false) {
            			    	$this.className += ' ' + disCls;
                                aNum.innerHTML ++;	
        			    	}
        			    });
                    } else {
                        // alert('您已赞过！');
                    }
                }, false);
            }
        },
        /**
         * @param html 显示内容html
         * @param cls 当前div的class
         * @param isFull 是否显示全屏，为弹出层准备
         * @returns {HTMLElement}
         */
        createDiv : function(html, cls, isFull){
            var oDiv = document.createElement('div');
            cls && (oDiv.className = cls);
            html && (oDiv.innerHTML = html);
            document.body.appendChild(oDiv);

            if(!isFull){
                oDiv.style.left = (innerWidth - oDiv.offsetWidth) / 2 - 8 + 'px';
                oDiv.style.top = (innerHeight - oDiv.offsetHeight) / 2 + 'px';
            } else {
                oDiv.style.width = innerWidth + 'px';
                oDiv.style.height = document.documentElement.clientHeight + 'px';
            }
            return oDiv;
        },
        viewImg : function(img){
            var that = this,
                aImg = document.querySelectorAll(img),
                sHtml = '',
                oMask = null,
                oNot = null,
                screenUrl = '',
                oBigImg = null,
                oDiv = null;

            for(var i = 0; i < aImg.length; i++){
                aImg[i].addEventListener('click', function(e){
                    sHtml = '<div class="pop-inner"><a class="group-close" href="javascript:void(0)">X</a><div class="group-img"><img src="' + this.src + '" alt="" /></div><div class="pop-bot"><a class="pop-bigimg common-btn" href="">点击看大图</a></div></div>';
                    oDiv = that.createDiv(sHtml, 'prop-pop');
                    oMask = that.createDiv('', 'prop-mask', 1);
                    oNot = oDiv.querySelector('.group-close');
                    oBigImg = oDiv.querySelector('.pop-bigimg');
                    screenUrl = this.getAttribute('data-src');

                    oBigImg.addEventListener('click', function(){
                        this.href = 'jijiagames://com.jijiagames.gamecenter/image?src=' + screenUrl;
                        return false;
                    });

                    if(oNot) { close(); }
                    e.preventDefault();
                    return false;
                }, false);

                function close(){
                    oNot.addEventListener('click', function(){
                        document.body.removeChild(oDiv);
                        document.body.removeChild(oMask);
                    }, false);
                }
            }
        },
        // 画廊图片大小重置
        resizeImg : function(image, width, height){
            if (width == null || height == null) return;
            var w = image.width,
                h = image.height,
                scalingW = w / width,
                scalingH = h / height,
                scaling = w / h;

            if(w > width){
                image.width = width;
                image.height = (width) / scaling;
            } else if(h > height){
                image.height = height - 70;
                image.width = (height - 70) * scaling;
            }
        }
    }

    window.group = group || {};
}(window));

var doubleTap = function(speed, distance) {
    'use strict';

    // default dblclick speed to half sec (default for Windows & Mac OS X)
    speed = Math.abs(+speed) || 500;//ms
    // default dblclick distance to within 40x40 pixel area
    distance = Math.abs(+distance) || 40;//px

    // Date.now() polyfill
    var now = Date.now || function() {
        return +new Date();
    };

    var cancelEvent = function(e) {
        e = (e || window.event);

        if (e) {
            if (e.preventDefault) {
                e.stopPropagation();
                e.preventDefault();
            } else {
                try {
                    e.cancelBubble = true;
                    e.returnValue = false;
                } catch (ex) {
                    // IE6
                }
            }
        }
        return false;
    };

    var taps = 0,
        last = 0,
    // NaN will always test false
        x = NaN,
        y = NaN;

    return function(e) {
        e = (e || window.event);

        var time = now(),
            touch = e.changedTouches ? e.changedTouches[0] : e,
            nextX = +touch.clientX,
            nextY = +touch.clientY,
            target = e.target || e.srcElement,
            e2,
            parent;

        if ((last + speed) > time &&
            Math.abs(nextX-x) < distance &&
            Math.abs(nextY-y) < distance) {
            // continue series
            taps++;

        } else {
            // reset series if too slow or moved
            taps = 1;
        }

        // update starting stats
        last = time;
        x = nextX;
        y = nextY;

        // fire tap event
        if (document.createEvent) {
            e2 = document.createEvent('MouseEvents');
            e2.initMouseEvent(
                'tap',
                true,				// click bubbles
                true,				// click cancelable
                e.view,				// copy view
                taps,				// click count
                touch.screenX,		// copy coordinates
                touch.screenY,
                touch.clientX,
                touch.clientY,
                e.ctrlKey,			// copy key modifiers
                e.altKey,
                e.shiftKey,
                e.metaKey,
                e.button,			// copy button 0: left, 1: middle, 2: right
                e.relatedTarget);	// copy relatedTarget

            if (!target.dispatchEvent(e2)) {
                // pass on cancel
                cancelEvent(e);
            }

        } else {
            e.detail = taps;

            // manually bubble up
            parent = target;
            while (parent && !parent.tap && !parent.ontap) {
                parent = parent.parentNode || parent.parent;
            }
            if (parent && parent.tap) {
                // DOM Level 0
                parent.tap(e);

            } else if (parent && parent.ontap) {
                // DOM Level 0, IE
                parent.ontap(e);

            } else if (typeof jQuery !== 'undefined') {
                // cop out and patch IE6-8 with jQuery
                jQuery(this).trigger('tap', e);
            }
        }

        if (taps === 2) {
            // fire dbltap event only for 2nd click
            if (document.createEvent) {
                e2 = document.createEvent('MouseEvents');
                e2.initMouseEvent(
                    'dbltap',
                    true,				// dblclick bubbles
                    true,				// dblclick cancelable
                    e.view,				// copy view
                    taps,				// click count
                    touch.screenX,		// copy coordinates
                    touch.screenY,
                    touch.clientX,
                    touch.clientY,
                    e.ctrlKey,			// copy key modifiers
                    e.altKey,
                    e.shiftKey,
                    e.metaKey,
                    e.button,			// copy button 0: left, 1: middle, 2: right
                    e.relatedTarget);	// copy relatedTarget

                if (!target.dispatchEvent(e2)) {
                    // pass on cancel
                    cancelEvent(e);
                }

            } else {
                e.detail = taps;

                // manually bubble up
                parent = target;
                while (parent && !parent.dbltap && !parent.ondbltap) {
                    parent = parent.parentNode || parent.parent;
                }
                if (parent && parent.dbltap) {
                    // DOM Level 0
                    parent.dbltap(e);

                } else if (parent && parent.ondbltap) {
                    // DOM Level 0, IE
                    parent.ondbltap(e);

                } else if (typeof jQuery !== 'undefined') {
                    // cop out and patch IE6-8 with jQuery
                    jQuery(this).trigger('dbltap', e);
                }
            }
        }
    };
};