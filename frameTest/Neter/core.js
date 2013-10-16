/**
 * Neter core
 * @date 2012/11/30
 */
;(function(window, $) {
	// plugins relative to call the path of the page
	var __path__  = '',
		__skin__  = '',
		__color__ = '#135BA5';

	/**
	 * @static
	 * @class
	 * @name Neter
	 */
	window.Neter = window.Neter || {};

	$.extend(Neter, {
		version: 1.0,

		/**
		 * create namespace
		 * @param  {String} namesapce to point space command space string
		 * @return {Neter}           this
		 */
		namespace: function(namesapce) {
			var args 	 = arguments,
				ns       = null,
				nsArray  = [],
				obj      = null;

			for(var i = 0; i < args.length; i++) {
				nsArray = args[i].split('.');
				obj     = nsArray[0];

				eval('if (typeof ' + obj + ' == "undefined") { ' + obj + ' = {};} ns = ' + obj + ';');

				for(var j = 1; j < nsArray.length; j++){
					ns[nsArray[j]] = ns[nsArray[j]] || {};
					ns             = ns[nsArray[j]];
				}
			}
			return this;
		},
		/**
		 * set or get plugin path
		 * @param  {[type]} path [description]
		 * @return {[type]}      [description]
		 */
		path: function(path){
			if (path) {
				__path__ = path;
			} else {
				return __path__;
			}
			return this;
		},
		/**
		 * get or save the current system using skin
		 * @param  {String} name skin name
		 * @return {Object}      this
		 */
		skin: function(name){
			if (name) {
				__skin__ = name;
			} else{
				return __skin__;
			};
			return this;
		},
		/**
		 * set get for save the current skin color
		 * @param  {Number} color save color
		 * @return {Object}       this
		 */
		color: function(color){
			if (typeof color === 'undefined') {
				return __color__;
			} else{
				__color__ = color;
			};
			return this;
		}
	});

}(window, jQuery));