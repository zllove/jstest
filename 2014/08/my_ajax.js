function my_ajax(url, success, fail){
    var ajax = null;
    if(window.XMLHttpRequest){
        ajax = new XMLHttpRequest();
    } else {
        ajax = new ActiveXObject('Microsoft.XMLHTTP');
    }

    ajax.open('get', url, true);
    ajax.send(null);

    ajax.onreadystatechange = function(){
        if(ajax.readyState == 4){
            if(ajax.status == 200){
                success(ajax.responseText);
            } else {
                fail && fail(ajax.status);
            }
        }
    }
}