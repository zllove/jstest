var xmlHttp

function sajax(typ, str)//定义一个函数：showHint，函数showHint有两个参数typ,str
{
    type = typ; //声明一个变量type,并将函数showHint的一个参数typ赋值给变量type
    if (str.length == 0)    //判断函数showHint的第二个参数（也就是我们按下键盘时当前表单项的当前值）的长度，如果长度等于零，那么执行以下语句
    {
        document.getElementById(type).innerHTML = ""
        //接上，如果参数长度是零，则替换ID为typ（用来代称第一个传进来参数typ的值）的容器的内容替换为空（空字符，也就是""）
        //document,英文含义，当是名词时（n），是文件文档的意思，在JS中，代指我们当前的HTML文档对象，每个载入浏览器的 HTML 文档都会成为 Document 对象。
        //既然是对象，就有属性，方法，此处用到的方法getElementById()的作用是查找具有指定的唯一 ID 的元素
        //当我们找到这个元素时候，innerHTML 属性设置或返回表格行的开始和结束标签之间的 HTML，例如：我们的reg.php中的ID为‘sna’的元素{<span id="sna">*(最多30个字符)</span>}（大括号中的，不包含大括号）
        //我们通过设置元素sna的innerHTML属性，就可替换标签中的内容，例如
        //当前内容为{<span id="sna">*(最多30个字符)</span>}
        //我们通过innerHTML属性设置，当前假设执行如下语句：document.getElementById("sna").innerHTML=""，则内容变为""
        //当前为{<span id="sna"></span>}，如果执行如下语句：document.getElementById("sna").innerHTML="I love U"，
        //则内容变为I love U,当前为{<span id="sna">I love U</span>}，也就是说内容变化了而容器没变
        //内容不限定为字符，HTML代码也可，例如执行如下语句：document.getElementById("sna").innerHTML="<br>HTML也是可以的<br>"之后，
        //则变为{<span id="sna"><br>HTML也是可以的<br></span>}
        return
        //返回，如果这个不懂的话.........>_<
    }
    xmlHttp = GetXmlHttpObject()
    //声明变量xmlHttp，xmlHttp的值为自定义函数GetXmlHttpObject()的返回值，
    //GetXmlHttpObject()函数的作用下面详述！~
    if (xmlHttp == null)    //如果我们通过以上语句‘xmlHttp=GetXmlHttpObject()’执行之后，变量xmlHttp（一个对象）的值为null也就是空，那么执行如下语句块
    {
        alert("浏览器不支持！")
        //当xmlHttp==null成立的时候说明当前浏览器不支持，弹出带有“浏览器不支持！”字样的提示框！
        //alert：alert() 方法用于显示带有一条指定消息和一个 OK 按钮的警告框。语法：alert(message)。参数解释：要在 window 上弹出的对话框中显示的纯文本（而非 HTML 文本）
        return
        //...........谁问我，我、我、我......
    }
    var url = "uchk1.php"
    //声明一个变量url，赋值....
    url = url + "?q=" + str;
    //拼接字符串......str是什么？自己看
    url = url + "&tp=" + typ
    //拼接字符串......typ是什么？自己看，能用type吗？自己想
    url = url + "&sid=" + Math.random();
    //拼接字符串,我们拼接的字符串是作为URL处理的，为了防止调用缓存，所以加上了一个随机数，以保证每次结果均不相同
    //Math，对象,是JS中的 Math对象，用于执行数学任务，其中有random() 方法。
    //random() 方法可返回介于 0 ~ 1 之间的一个随机数。语法如下：Math.random()。返回值：0.0 ~ 1.0 之间的一个伪随机数。例如：0.2355415636412345。
    xmlHttp.onreadystatechange = stateChanged;
    //xmlHttp中的onreadystatechange属性
    //onreadystatechange 属性存有处理服务器响应的函数。
    //下面的代码定义一个空的函数，可同时对 onreadystatechange 属性进行设置：
    //xmlHttp.onreadystatechange=function()
    //  {
    //  // 我们需要在这里写一些代码,写什么，你自己决定
    //  }
    //readyState 属性存有服务器响应的状态信息。每当 readyState 改变时，onreadystatechange 函数就会被执行。
    //这是 readyState 属性可能的值：
    //状态        描述
    //0        请求未初始化（在调用 open() 之前）
    //1        请求已提出（调用 send() 之前）
    //2        请求已发送（这里通常可以从响应得到内容头部）
    //3        请求处理中（响应中通常有部分数据可用，但是服务器还没有完成响应）
    //4        请求已完成（可以访问服务器响应并使用它）
    //我们要向这个 onreadystatechange 函数添加一条 If 语句，来测试我们的响应是否已完成（意味着可获得数据）：
    //xmlHttp.onreadystatechange=function()
    // {
    //if(xmlHttp.readyState==4)
    //  {
    // 从服务器的response获得数据,这里用到了另外一个属性，responseText 属性
    //  }
    //}
    //可以通过 responseText 属性来取回由服务器返回的数据。
    //例如，在如下代码中，我们将把时间文本框的值设置为等于 responseText：
    //xmlHttp.onreadystatechange=function()
    // {
    //if(xmlHttp.readyState==4)
    // {
    // document.myForm.time.value=xmlHttp.responseText;
    // }
    //}
    xmlHttp.open("GET", url, true)
    xmlHttp.send(null)
    //以上两句一起说明
    /*

     如需将请求发送到服务器，我们使用 XMLHttpRequest 对象的 open() 和 send() 方法：

     xmlhttp.open("GET","test1.txt",true);

     xmlhttp.send();

     方法        描述

     open(method,url,async)        规定请求的类型、URL 以及是否异步处理请求。

     method：请求的类型；GET 或 POST

     url：文件在服务器上的位置

     async：true（异步）或 false（同步）

     send(string)

     将请求发送到服务器。

     string：仅用于 POST 请求

     GET 还是 POST？

     与 POST 相比，GET 更简单也更快，并且在大部分情况下都能用。

     然而，在以下情况中，请使用 POST 请求：

     无法使用缓存文件（更新服务器上的文件或数据库）

     向服务器发送大量数据（POST 没有数据量限制）

     发送包含未知字符的用户输入时，POST 比 GET 更稳定也更可靠

     GET 请求

     一个简单的 GET 请求：

     xmlhttp.open("GET","uchk.php",true);//这里的"uchk.php"可使用我们拼接的URL

     xmlhttp.send();

     POST 请求

     一个简单 POST 请求：

     xmlhttp.open("POST","uchk.php",true);

     xmlhttp.send();

     如果需要像 HTML 表单那样 POST 数据，请使用 setRequestHeader() 来添加 HTTP 头。然后在 send() 方法中规定您希望发送的数据：

     xmlhttp.open("POST","ajax_test.php",true);

     xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");

     xmlhttp.send("fname=Bill&lname=Gates");

     方法        描述

     setRequestHeader(header,value)          向请求添加 HTTP 头。

     header: 规定头的名称

     value: 规定头的值

     */

}

function stateChanged()//自定义函数，此函数每当 readyState 改变时就会被执行，此函数对应onreadystatechange 函数。
{
    if (xmlHttp.readyState == 4 || xmlHttp.readyState == "complete") //  xmlHttp.status =200
    //请参考以上说明
    {
        document.getElementById(type).innerHTML = xmlHttp.responseText;
        //请参考以上说明
    }
    return true;
    //返回
}

function GetXmlHttpObject()//自定义函数，此函数用来创建一个AJAX对象，并通过return返回，此函数有返回值
{
    var xmlHttp = null;
    //首先声明变量，默认值是null
    try    /*
     try...catch 可以测试代码中的错误。try 部分包含需要运行的代码，而 catch 部分包含错误发生时运行的代码。
     try//可理解为尝试执行{}中的代码块，如果不成功或者有错误，就抛出异常
     {
     //在此运行代码
     }
     catch(err)
     这里处理抛出的异常，也就是错误，错误在下面{}中处理
     {
     //在此处理错误
     }
     */
    {
        // Firefox, Opera 8.0+, Safari
        xmlHttp = new XMLHttpRequest();
        //尝试创建XMLHttpRequest对象，
        /*
         什么是 XMLHttpRequest 对象？
         XMLHttpRequest 对象用于在后台与服务器交换数据。
         XMLHttpRequest 对象是开发者的梦想，因为您能够：
         在不重新加载页面的情况下更新网页
         在页面已加载后从服务器请求数据
         在页面已加载后从服务器接收数据
         在后台向服务器发送数据
         所有现代的浏览器都支持 XMLHttpRequest 对象。
         创建 XMLHttpRequest 对象
         所有现代浏览器 (IE7+、Firefox、Chrome、Safari 以及 Opera) 都内建了 XMLHttpRequest 对象。
         通过一行简单的 JavaScript 代码，我们就可以创建 XMLHttpRequest 对象。
         创建 XMLHttpRequest 对象的语法：
         xmlhttp=new XMLHttpRequest();
         老版本的 Internet Explorer （IE5 和 IE6）使用 ActiveX 对象：
         xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
         */
    }
    catch (e) {
        /*如果创建 XMLHttpRequest 对象失败，则进入此模块处理错误，这个是一个嵌套的模式。在 catch 中嵌套了一个try...catch
         老版本的 Internet Explorer （IE5 和 IE6）使用 ActiveX 对象，创建 XMLHttpRequest 对象失败，
         所以我们就尝试创建 ActiveX 对象
         xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");//IE6可用
         或者
         xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");//IE5可用
         */
        try {
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    return xmlHttp;
}
