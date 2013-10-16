/**
 * panel example
 * @date 2012/11/30
 */
;Neter.namespace('Neter.Panel');

;Neter.Panel = function(options) {
	var _this = this;
	
	this.defaults = {
		width       : 340,
		height      : 390,
		defaultTag  : 0,
		container   : document.body,
		bodies      : [{
			tag     : '',
			content : ''
		}],
		activeType  : 'hover'

	};
	$.extend(this.defaults, options, {
		BORDER_WIDTH: 2
	});

	this.handler = {
		container     : $(this.defaults.container),
		panel         : null,
		tagBar        : null,
		viewContainer : null,
		bodies        : [],
		previous      : {
			tag       : null,
			view      : null
		}
	};

	this.defaults.container = null;

	this.method = {
		// create frame
		create: function() {
			var defaults = _this.defaults,
				handler  = _this.handler;

			// create panel container
			handler.panel = $('<div>').addClass('neter-panel').appendTo(handler.container);

			// create tab
			handler.tagBar = $('<div>').addClass('neter-panel-tag-bar').appendTo(handler.panel);

			// create main body
			handler.viewContainer = $('<div>').addClass('neter-panel-view-container').appendTo(handler.panel);

			return this;
		},
		// init layout, when add and remove tags also need to invoke this method to page reload
		initLayout: function(){
			var defaults      = _this.defaults,
				handler       = _this.handler,
				width         = defaults.width - defaults.BORDER_WIDTH,
				height        = defaults.height,
				tagBar        = handler.tagBar.css('width', width),
				bodies        = handler.bodies,
				tagWidth      = parseInt(tagBar.width() / bodies.length),
				viewContainer = handler.viewContainer;

			handler.panel.css({width: width, height: height});
			handler.viewContainer.css('width', width);

			$.each(bodies, function (index, value) {
				value.tag.css({borderRightWidth: '1px', width: tagWidth - 1});
			});

			tagBar.find('.neter-panel-tag:last').css({
				borderRightWidth : 0,
				width            : tagWidth
			});

			return this;
		},
		/**
		 * insert the panel labels, if the parameter is omitted, then take the contents of the 'this.defaults.boies'
		 * @param  {Number} index   new join label position, value is -1 to add to the end
		 * @param  {Object} options new content { tag : '', content : '' }
		 * @return {Object}         this
		 */
		insert: function(index, options){
			var defaults	  = _this.defaults,
				handler       = _this.handler,
				tagBar        = handler.tagBar,
				viewContainer = handler.viewContainer,
				bodies        = handler.bodies;

			arguments.length && defaults.bodies.push(options);

			$.each(defaults.bodies, function(i, options) {
				var tag  = $('<div>').addClass('neter-panel-tag').html(options.tag),
					view = $('<div>').addClass('neter-panel-view').append(options.content);

				if (typeof index === 'number') {
					index = !~index ? bodies.length : index;
					var tmp = tagBar.find('.neter-panel-tag')[index];
					tmp ? tag.insertBefore(tmp) : tagBar.append(tmp);

					(tmp = viewContainer.find('.neter-panel-view')[index]) ? view.insertBefore(tmp) : viewContainer.append(view);
					bodies.splice(index, 0, {tag: tag, view: view, options: options});
				} else{
					tagBar.append(tag);
					viewContainer.append(view);
					bodies.splice(index, 0, {tag: tag, view: view, options: options});
				};	

			});
			defaults.bodies = [];

			return this;
		},
		/**
		 * update tab
		 * @param  {Number} index   position
		 * @param  {Object} options new tab content
		 * @return {Object}         this
		 */
		update: function (index, options) {
			var defaults 	= _this.defaults,
				handler     = _this.handler,
				dest        = handler.bodies[index];

			if(dest){
				dest.tag.html(options.tag);
				dest.view.empty().append(options.content);
				dest.options = options;
			}
			return this;
		},
		/**
		 * remove tab
		 * @param  {Number} index position
		 * @return {Object}       this
		 */
		remove: function (index) {
			var defaults 	= _this.defaults,
				handler     = _this.handler,
				dest        = handler.bodies[index];

			if (dest) {
				dest.tag.remove();
				dest.view.remove();

				handler.bodies[index].tag = null;
				handler.bodies[index].view = null;
				handler.bodies.splice(index, 1);
			};

			return this;
		},
		/**
		 * to label binding switching events
		 * @return {Object} this
		 */
		bindEvents: function() {
			var defaults 	= _this.defaults,
				handler     = _this.handler,
				current 	= handler.current;

			handler.tagBar.delegate('div.neter-panel-tag', defaults.activeType, function(){
				_this.method.active(this);
			});
		},
		/**
		 * activation label
		 * @param  {Object} current switching label, dom object
		 * @return {Object}         this
		 */
		active: function (current) {
			var defaults 	= _this.defaults,
				handler     = _this.handler,
				previous    = handler.previous;

			previous.tag && previous.tag.removeClass('neter-panel-tag-current');
			previous.view && previous.view.hide();

			previous.tag = $(current).addClass('neter-panel-tag-current');

			$.each(handler.bodies, function(index, value){
				if (value.tag[0] === current) {
					previous.view = value.view.show();
				};
			});	

			return this;
		}
	}
};

;$.extend(Neter.Panel.prototype, {
	// render method, After rendering are only added to the plugin page,
	// if you want to display to show method call
	render: function(){
		this.method.create().insert().initLayout().bindEvents();

		this.active(this.defaults.defaultTag);

		return this;
	},
	/**
	 * active label
	 * @param  {Number} index position
	 * @return {Object}       this
	 */
	active: function(index){
		this.method.active(this.handler.tagBar.find('>div').get(index || 0));

		return this;
	},
	/**
	 * insert the panel labels, default for the last
	 * @param  {Number} index   new join label position
	 * @param  {Object} options new content { tag : '', content : '' }
	 * @return {Object}         this
	 */
	insert: function(index, options){
		if (typeof index == 'object') {
			index   = -1;
			options = index;
		};
		index = typeof index === 'number' ? index : -1;
		if (!options || !options.hasOwnProperty('tag') || !options.hasOwnProperty('content')) { return this; };

		this.method.insert(index, options).initLayout();
		return this;
	},
	/**
	 * update tab
	 * @param  {Number} index     position
	 * @param  {Object} options tab content
	 * @return {Object}          this
	 */
	update: function (index, options) {
		if(index < 0 || !options || !options.hasOwnProperty('tag') || !options.hasOwnProperty('content')){
			return this;
		}

		this.method.update(index, options);

		return this;
	},
	/**
	 * remove tab
	 * @param  {Number} index position
	 * @return {Object}       this
	 */
	remove: function (index) {
		var _this = this;
		$.each([].slice.call(arguments).sort().reverse(), function (i, index) {
			index > -1 && _this.method.remove(index);
		});

		this.method.initLayout();

		return this;
	}
});