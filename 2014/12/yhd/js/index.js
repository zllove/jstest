/*
**时间：2014.12.9
**作者：刘呈祥
**对遇到的一些效果进行集合
*/
function fnSlide(opt){
    return new fnTab(opt);
}
function fnTab(opt){
    this.oBox = document.getElementById(opt.id);       
    this.oUl = getClass(this.oBox,opt.mainCeil)[0];
	this.aLi = this.oUl.children;
	this.oL = getClass(this.oBox,opt.titCeil)[0];
	this.aBtn = this.oL.children;                                  
	this.aBtnclassName = opt.aBtnclassName||null;                      //获取按钮class 
	this.trigger = opt.trigger||omouseover;                            //事件
	this.effect = opt.effect;                                          //运动方式
	this.toPlay = opt.autoPlay||false;                                 //是否自动播放
	this.offset = opt.offset||null;                                    //获取偏移量
	this.oPrev = getClass(this.oBox,opt.prevCeil)[0]||null;            //是否上一张按钮
	this.oNext = getClass(this.oBox,opt.NextCeil)[0]||null;            //是否有下一张按钮
	this.iVis = parseInt(opt.vis)||1;                                  //复制的个数
	this.Progress = opt.Progress||false;                               //按钮进度条
	this.iLeng = this.aLi.length;                                      
	this.iNow = 0;
	this.iNum = this.iVis;
	this.iTal = 0;
	this.timer = null;
	this.onOff = true;                                                 //开关 
	this.init();
}
fnTab.prototype.init = function(){
    var _this = this; 
	if(!this.offset){
	    if(this.effect == 'left'){
		    this.offset = this.aLi[0].offsetLeft; 
		}else if(this.effect == 'top'){
		    this.offset = this.aLi[0].offsetTop;  
		}  
	}
	/*---判断运动形式 top,left,leftLoop,fold,进行相对的css操作----*/
	switch(this.effect){
	    case "top":
		    for(var i=0;i<this.aLi.length;i++){
			    this.aLi[i].style.display = 'list-item'; 
			}  
        break;
        case "leftLoop":
            for(var i=0;i<this.iVis;i++){
			   var oClone = this.aLi[i].cloneNode(true);
			   oClone.className = 'clone';
			   this.oUl.appendChild(oClone);
			}
            for(var i=0;i<this.iVis;i++){
			   var oClone = this.aLi[this.iLeng-i-1].cloneNode(true);
			   oClone.className = 'clone';
			   this.oUl.insertBefore(oClone,this.aLi[0]);
			}
			for(var i=0;i<this.aLi.length;i++){
			    this.aLi[i].style.display = 'list-item';
				if(this.aLi[0].currentStyle){
					this.aLi[i].style.styleFloat = 'left';
				}else{
					this.aLi[i].style.cssFloat = 'left'; 
				}     
			}
			this.oUl.style.width = this.offset * this.aLi.length+'px';
            var oWrap = document.createElement('div');
			oWrap.className = 'tempWrap'
			this.oBox.insertBefore(oWrap,this.oBox.children[0]);
            oWrap.appendChild(this.oUl);
            oWrap.style.position = 'relative';
            oWrap.style.width = this.offset * this.iLeng+'px';
            this.oUl.style.left = -this.iVis * this.offset + 'px'; 			
		break;		
	}
	/*-----按钮-----*/
	for(var i=0;i<this.aBtn.length;i++){
	    this.aBtn[i].index = i;
		fnbind(this.aBtn[i],this.trigger,function(){
		    _this.iNow = this.index;
			_this.iNum = this.index+_this.iVis-1;
            _this.fnToMove(); 
		})
	};
	/*---点击下一张--*/
	if(this.oNext){
	   fnbind(this.oNext,'click',function(){
	        _this.fnToNext(); 
	   })
	};
	/*---点击上一张----*/
	if(this.oPrev){
		fnbind(this.oPrev,'click',function(){
		    _this.fnToPrev();
		})
	}
	/*-----自动播放----*/
	if(this.toPlay){
		this.timer = setInterval(function(){
		    _this.autoPlay(); 
			if(_this.Progress){
			    var oChild = _this.aBtn[_this.iNow].children[0];
				var iW = parseInt(getStyle(oChild,'width'));			
				oChild.style.width = 0;
				startMove(oChild,{width:iW},4000,'linear');
			}
		},4000);
		fnbind(this.oBox,'mouseover',function(){
		    clearInterval(_this.timer);    
		});
		fnbind(this.oBox,'mouseout',function(){
		    _this.timer = setInterval(function(){
				_this.autoPlay();
                if(_this.Progress){
					var oChild = _this.aBtn[_this.iNow].children[0];
					var iW = parseInt(getStyle(oChild,'width'));			
					oChild.style.width = 0;
					startMove(oChild,{width:iW},4000,'linear');
				}				
			},4000); 
		});
	};
};
/*---自动播放跟下一张的运动处理---*/
fnTab.prototype.fnToMove = function(){
    var _this = this;
	switch(this.effect){
	    case "fold":
			for(var i=0;i<this.aBtn.length;i++){
				if(this.aBtnclassName){
				   removeClass(this.aBtn[i],this.aBtnclassName);
				}
				startMove(this.aLi[i],{opacity:0},500,'easeBoth',function(){
					this.style.display = 'none'; 
				});     
			}
			if(this.aBtnclassName){
			   addClass(this.aBtn[this.iNow],this.aBtnclassName);
			}
			this.aLi[this.iNow].style.display = 'list-item';
			startMove(this.aLi[this.iNow],{opacity:100},500,'easeBoth');
        break;	
		case "top":
			for(var i=0;i<this.aBtn.length;i++){
				if(this.aBtnclassName){
				   removeClass(this.aBtn[i],this.aBtnclassName);
				}
			}
			if(this.aBtnclassName){
			   addClass(this.aBtn[this.iNow],this.aBtnclassName);
			}
			startMove(this.oUl,{top:-this.iNow*this.offset},500,'easeBoth');
		break;
		case "leftLoop":
			for(var i=0;i<this.aBtn.length;i++){
				if(this.aBtnclassName){
				   removeClass(this.aBtn[i],this.aBtnclassName);
				}
			}
			if(this.aBtnclassName){
			   addClass(this.aBtn[this.iNow],this.aBtnclassName);
			}
			this.iNum++;
			startMove(this.oUl,{left:-this.iNum*this.offset},500,'easeOutStrong',function(){
				_this.fnLoopNext();
				_this.onOff = true;
			});	
		break;
	}
};
/*---自动播放跟上一张的运动处理(主要针对Loop的运动模式)---*/
fnTab.prototype.fnToMovePrev = function(){
    var _this = this;
	switch(this.effect){
	    case "leftLoop":
		    for(var i=0;i<this.aBtn.length;i++){
				if(this.aBtnclassName){
				   removeClass(this.aBtn[i],this.aBtnclassName);
				}
			}
			if(this.aBtnclassName){
			   addClass(this.aBtn[this.iNow],this.aBtnclassName);
			}
			this.iNum--;
			startMove(this.oUl,{left:-this.iNum*this.offset},500,'easeOutStrong',function(){
				_this.fnLoopPrev();
				_this.onOff = true;
			});  
        break;	
	}
}
/*--自动播放的方法--*/
fnTab.prototype.autoPlay = function(){
    this.fniNum();
    this.fnToMove();	
};
/*--点击下一张的方法--*/
fnTab.prototype.fnToNext = function(){
    if(this.effect =='leftLoop'){
	    if(this.onOff){
		    this.onOff = false;
			this.fniNum();
	        this.fnToMove();
		}  
	}else{
	    this.fniNum();
	    this.fnToMove(); 
	}
};
/*--点击上一张的方法--*/
fnTab.prototype.fnToPrev = function(){
	if(this.effect =='leftLoop'){
	    if(this.onOff){
		    this.onOff = false;
			this.iNow == 0?this.iNow= this.iLeng-1:this.iNow--;
	        this.fnToMovePrev();
		}  
	}else{
	    this.iNow == 0?this.iNow=this.aLi.length-1:this.iNow--;   
	    this.fnToMove(); 
	}
};
/*--下一张数字处理--*/
fnTab.prototype.fniNum = function(){
    if(this.effect){
	    this.iNow == this.iLeng-1?this.iNow=0:this.iNow++;   		
	}else{
	    this.iNow == this.aLi.length-1?this.iNow=0:this.iNow++;  
	} 
};
/*--当是LoopLeft 返回第一张处理--*/
fnTab.prototype.fnLoopNext = function(){
    if(this.iNum == this.aLi.length-this.iVis){
        this.oUl.style.left = -this.offset*this.iVis+'px';
        this.iNum = this.iVis;		
	}
};
/*--当是LoopLeft 返回第最后张处理--*/
fnTab.prototype.fnLoopPrev = function(){
    if(this.iNum == this.iVis-1){
        this.oUl.style.left = -this.offset*(this.aLi.length-this.iVis-1)+'px';
        this.iNum = this.aLi.length-this.iVis-1;		
	}
};





function fnbind(obj,ev,fn){
    if(obj.attachEvent){
	   obj.attachEvent("on"+ev,function(){
	        fn.call(obj); 
	   });
	}else{
	   obj.addEventListener(ev,function(){
	        fn.call(obj); 
	   },false); 
	} 
}
function getClass(obj,aClass){
    var aEles = obj.getElementsByTagName('*');
    var aResult = [];
    for(var i=0;i<aEles.length;i++){
	    var aClassName = aEles[i].className.split(' ');
        for(var j=0;j<aClassName.length;j++){
		    if(aClassName[j] == aClass){
			    aResult.push(aEles[i]);  
			}
		}		
	}
    return aResult;  	
};
function addClass(obj,className){
    if(obj.className == ''){
	    obj.className = className; 
	}else{
	    var arrClassName = obj.className.split(' ');
        var _index = arrIndexOf(arrClassName,className);
        if(_index == -1){
		    obj.className +=' '+className;
		}		
	}
};
function removeClass(obj,className){
    if(obj.className != ''){
	    var arrClassName = obj.className.split(' ');
        var _index = arrIndexOf(arrClassName,className);
        if(_index != -1){
		    arrClassName.splice(_index,1);
            obj.className = arrClassName.join(' ');			
		}		
	}  
};
function arrIndexOf(arr,v){
    for(var i=0;i<arr.length;i++){
	    if(arr[i] == v){
		  return i;
		} 
	}
	return -1;
}