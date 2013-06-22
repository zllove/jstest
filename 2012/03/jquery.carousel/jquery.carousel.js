/*
 * jQuery Carousel Plugin v1.0
 * http://richardscarrott.co.uk/posts/view/jquery-carousel-plugin
 *
 * Copyright (c) 2010 Richard Scarrott
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Requires jQuery v1.4+
 *
 */

// prototypal inheritance
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

(function ($) {
    // ie alias
    var headache = $.browser.msie && $.browser.version.substr(0, 1) < 9;
    // carousel
    var Carousel = {
        settings           :{
            itemsPerPage      :1,         // 页数
            itemsPerTransition:1,         // 每页上显示的条数
            noOfRows          :1,         // 行
            pagination        :true,      // 页码
            nextPrevLinks     :true,      // 下一页
            speed             :'normal',  // 速度
            easing            :'swing'    // easing 方式
        },
        init               :function (el, options) {
            if (!el.length) { return false; }
            this.options = $.extend({}, this.settings, options);
            this.itemIndex = 0;
            this.container = el;                       // 包裹容器
            this.runner = this.container.find('ul');   // ul 容器
            this.items = this.runner.children('li');   // li
            this.noOfItems = this.items.length;        // li 数量
            this.setRunnerWidth();                     // 设定ul的总宽度，以便进行动画
            if (this.noOfItems <= this.options.itemsPerPage) {
                return false;
            } // bail if there are too few items to paginate
            // 如果太少则不进行分页
            this.insertMask();                         // 添加显示窗口大小
            this.noOfPages = Math.ceil((this.noOfItems - this.options.itemsPerPage) / this.options.itemsPerTransition) + 1; // 页数
            if (this.options.pagination) {
                this.insertPagination();               // 插入页数
            }
            if (this.options.nextPrevLinks) {
                this.insertNextPrevLinks();            // 插入下一页
            }
            this.updateBtnStyles();                    // 更新按钮样式
        },
        // 添加显示窗口大小
        insertMask         :function () {
            this.runner.wrap('<div class="mask" />');
            // set mask height so items can be of varying height
            var maskHeight = this.runner.outerHeight(true); // ul 高度
            this.mask = this.container.find('div.mask');
            this.mask.height(maskHeight);
        },
        // 设定ul的总宽度，以便进行动画
        setRunnerWidth     :function () {
            this.noOfItems = Math.round(this.noOfItems / this.options.noOfRows);
            var width = this.items.outerWidth(true) * this.noOfItems;
            this.runner.width(width);
        },
        // 插入页码
        insertPagination   :function () {
            var i, links = [];
            this.paginationLinks = $('<ol class="pagination-links" />'); // 页码
            for (i = 0; i < this.noOfPages; i++) {
                links[i] = '<li><a href="#item-' + i + '">' + (i + 1) + '</a></li>';
            }
            this.paginationLinks.append(links.join('')).appendTo(this.container).find('a')
                .bind('click.carousel', $.proxy(this, 'paginationHandler')); // 此处proxy的作用在于使this指向为Carousel，原为指向find('a')
        },
        // 翻页处理函数
        paginationHandler  :function (e) {
            this.itemIndex = e.target.hash.substr(1).split('-')[1] * this.options.itemsPerTransition; // 页数
            this.animate();
            return false;
        },
        // 插入上一页下一页按钮
        insertNextPrevLinks:function () {
            this.prevLink = $('<a href="#" class="prev">Prev</a>').bind('click.carousel', $.proxy(this, 'prevItem')).appendTo(this.container);
            this.nextLink = $('<a href="#" class="next">Next</a>').bind('click.carousel', $.proxy(this, 'nextItem')).appendTo(this.container);
        },
        // 下一页
        nextItem           :function () {
            this.itemIndex = this.itemIndex + this.options.itemsPerTransition;
            this.animate();
            return false;
        },
        // 上一页
        prevItem           :function () {
            this.itemIndex = this.itemIndex - this.options.itemsPerTransition;
            this.animate();
            return false;
        },
        // 更新上一页、下一页按钮样式
        updateBtnStyles    :function () {
            if (this.options.pagination) {
                this.paginationLinks.children('li').removeClass('current').eq(Math.ceil(this.itemIndex / this.options.itemsPerTransition)).addClass('current');
            }
            if (this.options.nextPrevLinks) {
                this.nextLink.add(this.prevLink).removeClass('disabled');
                if (this.itemIndex === (this.noOfItems - this.options.itemsPerPage)) {
                    this.nextLink.addClass('disabled');
                } else if (this.itemIndex === 0) {
                    this.prevLink.addClass('disabled');
                }
            }
        },
        // 滚动动画that
        animate            :function () {
            var nextItem, pos;
            // check whether there are enough items to animate to
            // 检查是否有足够的项目进行动画
            if (this.itemIndex > (this.noOfItems - this.options.itemsPerPage)) { //this.noOfItems li总长度, itemsPerPage 每页上显示的条数
                this.itemIndex = this.noOfItems - this.options.itemsPerPage; // go to last panel - items per transition
            }
            if (this.itemIndex < 0) {
                this.itemIndex = 0; // go to first
            }
            nextItem = this.items.eq(this.itemIndex);
            pos = nextItem.position();
            if (headache) { // 如果是ie
                this.runner.stop().animate({left:-pos.left}, this.options.speed, this.options.easing);
            } else {
                this.mask.stop().animate({scrollLeft:pos.left}, this.options.speed, this.options.easing);
            }
            this.updateBtnStyles();
        }
    };

    // bridge
    $.fn.carousel = function (options) {
        return this.each(function () {
            var obj = Object.create(Carousel);
            obj.init($(this), options);
            $.data(this, 'carousel', obj);
//            Carousel.init($(this), options);
        });
    };
})(jQuery);