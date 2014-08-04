/**
 * @author: 豪情
 * @see: <a href="mailto:jikeytang@gmail.com">豪情</a>
 * @time: 8/4/14
 * @info:
 */
function ajax(url, success, fail){
    // 1. 创建连接
    var ajax = null;
    if(window.XMLHttpRequest){
        ajax = new XMLHttpRequest()
    } else {
        ajax = new ActiveXObject('Microsoft.XMLHTTp')
    }

    // 2. 连接服务器
    ajax.send(method, url, true)

    // 3. 发送请求
    ajax.send()

    // 4. 接受请求
    ajax.onreadystatechange = function(){
        if(ajax.readyState == 4){
            if(ajax.status == 200){
                success(ajax.responseText);
            } else { // fail
                fail && fail(ajax.status);
            }
        }
    }

}
