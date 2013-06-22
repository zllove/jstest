<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<title>切片录入</title>
<link href="css/style.css" rel="stylesheet" type="text/css">
<style type="text/css">
<!--
.btn{
	background-color: #ffffff;
	border-color:black;
	width:200px;
	height:35px;
	font-size: 22;
}

.btns{
	background-color: #ffffff;
	border-color:black;
	width:200px;
	height:35px;
	font-size: 22;
	margin-top: 25;
}

.hbtn{
	margin-top: 25;
}
-->
</style>
<script src="scripts/jquery.min.js"></script>
<script>
 //［［切片号,序号,URL，图像左边，图像顶边，图像高，图像宽,字段ID，提示信息(暂时空)，初始值，FileNum］
	 var datas;
	 var isWork=0;
	 var isQC=false;
	$(document).ready(function(){
		isQC=window.parent.returnIsQc();
		var workNum=window.parent.returnWorkListNum();
		if(workNum==null)
		{
			workNum='';
		}
		document.getElementById("workNum").innerHTML='任务编号：'+workNum;
		onLoadData(window.parent.returnWholeData());	
		getWorkList();
		setWordType(window.parent.returnWorkName(),window.parent.returnRunTime());	
	});
 	function getWorkList()
 	{
 		var isDisplay=window.parent.returnIsDisplayWork();
 		if(isDisplay==1)
 		{
 			displayGetWork();
 		}
 		isWork=1;
 	}
 	function getWorkListdefault()
 	{
 		window.parent.getWorkList();
 	}		
 	function submitData()
 	{
 		//即：切片号&字段编号&序号&录入值|切片号&字段编号&序号&录入值
 		var strdata='';
 		for(var i=0;i<datas.length;i++)
 		{
 			var str=datas[i][0]+'&'+datas[i][7]+'&'+datas[i][1]+'&'+document.getElementById(datas[i][0]+'').value+'&'+datas[i][10];
 			strdata+=str+'|';
 		}
 		window.parent.submitData(strdata);
 		window.parent.setIsDisplayWork(0);
 		document.getElementById("getWork").style.display='';
 	}
 	function setWordType(showType,runTime)
 	{
 		document.getElementById("showWorkType").innerHTML=showType;
 		document.getElementById("runTime").innerHTML=runTime;
 	}
	function showOnFocus(obj,id,val)
	{
		obj.style.borderColor='#009a64';
		//obj.style.backgroundColor='#BCCCDF';
		obj.select();
		var bro=document.getElementById(id);
		bro.border=1;
		$(bro).css("border-color","#0033FF");
		showDiv(obj,val);
	}
	function showOnBlur(obj,id)
	{
		obj.style.borderColor='#26802f';
		obj.style.backgroundColor='#ffffff';
		var bro=document.getElementById(id);
		bro.border=0;
		closeDiv();
	}
	function onLoadData(data)
	{
		datas=data;
		var img_root=document.getElementById("img_root").value;
		var jishu=0;
		var chkType=false;
		var maxWidth=0;
		for(var i=0;i<data.length;i++)
		{
			if(data[i][6]>455)
			{
				chkType=true;
			}
			if(data[i][6]>maxWidth)
			{
				maxWidth=data[i][6];
			}
			jishu+=data[i][6];
		}
		if(jishu>800 && chkType)
		{
			var bigDiv=document.getElementById('bigImage');
			var str='<table border="0" cellspacing="22" cellpadding="0" align="left">';
			for(var i=0;i<data.length;i++ )
			{   
				if(data[i][8]==null)
				{
					data[i][8]='';
				}
				if(data[i][9]==null)
				{
					data[i][9]='';
				}
				if(data[i][6]>455)
				{ 
					str+='<tr> <td align="right" width="455px">';
					if(i==0)
					{
						str+='<img id="'+data[i][0]+'_1" onLoad="showImgOnLoad();" src="'+img_root+data[i][2]+'"';
					}
					else
					{
						str+='<img id="'+data[i][0]+'_1" src="'+img_root+data[i][2]+'"';
					}
					if(isQC)
					{
						str+=' class="hbtn"';
					}
					str+=' width="450px" />';
					str+='</td><td align="left">';
					str+='<input name="'+data[i][0]+'" id="'+data[i][0]+'" ';
					str+='value="'+data[i][9]+'"';
					if(isQC)
					{
						str+=' class="btns"';
						data[i][8]=data[i][8].replace(';','<br />');
					}
					else
					{
						str+=' class="btn"';
					}
					str+=' onFocus="showOnFocus(this,\''+data[i][0]+'_1\',\''+data[i][8]+'\');"';
					str+=' onBlur="showOnBlur(this,\''+data[i][0]+'_1\')" />';
					str+='</td> </tr>';
				}
				else
				{
					str+='<tr> <td align="right" width="450px">';
					if(i==0)
					{
						str+='<img id="'+data[i][0]+'_1" onLoad="showImgOnLoad();" src="'+img_root+data[i][2]+'"';
					}
					else
					{
						str+='<img id="'+data[i][0]+'_1" src="'+img_root+data[i][2]+'"';
					}
					if(isQC)
					{
						str+=' class="hbtn"';
					}
					str+=' />';
					str+='</td><td align="left">';
					str+='<input class="nt_common_inputstyle" name="'+data[i][0]+'" id="'+data[i][0]+'" ';
					str+='value="'+data[i][9]+'"';
					if(isQC)
					{
						str+=' class="btns"';
						data[i][8]=data[i][8].replace(';','<br />');
					}
					else
					{
						str+=' class="btn"';
					}
					str+=' onFocus="showOnFocus(this,\''+data[i][0]+'_1\',\''+data[i][8]+'\');"';
					str+=' onBlur="showOnBlur(this,\''+data[i][0]+'_1\')" />';
					str+='</td> </tr>';
				}
			}
			str+='</table>';
			bigDiv.innerHTML=str;
		}
		else if(jishu>800 && !chkType)
		{
			var bigDiv=document.getElementById('bigImage');
			var str='<table border="0" cellspacing="22" cellpadding="0"  align="left">';
			for(var i=0;i<data.length;i++ )
			{  
				if(data[i][8]==null)
				{
					data[i][8]='';
				}
				if(data[i][9]==null)
				{
					data[i][9]='';
				}	
				str+='<tr> <td align="right" width="'+(maxWidth+5)+'px">';
				if(i==0)
				{
					str+='<img id="'+data[i][0]+'_1" onLoad="showImgOnLoad();" src="'+img_root+data[i][2]+'"';
				}
				else
				{
					str+='<img id="'+data[i][0]+'_1" src="'+img_root+data[i][2]+'"';
				}
				if(isQC)
				{
					str+=' class="hbtn"';
				}
				str+=' />';
				str+='</td><td align="left">';
				str+='<input name="'+data[i][0]+'" id="'+data[i][0]+'" ';
				str+='value="'+data[i][9]+'"';
				if(isQC)
				{
					str+=' class="btns"';
					data[i][8]=data[i][8].replace(';','<br />');
				}
				else
				{
					str+=' class="btn"';
				}
				str+=' onFocus="showOnFocus(this,\''+data[i][0]+'_1\',\''+data[i][8]+'\');"';
				str+=' onBlur="showOnBlur(this,\''+data[i][0]+'_1\')" />';
				str+='</td> </tr>';
			}
			str+='</table>';
			bigDiv.innerHTML=str;
		}
		else
		{
			var bigDiv=document.getElementById('bigImage');
			var str='<table border="0" cellspacing="22" cellpadding="0"  align="left">';
			var str_tr1='<tr>';
			var str_str2='<tr>';
			for(var i=0;i<data.length;i++ )
			{   
				if(data[i][8]==null)
				{
					data[i][8]='';
				}
				if(data[i][9]==null)
				{
					data[i][9]='';
				}		
				str_tr1+='<td align="left" width="'+(data[i][6]+5)+'px">';
				if(i==0)
				{
					str_tr1+='<img id="'+data[i][0]+'_1" onLoad="showImgOnLoad();" src="'+img_root+data[i][2]+'" />';
				}
				else
				{
					str_tr1+='<img id="'+data[i][0]+'_1" src="'+img_root+data[i][2]+'" />';
				}
				str_tr1+='</td>';
				str_str2+='<td align="left"  width="'+(data[i][6]+5)+'px">';
				str_str2+='<input name="'+data[i][0]+'" id="'+data[i][0]+'" ';
				str_str2+='value="'+data[i][9]+'"';
				if(isQC)
				{
					str_str2+=' class="hbtn"';
					data[i][8]=data[i][8].replace(';','<br />');
				}
				str_str2+=' style="width:'+data[i][6]+'px;background-color: #ffffff;border-color:black;height:35px;font-size: 22;"';
				str_str2+=' onFocus="showOnFocus(this,\''+data[i][0]+'_1\',\''+data[i][8]+'\');"';
				str_str2+=' onBlur="showOnBlur(this,\''+data[i][0]+'_1\')" />';
				str_str2+='</td>';
			}
			str_tr1+='</tr>';
			str_str2+='</tr>'
			str+=str_tr1;
			str+=str_str2;
			str+='</table>';
			bigDiv.innerHTML=str;
		}
		sortTableIndex();
	}
	
	function showImgOnLoad()
	{
		sortTableIndex();
	}
	function sortTableIndex()
	{
		var items =document.getElementsByTagName("input");
		var j=0;
   		for(var i=0;i<items.length;i++){
			if(items[i].type=="text")
            {
				if(j==0)
				{
					items[i].focus();
				}
				items[i].tabIndex=j;
				j++;
			} 
        }
	}

document.onkeydown = function(event){ 
　　var ev = document.all ? window.event : event;
	key=ev.keyCode;
	var isIE = !-[1,]; 
	if (key==38){
		var CurTabIndex;
		if(isIE)
		   CurTabIndex=ev.srcElement.tabIndex-1;
		else
			CurTabIndex=event.target.tabIndex-1;
		var items =document.getElementsByTagName("input");
   		for(var i=0;i<items.length;i++){
			if(items[i].type=="text")
            {
				if (items[i].tabIndex==CurTabIndex){
					items[i].focus();
					return true;
				}
			} 
        }
	}
	if (key==40){
		var CurTabIndex;
		if(isIE)
		   CurTabIndex=ev.srcElement.tabIndex+1;
		else
			CurTabIndex=event.target.tabIndex+1;
		var items =document.getElementsByTagName("input");
   		for(var i=0;i<items.length;i++){
			if(items[i].type=="text")
            {
				if (items[i].tabIndex==CurTabIndex){
					items[i].focus();
					return true;
				}
			} 
        }
	}
	if(key==13)
	{
		if(window.parent.returnIsDisplayWork()==0)
		{
			getWorkListdefault();
		}
		else
		{
			var CurTabIndex;
			if(isIE)
			   CurTabIndex=ev.srcElement.tabIndex+1;
			else
				CurTabIndex=event.target.tabIndex+1;
			var items =document.getElementsByTagName("input");
			var txtBoxCount=0;
			for(var i=0;i<items.length;i++){
				if(items[i].type=="text")
				{
					txtBoxCount++;
				} 
			}
			if(CurTabIndex==txtBoxCount)
			{
				if(confirm("您确认提交吗？"))
				{
					submitData();
				}
				
			}
			else
			{
				for(var i=0;i<items.length;i++){
					if(items[i].type=="text")
					{
						if (items[i].tabIndex==CurTabIndex){
							items[i].focus();
							return true;
						}
					} 
				}
			}
		}
	}
	
}

	function showDiv(obj,val)
	{
		var tDiv = document.getElementById("show_wd");
		tDiv.style.display="block";
		tDiv.innerHTML=val;
		//tDiv.style.width =obj.offsetWidth + "px";
		var left = calculateOffset(obj,"offsetLeft");
		var top = calculateOffset(obj, "offsetTop") - obj.offsetHeight+18;
		if(isQC)
		{
			top-=18;
		}
		tDiv.style.left = left + "px";
		tDiv.style.top = top + "px";
	}
	function calculateOffset(field, attr)
    {
          var offset = 0;
          while(field) {
            offset += field[attr]; 

            field = field.offsetParent;
          }
         return offset;
    }
function closeDiv()
{
	document.getElementById("show_wd").style.display="none";
}
function displayGetWork()
{
	document.getElementById("getWork").style.display="none";
}
</script>

</head>

<body style="margin:0;padding:0;">
<input type="hidden" id="img_root" value="${IMG_ROOT_DIR }">
<table width="1002" height="100%" border="0" align="left" cellpadding="0" cellspacing="0">
  <tr>
    <td width="192" valign="top" class="nt_lefttop_tdbg" bgcolor="#b1dbb6"><table width="182" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td height="116" valign="top" background="images/top.gif"><table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td height="30" align="center">&nbsp;</td>
          </tr>
          <tr>
            <td height="30" align="center"><a href="content.jsp" class="ml15" target="_top">首页</a><a href="index.htm" class="ml35" target="_top">退出</a></td>
          </tr>
          <tr>
            <td height="30" align="center">欢迎您，${user.realName }！</td>
          </tr>
        </table></td>
      </tr>
      <tr>
        <td background="images/tbg.gif">&nbsp;</td>
      </tr>
      <tr>
        <td background="images/tbg.gif"><table width="182" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td height="26"><div class="nt_datain_header">数据录入</div></td>
            </tr>
            <tr>
              <td height="26"><table width="165" class="nt_data_border" border="0" align="center" cellpadding="0" cellspacing="0">
                  <tr>
                    <td height="28" align="center" bgcolor="#efefef" id="showWorkType">Web录入</td>
                  </tr>
                  <tr>
                    <td height="28" align="center" bgcolor="#efefef" id="runTime">2009-05-15 15:36 </td>
                  </tr>
                  <tr>
                    <td height="28" align="center" bgcolor="#efefef" id="workNum"></td>
                  </tr>
                  <tr>
                    <td height="40" align="center" bgcolor="#efefef"><table width="150" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td><input type="button" name="getWork" id="getWork" class="nt_gettask_btn" value="获取任务" onClick="getWorkListdefault();"></td>
                          <td><input type="button" name="finishWork" id="finishWork" class="nt_gettask_btn" value="完成任务" onClick="submitData();"></td>
                        </tr>
                    </table></td>
                  </tr>
              </table></td>
            </tr>
            <tr>
              <td background="images/tbg.gif">&nbsp;</td>
            </tr>
        </table></td>
      </tr>
      <tr>
        <td background="images/tbg.gif"><table width="164" border="0" align="center" cellpadding="0" cellspacing="0">
          <tr>
            <td height="28" align="center"><table class="nt_info_tabbg" width="100%" border="0" align="right" cellpadding="0" 
                  cellspacing="0"  id="point7" style="DISPLAY: movie">
                <tbody>
                  <tr>
                    <td height="25" align="left">录入速度：<span id="lurusudu"></span> </td>
                  </tr>

                </tbody>
            </table></td>
          </tr>
        </table></td>
      </tr>
      <tr>
        <td background="images/tbg.gif">&nbsp;</td>
      </tr>
    </table></td>
    <td width="810" valign="top"><table width="810" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td height="56" valign="bottom" background="images/into_top.gif"><table width="400" border="0" align="right" cellpadding="0" cellspacing="0">
         <tr>
            <td height="45"><a href="content.jsp" class="card_1" target="_top">数据录入</a> | <a href="queryRfWorkSum" class="card_1" target="_top">状态跟踪 </a>|<a href="update_password.jsp" class="card_1" target="_top"> 修改密码</a></td>
          </tr>
        </table></td>
      </tr>
      <tr>
        <td><table width="810" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td width="800" height="20">
			<div align="left" id="bigImage" style="margin:5px 0 0 15px;" ></div>
           </td>
          </tr>
        </table></td>
      </tr>
    </table></td>
  </tr>
</table>

<div id="show_wd" style="position: absolute; text-align:left; font-size: 12px; display:none;height: 18px;background-color: white;"></div>
</body>
</html>
