<!doctype html>
<html class="off">
<head>
    <meta charset="utf-8"/>
    <link rel="stylesheet" type="text/css" href="css/admin.css"/>
    <title>管理中心</title>
</head>
<body scroll="no">
<div id="header">
    <div class="logo"><a href="index.php" title="管理中心"></a></div>
    <div class="fr">
        <div class="cut_line admin_info tr">
            <a href="default.htm" target="_blank">网站首页</a>
            <span class="cut">|</span>1：<span class="mr10">admin</span>
            <a href="#">[注销]</a>
        </div>
    </div>
    <ul class="nav white" id="J_tmenu">
        <li class="top_menu"><a href="javascript:;" data-id="1">商品</a></li>
        <li class="top_menu"><a href="javascript:;" data-id="2">用户</a></li>
    </ul>
</div>
<div id="content">
    <div class="left_menu fl">
        <div id="J_lmenu" class="J_lmenu" data-uri="menu.php">
            <h3 class="f14"><span class="J_switchs cu on" title="展开或关闭"></span>商品管理</h3>
            <ul>
                <li class="sub_menu">
                    <a href="javascript:;" data-uri="=52"  data-id="52">商品管理</a>
                </li>
                <li class="sub_menu">
                    <a href="javascript:;" data-uri="&a=add&menuid=249"  data-id="249">添加商品</a>
                </li>
                <li class="sub_menu">
                    <a href="javascript:;"  data-uri="" data-id="250" >一键删除</a>
                </li>
                <li class="sub_menu">
                    <a href="javascript:;" data-uri="" data-id="203">商品审核</a>
                </li>
                <li class="sub_menu">
                    <a href="javascript:;" data-uri="" data-id="56">商品分类</a>
                </li>
                <li class="sub_menu">
                    <a href="javascript:;" data-uri="" data-id="199">商品来源</a>
                </li>
                <li class="sub_menu">
                    <a href="javascript:;"  data-uri="" data-id="186"  >商品评论</a>
                </li>
                <li class="sub_menu">
                    <a href="javascript:;" data-uri="" data-id="288">图片本地化</a>
                </li>
            </ul>
            <h3 class="f14"><span class="J_switchs cu on" title="展开或关闭"></span>商品采集</h3>
            <ul>
                <li class="sub_menu"><a href="javascript:;"  data-uri="" data-id="192" >阿里妈妈</a></li>
                <li class="sub_menu"><a href="javascript:;"  data-uri="" data-id="290" >淘宝网址</a></li>
                <li class="sub_menu"><a href="javascript:;"  data-uri="" data-id="268" >拍拍网址</a></li>
                <li class="sub_menu"><a href="javascript:;"  data-uri="" data-id="287" >天猫折扣精选</a></li>
                <li class="sub_menu"><a href="javascript:;"  data-uri="" data-id="289" >精品推荐</a></li>
                <li class="sub_menu"><a href="javascript:;"  data-uri="" data-id="281" >淘宝评论</a></li>
            </ul>
        </div>
        <h1 class="none">这里通过data-uri地址，获取ajax获取左侧菜单。在/js/admin.js 21、104行</h1>
        <a href="javascript:;" id="J_lmoc" style="outline-style: none; outline-color: invert; outline-width: medium;" class="open" title="展开或关闭"></a>
    </div>
    <div class="right_main">
        <div class="crumbs">
            <div class="options">
                <a href="javascript:;" title="刷新页面" id="J_refresh" class="refresh">刷新页面</a>
                <a href="javascript:;" title="全屏" id="J_full_screen" class="admin_full">全屏</a>
                <a href="javascript:;" title="更新缓存" id="J_flush_cache" class="flush_cache" data-uri="">更新缓存</a>
                <a href="javascript:;" title="后台地图" id="J_admin_map" class="admin_map" data-uri="test.html">后台地图</a>
            </div>
            <div id="J_mtab" class="mtab">
                <a href="javascript:;" id="J_prev" class="mtab_pre fl" title="上一页">上一页</a>
                <a href="javascript:;" id="J_next" class="mtab_next fr" title="下一页">下一页</a>

                <div class="mtab_p">
                    <div class="mtab_b">
                        <ul id="J_mtab_h" class="mtab_h">
                            <li class="current" data-id="0"><span><a>后台首页</a></span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div id="J_rframe" class="rframe_b">
            <iframe id="rframe_0" src="test.html" frameborder="0" scrolling="auto" style="height:100%;width:100%;"></iframe>
        </div>
    </div>
</div>
<script type="text/javascript">
    //语言项目
    /*
    var lang = new Object();
    lang.connecting_please_wait = "请稍后...";
    lang.confirm_title = "提示消息";
    lang.move = "移动";
    lang.dialog_title = "消息";
    lang.dialog_ok = "确定";
    lang.dialog_cancel = "取消";
    lang.please_input = "请输入";
    lang.please_select = "请选择";
    lang.not_select = "不选择";
    lang.all = "所有";
    lang.input_right = "输入正确";
    lang.plsease_select_rows = "请选择要操作的项目！";
    lang.upload = "上传";
    lang.uploading = "上传中";
    lang.upload_type_error = "不允许上传的文件类型！";
    lang.upload_size_error = "文件大小不能超过{sizeLimit}！";
    lang.upload_minsize_error = "文件大小不能小于{minSizeLimit}！";
    lang.upload_empty_error = "文件为空，请重新选择！";
    lang.upload_nofile_error = "没有选择要上传的文件！";
    lang.upload_onLeave = "正在上传文件，离开此页将取消上传！";
    */
</script>
<script src="js/libs/jquery-1.8.3.min.js"></script>
<script src="js/artDialog-5.0.3/jquery.artDialog.min.js"></script>
<script src="js/admin.js"></script>
</body>
</html>