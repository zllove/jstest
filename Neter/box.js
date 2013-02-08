/**
 * box
 * @date 2012/12/10
 */
;Neter.namespace('Neter.Box');

;Neter.Box = function(options){
	var _this = this;

	this.defaults = {
		container: document.body,
		content: '',
		closeButton: true,
		left: 'center',
		top: 'center'
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
				width = '',
				height = '';

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
				handler  = _this.handler;

			handler.box.show();

			return this;

		}
	}
};

;$.extend(Neter.Box.prototype, {
	render : function(show){
		var defaults = this.defaults;

		this.method.create().initLayout().bindEvents();
		show !== false && this.method.show(defaults.left, defaults.top);
	}
});