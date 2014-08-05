/**
 * @author: 豪情
 * @see: <a href="mailto:jikeytang@gmail.com">豪情</a>
 * @time: 8/4/14
 * @info:
 */
function ajax(url, success, fail){
    // 1. 创建连接
    var xhr = null;
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest()
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    // 2. 连接服务器
    xhr.open('get', url, true)

    // 3. 发送请求
    xhr.send(null);

    // 4. 接受请求
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                success(xhr.responseText);
            } else { // fail
                fail && fail(xhr.status);
            }
        }
    }

}
