/**
 * box
 * @date 2012/12/10
 */
;Neter.namespace('Neter.Box');

;Neter.Box = function(options){
	var _this = this;

	this.defaults = {
		container    : document.body,
		width        : 300,
		height       : 200,
		slideHeight  : 10,
		paddingWidth : 16,
		content      : '',
		left         : 'center',
		top          : 'center',
		closeButton  : true,
		closeEvent   : null
	};

	$.extend(this.defaults, options, {

	});

	this.handler = {
		container   : $(this.defaults.container),
		box         : null,
		view        : null,
		closeButton : null
	}

	this.method = {
		var defaults = _this.defaults,
			handler  = _this.handler;
	}
};

;$.extend(Neter.Box.prototype, {
	render: function(show){
		var defaults = this.defaults;

		this.method.create();
	}
});