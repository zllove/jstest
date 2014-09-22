/**
 * Theme Plugins
 * @author ZhangHuihua@msn.com
 */
(function($){
	$.fn.extend({
		theme: function(options){
			var op = $.extend({themeBase:"themes"}, options);
			var _themeHref = op.themeBase + "/#theme#/style.css";
			return this.each(function(){
				var jThemeLi = $(this).find(">li[theme]");
				jThemeLi.each(function(index){
					$(this).click(function(){
						$("head").find("link[href$=style.css]").attr("href", _themeHref.replace("#theme#", $(this).attr("theme")));
						jThemeLi.find(">div").removeClass("selected").eq(index).addClass("selected");
					});
				});
			});
		}
	});
})(jQuery);
