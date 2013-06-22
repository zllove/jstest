/**
 * panel example
 * @date 2012/11/30
 */
;Neter.namespace('Neter.Tips');

;Neter.Tips = function(options) {
	var _this = this;
	
	this.defaults = {
		container : document.body,
		msg       : '',
		showTime  : 2,
		type      : 'success'

	};
	$.extend(this.defaults, options);

	this.handler = {
		container : $(this.defaults.container),
		tips 	  : null
	};

	this.method = {
		// create frame
		create: function() {
			var defaults = _this.defaults,
				handler  = _this.handler;

			/*
			handler.tips = $('<div>', {
				'class': 'neter-tips',
				text: defaults.msg
			}).appendTo(defaults.container);
*/
			handler.tips = $('<div>').addClass('neter-tips').html(defaults.msg).appendTo(defaults.container);

			return this;
		}
	}
};


;$.extend(Neter.Tips.prototype, {
	// render method, After rendering are only added to the plugin page,
	// if you want to display to show method call
	render: function(){
		this.method.create();
		return this;
	},
	update: function(msg){
		this.defaults.msg = msg || this.defaults.msg;
		return this;
	},
	// show method
	show: function (type, showType) {
		var defaults = this.defaults,
			tips     = this.handler.tips;

		if (!tips) { return this; };	

		defaults.type = type || defaults.type;

		tips.html(defaults.msg)
			.removeClass('neter-tips-success neter-tips-error neter-tips-aside neter-tips-warning')
			.addClass('neter-tips-' + defaults.type).css({ marginLeft: -tips.outerWidth() / 2});

		if (showType) {
			tips.css({top: 0}).show();
		} else{
			tips.animate({top: 0}).delay(defaults.showTime * 1000).animate({top: -tips.outerHeight()}, 'slow');
		};	
		return this;
	},
	hide: function(){
		var tips = this.handler.tips;
		tips && tips.animate({ top: -tips.outerHeight() }, 'slow');

		return this;
	},
	remove: function(){
		var tips = this.handler.tips;
		tips.empty().remove();
		tips = null;
	}

});