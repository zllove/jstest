/**
 * Created by jikey.
 * Link: jikeytang@gmail.com
 * Date: 12-2-10
 * Time: 上午9:44
 * Info:
 */
function myLogger(id){
    id = id || 'ADSLogWindow';
    // 私有属性
    var logWindow = null;
    // 私有方法，受保护
    // 创建日志窗口
    var createWindow = function(){
        // 新窗口在浏览器中，默认居中放置
        var browserWindowSize = ADS.getBrowserWindowSize(),
            top = ((browserWindowSize.height - 200) / 2) || 0,
            left = ((browserWindowSize.width - 200) / 2) || 0;
        // 创建日志窗口的DOM节点，使用私有属性
        logWindow = document.createElement('ul');
        logWindow.id = id;
        logWindow.style.cssText = 'position:absolute;top:' + top + 'px;left:' + left + 'px;width:200px;height:200px;overflow:scroll;margin:0;padding:0 0 0 5px;border:1px solid #ccc;background:#f0f0f0;font:12px/23px arial;';
        document.body.appendChild(logWindow); // 将其添加到主文档中
    };
    /**
     * 特权方法(公有方法)
     * 创建消息列表
     * @param message 消息内容
     */
    this.writeRaw = function(message){
        // 当初始窗口不存在时，创建他
        if(!logWindow){ createWindow(); }
        // 创建列表项
        var li = document.createElement('li');
        li.style.cssText = 'padding:2px;border:0;border-bottom:1px solid #ccc;margin:0;color:#333;';
        // 为节点添加信息
        if(typeof message == 'undefined'){
            li.appendChild(document.createTextNode('Message was no undefined.'));
        } else if(typeof li.innerHTML != undefined){
            li.innerHTML = '<b style="color:#c0c0c0;">•</b> ' + message;
        } else {
            li.appendChild(document.createTextNode(message));
        }
        // 添加到日志窗口
        logWindow.appendChild(li);
    };
};
// 公有方法
myLogger.prototype = {
    write: function(message){
        // 若message 为空
        if(typeof message == 'string' && message.length == 0){
            return this.writeRaw('ADS.log: null message');
        }
        // 若message不是字符串，则尝试试用toString,如果不存在该访问则记录对象类型
        if(typeof message != 'string'){
            if(message.toString){
                return this.writeRaw(message.toString());
            } else {
                return this.writeRaw(typeof message);
            }
        }
        // 转换<>以便.innerHTML不会将message做为HTML进行解析
        message = message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return this.writeRaw(message);
    },
    // 标题
    header: function(message){
        message = '<span style="color:#333;background:#f1f1f1;font-weight:bold;padding:0 5px;">' + message + '</span>';
        return this.writeRaw(message);
    }
};

if(!window.ADS){ window['ADS'] = {}; }
window['ADS']['log'] = new myLogger();



