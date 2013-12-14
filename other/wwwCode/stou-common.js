//http://www.stou.info/guestbook/page/21
/**
 * 设定Cookie
 *
 */
function setCookie(sName, sValue,iExpireDays) {
	if ( iExpireDays ){
		var dExpire = new Date();
		dExpire.setTime(dExpire.getTime()+parseInt(iExpireDays*24*60*60*1000));
		document.cookie = sName + "=" + escape(sValue) + "; expires=" + dExpire.toGMTString();
	}else{
		document.cookie = sName + "=" + escape(sValue);
	}
}
/**
 * 读取Cookie
 *
 */
function getCookie(sName)
{
	var cookie = document.cookie.match(new RegExp("(^| )"+sName+"=([^;]*)(;|$)"));
	if( cookie !=null ) return unescape(cookie[2]);
	return '';
}
/**
 * 评论回复
 * 定位评论框
 *
 *
 */
function replyComment(commtParentId, isChildren)
{
	$('#closeReply').css('display','inline-block');
	$(".commts").css('marginBottom','0px');
	$('#parentId').val(commtParentId);

	$('#respond').hide();
	$('#respond').css('position','absolute');

	var e = $('#cmt'+commtParentId).position().top+$('#cmt'+commtParentId).height()+28;
	var f = $('#respond').height()+28;

	$('#cmt'+commtParentId).css('marginBottom',f+'px');
	$('#respond').css('top',e+'px');
	$('#respond').animate({height:'toggle',opacity: 'toggle'});
	bodyScrollTo($('#respond').position().top-250);
}

/**
 * 恢复评论框原始位置
 * 
 *
 */
function resumeCommtPosition()
{
	$('#closeReply').hide();
	$('#parentId').val(0);
	$('#respond').animate({height:'toggle',opacity: 'toggle'}, 300, function(){
		$('#respond').css('position','static');
		$('#respond').css('top','0px');
		$(".commts").css('marginBottom','0px');
		$(".commtreply").css('marginBottom','0px');
		$('#respond').show();		
	});	
}

/**
 * Ajax提交评论
 *
 *
 */
function commtAjaxSubmit(id, isAdmin)
{
	if ( typeof(id) != "undefined" ) {
		eval("var form=document.commtForm"+id+';');
	}else{
		var form=document.commtForm;
	}
	var gA = form.artId.value;
	var gP = form.parentId.value;
	var gN = form.guestName.value;
	var gE = form.guestEmail.value;
	var gU = form.guestUrl.value;
	var gC = form.guestCommt.value;
	var gR = form.guestRemember.checked;
	var gV = '';

	try{
		gV = form.guestVerify.value;
	}catch(e){}

	reg = new RegExp("^[.A-Za-z0-9\u4e00-\u9fa5]+$");
	if (!reg.test(gN)){
		alert("请输入您的名称！");
		form.guestName.focus();
		return false;
	}

	if(gE==""){
		//return false;
	}
	else{
		reg = new RegExp("^[\\w-]+(\\.[\\w-]+)*@[\\w-]+(\\.[\\w-]+)+$");
		if (!reg.test(gE)){
			alert("请输入一个有效的邮箱地址");return false;
		}
	}

	try{
		if ( form.guestVerify )
		{
			if ( gV=='' )
			{
				alert("请输入验证码!");
				form.guestVerify.focus();
				return false;
			}
		}
	}catch(e){}

	if(typeof(gC)=="string"){
		if(gC==""){
			alert("评论内容不能为空！");
			form.guestCommt.focus();
			return false;
		}
		if(gC.length>1000)
		{
			alert("评论内容请限定在1000字以内，如果内容过长请分割成多条。");
			return false;
		}
	}

	$('#commtForm :submit').attr("disabled","disabled").addClass("btnloading");
	$("#guestCommt").css("background","url(/core/theme/stou/style/images/plsaving.gif) center no-repeat");

	if ( gR ) saveCommtUserInfo(gN,gE,gU);
	
	$.post(
		blogurl+'core/e/cmd.php?action=saveCommt&'+Math.random(),
		{
			"artId":gA,
			"parentId":gP,
			"guestName":gN,
			"guestEmail":gE,
			"guestUrl":gU,
			"guestCommt":gC,
			"guestVerify":gV
		},
		function (data) {
			var s = data;
			if (s.indexOf('error')!=-1)
			{
				alert(s.match("<string>.+?</string>")[0].replace("<string>","").replace("</string>",""));
				$('#verifyImg').click();
			}else{
				if ( typeof(isAdmin) !="undefined" ) { alert("回复成功！");window.location.reload(); return false;}
				alert("评论成功！审核通过后即可在本页显示！");
				resumeCommtPosition();
				form.guestCommt.value='';
				form.parentId.value='0';
				$('#verifyImg').click();
			}
			$('#commtForm :submit').attr("disabled","").removeClass("btnloading");
			$("#guestCommt").css("background","url(/core/theme/stou/style/images/plbg.gif) center no-repeat");
		})
	
	return false;
}

/**
 * 保存用户信息
 *
 *
 */
function saveCommtUserInfo(gN,gE,gU)
{
	setCookie('guestName',gN, 365);
	setCookie('guestEmail',gE, 365);
	setCookie('guestUrl',gU, 365);
}

/**
 * 恢复用户信息
 *
 *
 */
function loadCommtUserInfo()
{
	var gN = getCookie('guestName');
	var gE = getCookie('guestEmail');
	var gU = getCookie('guestUrl');
	$("input[name='guestName']").val(gN);
	$("input[name='guestEmail']").val(gE);
	$("input[name='guestUrl']").val(gU);
	$("input[name='guestEmail']").blur();
}

/**
 * 加载Gravatar头像
 *
 *
 */
function loadGravatar(obj)
{
	var src = obj.value;
	if ( src.indexOf('@')<0 ) return false;
	loadScript(blogurl+'s/script/md5.js',function(){
		$('#gravatarView').attr('src', 'http://www.gravatar.com/avatar/'+MD5(src)+'?d='+blogurl+'cache/gravatar/default.jpg&s=36&r=g');
	})
}

/**
 * 智能加载javascript
 *
 *
 */
function loadScript(url,func)
{
	if ( typeof(loadedJS)=="undefined" ) loadedJS = [];
	for(var i=0;i<loadedJS.length;i++) {
		if ( loadedJS[i] == url ) {
			eval(func);
			return false;
		}
	}
	loadedJS.push(url);
	$.getScript(url,eval(func));
}

/**
 * 插入表情
 *
 *
 */
function insertUbb(ubb,value,id)
{
	if ( typeof(id) !="undefined" ) {
		eval("var obj = $('#guestCommt"+id+"');")
	}else{
		var obj = $('#guestCommt');
	}
	ubb = ubb.toUpperCase();
	$(obj).val(function(index,resource){
		return resource+ '['+ubb+']'+value+'[/'+ubb+']';
	})
}

/**
 * 加载UBB表情
 *
 *
 */
function loadUbbFace(id)
{
	var output = [];
	for(var i=0;i<blogface.length;i++) {
		if ( typeof(id) !="undefined" ) {
			output.push(" <img onclick=\"insertUbb('F','"+blogface[i]+"',"+id+")\" src='"+blogurl+"s/face/"+blogface[i]+".gif' style='cursor:pointer;' width='"+blogfacesize+"' height='"+blogfacesize+"' />");
		}else{
			output.push(" <img onclick=\"insertUbb('F','"+blogface[i]+"')\" src='"+blogurl+"s/face/"+blogface[i]+".gif' style='cursor:pointer;' width='"+blogfacesize+"' height='"+blogfacesize+"' />");
		}
	}
	document.write(output.join(''));
}

/**
 * 文章图片自动缩小
 *
 *
 */
function ResizeImage(objImage,maxWidth)
{
	try{
		if( maxWidth>0 ) {
			var objImg = $(objImage);
			if( objImg.width() >maxWidth ) {
				objImg.width(maxWidth).css("cursor","pointer").click(function(){
					try{window.open(objImage.src);}catch(e){window.open(objImage.src);}
				});
			}
		}
	}catch(e){};
}
/**
 * 页面滑动到指定position
 *
 */
function bodyScrollTo(position)
{
	var body = (window.opera) ? (document.compatMode == 'CSS1Compat' ? $('html') : $('body')): $('html,body');
	body.animate({scrollTop:position},1000)
}
