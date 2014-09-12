/**
 * skin manager
 * @date 2012/12/07
 */
;Neter.namespace('Neter.Skin');

;Neter.Skin = function(options){
	var _this = this;

	this.defaults = {
		defaultSkin: Neter.skin() || 'skyblue',
		skins : [{
			name  : 'skyblue',
			color : '#135BA5',
			path  : 'blue.css',
			left  : 0,
			top   : 0
		}]
	};

	$.extend(this.defaults, options);

	this.handler = {
	};

	this.method = {
	};
};

;$.extend(Neter.Skin.prototype, {
	/**
	 * according to the name of the skin get the specified skin
	 * @param  {String} name skin name
	 * @return {String | Neter.Skin}      if you pass the name is return the corresponding configuration information of the skin, or return plugin reference
	 */
	getSkin: function(name){
		var skin = '';
		if (name === true) {
			return this.defaults.skins;
		};
		name = name || this.defaults.defaultSkin;

		$.each(this.defaults.skins, function(index, value){
			if (value.name == name) {
				skin = value;
			};
		});

		return skin || {};
	},
	/**
	 * applying skin
	 * @param  {String} name skin name
	 * @return {Object}      this
	 */
	applying: function(name){
		name = name || this.defaults.defaultSkin;

		var options 	= this.getSkin(name),
			path        = Neter.path() + 'resources/css/' + options.path,
			skin        = $('link#skin');

		skin.length ? skin.attr('href', path) : $('<link id="skin" rel="stylesheet" type="text/css" />').appendTo($('head')[0]).attr('href', path);

		Neter.skin(name);
		Neter.color(options.color);

		return this;
	}
});