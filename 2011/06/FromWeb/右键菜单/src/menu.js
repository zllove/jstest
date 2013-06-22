/**************************************************
* * 右键菜单
* * 2009-1-7
* **************************************************
* * msn:danxinju@hotmail.com
* * author:淡新举
***************************************************/
var Menu = function(){
	this.trigger = null;	/*事件源对象*/
	this.width = 180;	/*菜单宽度*/
	this.wraper = null;	/*最外层对象*/
	this.currItem = null;	/*当前被操作菜单项*/
	this.xml = null;	/*xml文件*/
	this.xmlString = null;	/*xml串*/
	this.mainNode = null;	/*主菜单*/

	this.childNodes = [];	/*所有菜单*/
};

/*@注册事件*/
Menu.prototype.regEvent = function(){
	
	var self = this;
	
	/*单击文档关闭*/
	sl.addEventHandler(document ,"click" ,function(){
		self.close();
	});

	/*触发对象事件绑定*/
	if (this.trigger)
	{
		sl.addEventHandler(document ,"contextmenu" ,function(e){
			if (e.preventDefault)
			{
				e.stopPropagation();
				e.preventDefault();    
			}
			return false;
		});

		sl.addEventHandler(this.trigger ,"mousedown" ,function(e){
			e = e?e:event;
			if (e.button == 2)
			{
				self.close();
				self.show(e);
			}
		});
	}
};

/*@设定属性*/
Menu.prototype.setAttribute = function(){
	
	/*设定菜单属性*/
	for (var i=0;i<this.childNodes.length ;i++ )
	{
		this.setMenuAttribute(this.childNodes[i]);
	}

	/*设定菜单项属性*/
	var li = sl.getElement("li" ,this.wraper);
	for (var i=0;i<li.length ;i++ )
	{
		this.setItemAttribute(li[i]);
	}
};

/*@设定菜单属性*/
Menu.prototype.setMenuAttribute = function(menu){

	menu.style.display = "none";
	menu.style.width = this.width +"px";
	var ul = sl.getElement("ul" ,menu);
	ul[ul.length-1].className = "last";
};

/*@设定菜单项属性*/
Menu.prototype.setItemAttribute = function(item){

	var self = this;

	if (item.getAttribute("enabled") != "false")
	{
		sl.addEventHandler(item ,"mouseover" ,function(){
			self.mouseover(item);
		});
		sl.addEventHandler(item ,"mouseout" ,function(){
			self.mouseout(item);	
		});

		if (item.getAttribute("child") != null)
		{
			item.innerHTML = "<span class=\"prevMark\">"
							 + item.innerHTML
							 + "</span><span class=\"mark\">►</span>";
				
			sl.addEventHandler(item ,"click" ,function(e){
				Menu.cancelBubble(e);	
			});
		}
	}
	else
	{
		sl.addEventHandler(item ,"click" ,function(e){
			Menu.cancelBubble(e);	
		});
		item.style.color = "#D7CFBE";
	}
	item.className = "out";
};

/*@鼠标经过*/
Menu.prototype.mouseover = function(o){
	this.closeChildren(o.parentNode.parentNode);
	o.className = "over";

	if (o.getAttribute("child") != null)
	{
		this.currItem = o;
		this.showChildren(o ,o.getAttribute("child"));
	}
};

/*@鼠标离开*/
Menu.prototype.mouseout = function(o){
	if (o != this.currItem)
	{
		o.className = "out";
	}
};

/*@显示子菜单*/
Menu.prototype.showChildren = function(o ,id){
	var pos = sl.getElementPos(o);
	var n = document.getElementById(id);
	if (n)
	{
		n.style.top = pos.y +"px";
		n.style.left = (pos.x + this.width - 15) +"px";
		n.style.display = "";
	}
};

/*@关闭子菜单*/
Menu.prototype.closeChildren = function(parentNode){
	var li = parentNode.getElementsByTagName("li");
	var n;
	for (var i=0;i<li.length ;i++ )
	{
		li[i].className = "out";

		if (li[i].getAttribute("child") != null)
		{
			n = document.getElementById(li[i].getAttribute("child"));
			if (n)
			{
				this.closeChildren(n);
				n.style.display = "none";
			}
		}
	}
};

/*@显示主菜单*/
Menu.prototype.show = function(e ,align){
	Menu.cancelBubble(e);
	e = e?e:event;
	var ele = e.target?e.target:e.srcElement;
	var pos;
	if (this.trigger)
	{
		pos = sl.getMousePos(e);
	}
	else
	{
		pos = sl.getElementPos(ele);
		if (align == "left")
		{
			pos.y = pos.y + ele.offsetHeight;
		}
		if (align == "right")
		{
			pos.x = pos.x + ele.offsetWidth;
		}
	}

	this.mainNode.style.top = pos.y +"px";
	this.mainNode.style.left = pos.x +"px";
	this.mainNode.style.display = "";
};

/*@关闭主菜单*/
Menu.prototype.close = function(){
	for (var i=0;i<this.childNodes.length ;i++ )
	{
		this.childNodes[i].style.display = "none";
	}
};

/*@加载数据文件*/
Menu.prototype.loadXml = function(){
	var self = this;
	if (this.xml)
	{
		sl.ajax(this.xml ,function(text){
			self.xmlString = text;
		} ,"get");
	}	
};

/*@解析数据文件*/
Menu.prototype.resolve = function(){
	var guid = Menu.getGuid();
	var xml = this.xmlString;
	xml = xml.replace("<root>" ,"<div id=\""+ guid +"\">");
	xml = xml.replace("</root>" ,"</div>");
	xml = xml.replace(/<menu/g ,"<div class=\"menu\"");
	xml = xml.replace(/<\/menu>/g ,"</div>");

	var div = document.createElement("div");
	div.innerHTML = xml;
	document.body.appendChild(div);
	
	this.wraper = sl.getElement("#"+ guid);
	this.childNodes = sl.getElement("div" ,this.wraper);
	this.mainNode = this.childNodes[0];
};

/*@获取guid*/
Menu.getGuid = function(){
	var guid = "";
	for(var i=1;i<=32;i++)
	{
		var n = Math.floor(Math.random()*16.0).toString(16);
		guid += n;
	}

	return guid;
}

/*@取消事件冒泡*/
Menu.cancelBubble = function(e){
	e = e?e : event;
	if (e.stopPropagation)
	{
		e.stopPropagation();
	}
	else
	{
		e.cancelBubble = true;
	}
};

/*@初始化程序*/
Menu.prototype.init = function(){
	
	/*加载xml*/
	this.loadXml();

	/*解析数据*/
	this.resolve();
	
	/*注册事件*/
	this.regEvent();
	
	/*设定属性*/
	this.setAttribute();

};
