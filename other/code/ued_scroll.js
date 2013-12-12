function uedScroll(scrollContId, arrLeftId, arrRightId, dotListId, scrollSplit, dotSplit, sSliceIndex, sDir, nStep, nType) {
    this.scrollContId = scrollContId;
    this.arrLeftId = arrLeftId;
    this.arrRightId = arrRightId;
    this.dotListId = dotListId;
    this.scrollSplit = scrollSplit;
    this.dotSplit = dotSplit;
    this.sSliceIndex = sSliceIndex;
    this.sDir = sDir;
    this.nStep = nStep;
    this.nType = nType;
	this.pageIndex = 0;
    this.autoPlay = false;
    this.autoPlayTime = 4;
    this._state = "ready";
    this._endIndex = 0;
    this._forIndex = 0;
    this.nbuffer = 30;
	this.pageDot = [];
    this.stripDiv = document.createElement("DIV");
    this.listDiv01 = document.createElement("DIV");
    this.listDiv02 = document.createElement("DIV");
    if (!uedScroll.childs) {
        uedScroll.childs = []
    };
    this.ID = uedScroll.childs.length;
    uedScroll.childs.push(this);
    this.init = function() {
        this.scrollContObj = uedCommon.fn.getEbyId(this.scrollContId);
        this.listDiv01.innerHTML = this.listDiv02.innerHTML = this.scrollContObj.innerHTML;
        this.scrollContObj.innerHTML = "";
        this.scrollContObj.appendChild(this.stripDiv);
        this.stripDiv.appendChild(this.listDiv01);
        this.SplitObj = uedCommon.fn.getEbyClass(this.scrollContObj, this.scrollSplit.mytag, this.scrollSplit.myclass);
        this._endIndex = this.SplitObj.length;
		switch (this.sDir) {
        case 1:
            this.sDir = {
                ContObj: "scrollLeft",
                SplitObj: "offsetLeft"
            };
			this.mar = "marginLeft";
            this.stripDiv.style.width = "32766px";
            this.listDiv01.style.cssFloat = "left";
			this.listDiv02.style.cssFloat = "left";
            break;
        case 2:
            this.sDir = {
                ContObj: "scrollTop",
                SplitObj: "offsetTop"
            };
			this.mar = "marginTop";
            this.stripDiv.style.height = "32766px";
            break;
        };
        switch (this.nType) {
        case 1:
            this.leftEnd = function() {
                if (this.SplitObj.length % this.sSliceIndex != 0) {
                    var x = this.SplitObj.length % this.sSliceIndex;
                } else {
                    var x = this.sSliceIndex;
                }
                this.pageIndex = this.SplitObj.length - x;
                this.nStep = this.nYuanStep;
                this.nStep = this.nStep * 2;
                this.sGoTo = "next";
            };
            this.rightEnd = function() {
                this.pageIndex = 0;
                this.nStep = this.nYuanStep;
                this.nStep = this.nStep * 2;
                this.sGoTo = "prve";
            };
            break;
        case 2:
		    this._LoopCase();
            break;
		case 3:
		    this._LoopCase();
            break;
        default:
            break;
        };
        this.nYuanStep = this.nStep;
        uedCommon.fn.addEvent(this.scrollContObj, "mouseover", Function("uedScroll.childs[" + this.ID + "].stop()"));
        uedCommon.fn.addEvent(this.scrollContObj, "mouseout", Function("uedCommon.fn.realOut(uedScroll.childs[" + this.ID + "].scrollContObj,event,function(){uedScroll.childs[" + this.ID + "].play()})"));
        if (this.arrLeftId) {
            this.arrLeftObj = uedCommon.fn.getEbyId(this.arrLeftId);
            if (this.arrLeftObj) {
                uedCommon.fn.addEvent(this.arrLeftObj, "click", Function("uedScroll.childs[" + this.ID + "].clicks(1)"));

            }
        };
        if (this.arrRightId) {
            this.arrRightObj = uedCommon.fn.getEbyId(this.arrRightId);
            if (this.arrRightObj) {
                uedCommon.fn.addEvent(this.arrRightObj, "click", Function("uedScroll.childs[" + this.ID + "].clicks(2)"));
            }
        };
		if (this.dotListId) {
            this.dotListObj = uedCommon.fn.getEbyId(this.dotListId);
            if (this.dotListObj) {
				this.pageNum = Math.ceil(this._endIndex / this.sSliceIndex);
				this.dotMod = this.dotListObj.innerHTML;
				this.dotListObj.innerHTML = "";
				for(i=0;i<this.pageNum;i++){
					this.dotListObj.innerHTML += this.dotMod;
				};
				this.dotObj = uedCommon.fn.getEbyClass(this.dotListObj,this.dotSplit.mytag,this.dotSplit.myclass);
				var xy = 0;
				for(i=0;i<this.pageNum;i++){
					uedCommon.fn.addEvent(this.dotObj[i], this.Events, Function("uedScroll.childs[" + this.ID + "].pageTo("+xy+")"));
					this.pageDot.push(xy);
					xy += this.sSliceIndex;
					
				};
				this.dotObj[0].className = this.dotSplit.cur;
			    this.dotCurClass = function(){
					for(i=0;i<this.pageNum;i++){
						if(this.pageIn(i)){
							this.dotObj[i].className = this.dotSplit.cur;
						}else{
							if(this.dotSplit.offing){
							  this.dotObj[i].className = this.dotSplit.offing;
							}else{
							  this.dotObj[i].className = "";
							}
						};
					}
				};
            }
        };
        this.play();
    };
	this._LoopCase = function(){
	  this._forIndex = this.sSliceIndex;
            this.stripDiv.appendChild(this.listDiv02);
            this.SplitObj = uedCommon.fn.getEbyClass(this.scrollContObj, this.scrollSplit.mytag, this.scrollSplit.myclass);
			this.leftEnd = function() {
				if(this.pageIndex-this.sSliceIndex<0 && this.pageIndex != 0){
				  this.pageIndex = this._endIndex - (this.pageIndex-this.sSliceIndex);
				}else{
				  this.pageIndex = this._endIndex;
				};
                this.nStep = this.nYuanStep;
                this.scrollContObj[this.sDir.ContObj] = this.SplitObj[this.pageIndex][this.sDir.SplitObj];
                this.pageIndex = this.pageIndex - this.sSliceIndex;
                this.sGoTo = "prve";
            };
            this.rightEnd = function() {
                if (this.pageIndex >= this._endIndex) {
                    if (this._endIndex % this.sSliceIndex != 0 && this.pageIndex!=this._endIndex) {
                        var x = this._endIndex % this.sSliceIndex;
                    } else {
                        var x = this.sSliceIndex;
                    }
                    if (this._forIndex <= 0 || this._forIndex-x <= 0) {
                        this._forIndex = 0;
                    } else {
                        this._forIndex -= x
                    }
                    this.scrollContObj[this.sDir.ContObj] = this.SplitObj[this._forIndex][this.sDir.SplitObj];
                    this.pageIndex = this._forIndex;
                    if (this._forIndex <= 0) {
                        this._forIndex = this.sSliceIndex;
                    }
                }
            }
	};
    this.clicks = function(n) {
		if (this.nType == 3) {}
	    else{
		      if (this._state != "ready") {
                  return;
                }
		 }
		clearInterval(this._autoTimeObj);
        if (n == 1) {
            if (this.pageIndex <= 0 || (this.pageIndex-this.sSliceIndex<0 && this.pageIndex != 0) ) {
                this.leftEnd();
            } else {
                this.pageIndex -= this.sSliceIndex;
                this.nStep = this.nYuanStep;
                this.sGoTo = "prve";
            }
        } else if (n == 2) {
            if (this.pageIndex + this.sSliceIndex >= this.SplitObj.length) {
                this.rightEnd();
            } else {
                this.pageIndex += this.sSliceIndex;
                this.nStep = this.nYuanStep;
                this.sGoTo = "next";
            }
        };
		this._state = "floating";
		if(this.dotCurClass){this.dotCurClass();}
        this._scrollTimeObj = setInterval("uedScroll.childs[" + this.ID + "]." + this.sGoTo + "(" + (this.pageIndex) + "," + this.nStep + ",{ContObj:'" + this.sDir.ContObj + "',SplitObj:'" + this.sDir.SplitObj + "'})", 10)
    },
    this.prve = function(nIndex, nStep, sDir) {
		if(isNaN(parseInt(uedCommon.fn.getStyle(this.SplitObj[nIndex],this.mar)))){
		  var y = 0;
		}else{
		  var y = parseInt(uedCommon.fn.getStyle(this.SplitObj[nIndex],this.mar));
		}
		var x = this.SplitObj[nIndex][sDir.SplitObj] - y;
        if (this.scrollContObj[sDir.ContObj] > x) {
            if (Math.ceil(this.scrollContObj[sDir.ContObj] - this.SplitObj[nIndex][sDir.SplitObj]) <= this.nbuffer) {
                this.scrollContObj[sDir.ContObj]--;
            } else {
                this.scrollContObj[sDir.ContObj] -= nStep;
            }
        } else {
            clearInterval(this._scrollTimeObj);
            this._state = "ready"
			this.play();
			
        }
    };
    this.next = function(nIndex, nStep, sDir) {
		if(isNaN(parseInt(uedCommon.fn.getStyle(this.SplitObj[nIndex],this.mar)))){
		  var y = 0;
		}else{
		  var y = parseInt(uedCommon.fn.getStyle(this.SplitObj[nIndex],this.mar));
		}
		var x = this.SplitObj[nIndex][sDir.SplitObj] - y;
        if (this.scrollContObj[sDir.ContObj] < x) {
            if (Math.ceil(this.SplitObj[nIndex][sDir.SplitObj] - this.scrollContObj[sDir.ContObj]) <= this.nbuffer) {
                this.scrollContObj[sDir.ContObj]++;
            } else {
                this.scrollContObj[sDir.ContObj] += nStep;
            }
        } else {
            clearInterval(this._scrollTimeObj);
            this._state = "ready";
            if (this.nType == 2 || this.nType == 3) {
                this.rightEnd();
            };
			this.play();
        }
    };
	this.pageTo = function(n){
		if (this.nType == 3) {}
	    else{
		      if (this._state != "ready") {
                  return;
                }
		 }
		clearInterval(this._autoTimeObj);
		this.pageIndex = n;
		if (this.scrollContObj[this.sDir.ContObj] > this.SplitObj[n][this.sDir.SplitObj]){
		  var x ="prve"
		}else{
		  var x ="next"
		};
		this._state = "floating";
		if(this.dotCurClass){this.dotCurClass();}
        this._scrollTimeObj = setInterval("uedScroll.childs[" + this.ID + "]." + x + "(" + (this.pageIndex) + "," + this.nStep + ",{ContObj:'" + this.sDir.ContObj + "',SplitObj:'" + this.sDir.SplitObj + "'})", 10)
	};
	this.pageIn = function(n){
		var x = this.pageDot[n] - this.sSliceIndex;
		if(x < 0){x = 0};
		if(this.pageIndex >= this._endIndex){
		  y = this.pageIndex - this._endIndex;
		}else{
		  y = this.pageIndex;
		}
		if(y>x && y <= this.pageDot[n] || (y==0 && y==this.pageDot[n])){
			return true;
		}else{return false;}
	};
    this.play = function() {
        if (!this.autoPlay) {
            return;
        };;
		if (this.nType == 3) {}
	    else{
		      if (this._state != "ready") {
                  return;
                }
		 }
        this._autoTimeObj = setInterval("uedScroll.childs[" + this.ID + "].clicks(2)",this.autoPlayTime*1000)
    };
    this.stop = function() {
        if (this.nType == 3) {}
	    else{
		      if (this._state != "ready") {
                  return;
                }
		 }
            clearInterval(this._autoTimeObj);
			if (this.nType == 3) {
			  clearInterval(this._scrollTimeObj);
			};
    };
};/*  |xGv00|de1eac7133af1d9bc2beab10ec90f6d9 */