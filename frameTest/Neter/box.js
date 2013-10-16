/**
 * box
 * @date 2012/12/10
 */
;Neter.namespace('Neter.Box');

;Neter.Box = function(options){
	var _this = this;

	this.defaults = {
		container   : document.body,
		content     : '',
		closeButton : true,
		left        : 'center',
		top         : 'center',
		slideHeight : 10
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
		/**
		 * create frame
		 * @return {Object} this
		 */
		create : function() {
			var defaults = _this.defaults,
				handler  = _this.handler;

			handler.box         = $('<div class="neter-box"></div>').appendTo(handler.container);
			handler.closeButton = $('<span class="neter-box-close-button"><b>x</b></span>').appendTo(handler.box);
			handler.view        = $('<div class="neter-box-view"></div>').append(defaults.content).appendTo(handler.box);

			return this;
		},
		/**
		 * init layout
		 * @return {Object} this
		 */
		initLayout : function() {
			var defaults = _this.defaults,
				handler  = _this.handler,
				width    = '',
				height   = '';

			handler.box.css({width : defaults.width, height : defaults.height});	

			defaults.closeButton && handler.closeButton.show();
			
			return this;	
		},
		bindEvents : function() {
			var defaults = _this.defaults,
				handler  = _this.handler,
				method = this;

			handler.box.delegate('.neter-box-close-button', 'click', function(event) {
				method.remove(event);
			});

			return this;
		},
		show : function(left, top) {
			var defaults = _this.defaults,
				handler  = _this.handler,
				start    = null;

			left  = left == 'center' ? (handler.container.width() / 2 + handler.container.scrollLeft() - handler.box.outerWidth() / 2) : left;	
			top   = top == 'center' ? (handler.container.height() / 2 + handler.container.scrollTop() - handler.box.outerHeight() / 2) : top;	
			start = { left : left, top : top - defaults.slideHeight };
			handler.box.css({left : start.left, top : start.top, opacity : 0}).show().animate({left : left, top : top, opacity : 1});

			return this;
		},
		hide : function(){
			var defaults = _this.defaults,
				handler  = _this.handler;

			handler.box.fadeOut('fast');
			return this;
		},
		remove : function(event){
			var defaults = _this.defaults,
				handler  = _this.handler;

			handler.box.remove();
			for(var p in handler){ handler[p] = null; }

		}
	}
};

;$.extend(Neter.Box.prototype, {
	render : function(show){
		var defaults = this.defaults;

		this.method.create().initLayout().bindEvents();
		show !== false && this.method.show(defaults.left, defaults.top);
	},
	hide : function(){
		thie.method.hide();
		return this;
	},
	remove : function(event){
		this.method.remove(event);
	}
});