Function.prototype.method = function(name, func){
	if(!this.prototype[name]){
		this.prototype[name] = func;
	}
	return this;
}

Function.method('inherits', function(Parent){
	this.prototype = new Parent();
	return this ;
});

Function.method('bind', function(that){
	var method = this,
		slice = Array.prototype.slice,
		args = slice.apply(arguments, [1]);

	return function(){
		return method.apply(that, args.concat(slice.apply(arguments, [0])));
	};
});

Array.method('reduce', function(f, value){
	var i;
	for(i = 0; i < this.length; i+=1){
		value = f(this[i], value);
	}
	return value;
});