/**
 * mail home
 * @deprecated  2013/02
 */
Modernizr.load([
    {
        load: ['../jquery.js', '../core.js', '../skin.js', '../tips.js'],
        complete: function(){
        	Neter.path('../');

        	skinInit();        	
        }
    },
    {
    	load: ['../box.js', '../window.js'],
    	complete: function(){
    		windowInit();
    	}
    }
]);	

// loading skin
function skinInit(){
    new Neter.Skin().applying();
}

// loading window
function windowInit(){
	var win = null;
	$('.user').click(function(){
		win = new Neter.Window({
			title : '个人资料',
			content : 'Window...'
		}).render();
	});
}