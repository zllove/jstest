function $d(id){ return document.getElementById(id); }

var oUl = $d('i_biology'), olis = oUl.getElementsByTagName('li');
for(var i=0; i<olis.length; i++){
	olis[i].onmouseover = olis[i].onmouseout = function(){
		olis[i].className = olis[i].className == '' ? 'bio_list' : '';
	}
}
