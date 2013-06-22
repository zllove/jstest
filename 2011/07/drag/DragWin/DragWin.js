function DragWin(elem, title, width, height) {
    this.title = title;
    this.width = width;
    this.height = height;
    this.elem = elem;
}
DragWin.prototype = {
    createHead: function() {
        var winHead = document.createElement("div");
        var text = document.createTextNode(this.title);
        winHead.id = this.elem.id + "_head";
        winHead.style.width = this.width + "px";
        winHead.style.height = "20px";
        winHead.style.position = "absolute";
        winHead.style.cursor = "move";
        winHead.style.backgroundColor = "#0CF";
        winHead.style.margin = "auto";
        winHead.appendChild(text);
        return winHead;
    },
    createContainer: function() {
        var winContainer = document.createElement("div");
        winContainer.id = this.elem.id + "_Container";
        winContainer.style.width = this.width + "px";
        winContainer.style.height = this.height + 20 + "px";
        winContainer.style.border = "1px solid #000";
        winContainer.style.position = "absolute";
        winContainer.style.zIndex = "99";
        winContainer.style.left = 300 + "px";
        winContainer.style.top = 200 + "px";
        return winContainer;
    },
    startDrag: function(event) {
        event = event || window.event;
        var win = this.eventWin = event.target || event.srcElement;
        this.moveDiv = win.parentNode;
        var x = event.pageX || event.clientX;     //鼠标X坐标        
        var y = event.pageY || event.clientY;     //鼠标Y坐标        
        this.left = parseInt(this.moveDiv.style.left);        //层的坐标X        
        this.tops =  parseInt(this.moveDiv.style.top);        //层的坐标Y        
        this.left = x - this.left;           //鼠标离层X坐标的距离        
        this.tops = y - this.tops;           //鼠标离层Y坐标的距离        
        this.move = true;                    //开启拖动    
    },        
	drag: function(event) {
	    if (this.move) {
	        event = event || window.event;
	        var x = event.pageX || event.clientX;
	        var y = event.pageY || event.clientY; //当前鼠标坐标(鼠标移动中)减去鼠标离层坐上脚的坐标就是层移动的过程.            
	        this.moveDiv.style.left = x - this.left + "px";
	        this.moveDiv.style.top = y - this.tops + "px";
	        if (!window.captureEvents) {
	            this.eventWin.setCapture();
	        } else {
	            window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
	        }
	    }
	},
	stopDrag: function() {
	    this.move = false; //关闭拖拽     
	    //关闭鼠标监听       
	    if (!window.releaseEvents) {
	        this.eventWin.releaseCapture();
	    } else {
	        window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
	    }
	},
	show: function() {
	    var topWin = this.createHead();
	    var mainWin = this.createContainer();
	    if (window.event) {
	        topWin.attachEvent("onmousedown", this.startDrag);
	        topWin.attachEvent("onmousemove", this.drag);
	        topWin.attachEvent("onmouseup", this.stopDrag);
	    } else {
	        topWin.addEventListener("mousedown", this.startDrag, false);
	        topWin.addEventListener("mousemove", this.drag, false);
	        topWin.addEventListener("mouseup", this.stopDrag, false);
	    }
	    this.elem.style.position = "absolute";
	    this.elem.style.width = this.width;
	    this.elem.style.height = this.height;
	    this.elem.style.marginTop = "20px";
	    this.elem.style.borderTop = "1px solid #000";
	    this.elem.style.display = "block";
	    mainWin.appendChild(topWin);
	    mainWin.appendChild(this.elem);
	    document.body.appendChild(mainWin);
	}
}
        