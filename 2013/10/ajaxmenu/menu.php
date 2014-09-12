<?php
    include_once 'innc/conn.php';

    if(!empty($_POST['menuid'])){
        $menuId = $_POST['menuid'];
    } else {
        $menuId = 1;
    }

    $str = '';
    $sql1 = 'select * from jk_menu';
    $sql2 = 'select * from jk_menu_sort where menu_id=' . $menuId;
    $goods = mysql_query($sql1);
    $sorts = mysql_query($sql2);

    while($res1 = mysql_fetch_array($goods)){
        $menus[] = $res1;
    }

    while($res2 = mysql_fetch_array($sorts)){
        $parent_id = $res2['parent_id'];
        $str .= '<h3 class="f14"><span class="J_switchs cu on" title="展开或关闭"></span>' . $res2['sort_name'] . '</h3>';

        $str .= '<ul>';
        foreach($menus as $k => $v){
            if($v['parent_id'] == $parent_id){
                $str .= '<li class="sub_menu"><a href="javascript:;" data-uri="52" data-id="52">' . $v['menu_name'] . '</a></li>';
            }
        }
        $str .= '</ul>';
    }

    echo $str;






    