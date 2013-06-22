jQuery(
	function(){
		toolsListPosition();//设定工具栏展开区域的位置
		toolsHover();//前端工具
	}
);

//设定工具栏展开区域的位置
function toolsListPosition(){
	var obj = jQuery("#toolsList dl");
	num = 0;
	for(var i=0; i<obj.length; i++){
		/*if(i<7)
		{*/
			num = i*33;
			obj.eq(i).css("top",num+"px");
		/*}
		else
		{*/
			//obj.eq(i).css("top",num+"px");
		/*}*/
	}
}

//前端工具
function toolsHover(){
	var obj = jQuery("#toolsBar dd");
	var _obj = jQuery("#toolsList dl");
	obj.hover(
		function(){
			jQuery(this).addClass("active");
			jQuery("#toolsList dl").eq(obj.index(this)).show();
		},
		function(){
			jQuery(this).removeClass("active");
			jQuery("#toolsList dl").eq(obj.index(this)).hide();
		}
	);
	
	_obj.hover(
		function(){
			jQuery(this).show();
			obj.eq(_obj.index(this)).addClass("active");
		},
		function(){
			jQuery(this).hide();
			obj.eq(_obj.index(this)).removeClass("active");
		}
	);
}
