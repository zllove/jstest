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
    	load: [''],
    	complete: function(){

    	}
    }
]);

// loading skin
function skinInit(){
    new Neter.Skin().applying();
}