/**
 * pop window
 * @date 2012/12/10
 */
;Neter.namespace('Neter.Window');

;Neter.Window = function(options){
	var _this = this;

	this.defaults = {
		container   : document.body,
		width : 300,
		height : 200,
		left        : 'center',
		top         : 'center',
		closeButton : true,
		button      : []
	};

	$.extend(this.defaults, options, {

	});

	Neter.Box.call(this, this.defaults);

	$.extend(this.handler, {
		titleBar  : null,
		buttonBar : null
	});

	var method = this.method,
		_super = $.extend({}, method);

	$.extend(method, {
		getButtonOptions : function(){
		},
		create : function(){
			var defaults = _this.defaults,
				handler  = _this.handler;

			_super.create.call(this);

			// add shadow
			handler.shadow = $('<div class="neter-window-shadow"></div>').appendTo(handler.container);
			handler.titleBar = $('<div class="neter-window-title-bar"></div>').append(defaults.title).appendTo(handler.box);
			handler.buttonBar = $('<div class="neter-window-buttons-bar"></div>').appendTo(handler.box);

			return this;
		},
		initLayout : function(){
			_super.initLayout.call(this);

			var defaults = _this.defaults,
				handler  = _this.handler;

			defaults.mask && handler.shadow.show();

			handler.view.css({height : defaults.height});

			return this;
		},
		bindEvents : function(){
			var defaults = _this.defaults,
				handler  = _this.handler;

			_super.bindEvents.call(this);
			return this;
		},
		remove : function(event){
			var handler  = _this.handler;

			handler.shadow.remove();
			_super.remove.call(this, event);
		}
		
	});	


};

;$.extend(Neter.Window.prototype, Neter.Box.prototype, {
	title : function(title){
		var defaults = _this.defaults,
			handler  = _this.handler;

		if(arguments.length){
			handler.titleBar.empty().append(defaults.title = title);
			return this;
		} else {
			return defaults.title;
		}
	}
});

