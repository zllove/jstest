/*
功能
    1，奇偶行不同色，鼠标滑过颜色效果，点击高亮
    2，列宽可拖动
    3，双击事件，在每行第一列取a的href值
 */
(function($) {
	var tableRowCheckboxCheckedClass = 'marked';
	$.fn.tablegrid = function(options) {
		$.fn.tablegrid.defaults = {
			mouseOverColor : '#6688EE',
			useClick : function(node) {},
			useDblClick : function(node) {},
			col_border : "1px solid #74B3DC"
		};

		var opts = $.extend( {}, $.fn.tablegrid.defaults, options);

		return this.each(function() {
				$(this)
						.find('tr')
						.each(function() {
								// 单击事件
								if (opts.useClick) {
									$(this).click(function() {
										$(this).siblings().removeClass(tableRowCheckboxCheckedClass);
										$(this).addClass(tableRowCheckboxCheckedClass);
										opts.useClick.call(this,this);
									});
								}
								// 双击事件
								if (opts.useDblClick) {
									$(this).dblclick(function() {
										opts.useDblClick.call(this,this);
									});
								}
						
								// 鼠标滑过及滑出事件
								$(this).mouseover(function() {
									$(this).css({
										'background-color' : opts.mouseOverColor,
										'border' : opts.col_border
									});
								});
								
								$(this).mouseout(function() {
									$(this).css( {
										'background-color' : '',
										'color' : ''
									});
								});

							});

			});
	};
})(jQuery);