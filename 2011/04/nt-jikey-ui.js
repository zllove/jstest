J.onReady(function(){
	usernameFocus('username');	
});

function usernameFocus(id){
	var username = J.$(id);
	
	for(var p in inputEvent){
		J.addEvent('focus', inputEvent[p], username);
	}
}

var inputEvent = {
	onfocus: function(obj){
		alert(1);
		obj.className = 'nt_login_input_focus';
	},
	
	onblur: function(){
		obj.className = 'nt_login_input_style';
	}
}
