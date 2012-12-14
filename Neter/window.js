/**
 * pop window
 * @date 2012/12/10
 */
;Neter.namespace('Neter.Window');

;Neter.Window = function(options){
	var _this = this;

	this.defautls = {

	};

	$.extend(this.defautls, options, {

	});

	Neter.Box.call(this, this.defautls);

	$.extend(this.handler, {
		titleBar  : null,
		buttonBar : null
	});

	var method = this.method,
		_super = $.extend({}, method);

	$.extend(method, {

	});	


};

;$.extend(Neter.Window.prototype, Neter.Box.prototype, {

});

