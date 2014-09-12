/**
 * mail home
 * @deprecated  2012/12/03
 */

$(function(){
	Neter.path('../');

	// loading skin
	new Neter.Skin().applying();

	var win = null;
	$('.user').click(function(){
		win = new Neter.Window({
		
		});
	});
	
});