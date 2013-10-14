<?php
    include_once 'innc/conn.php';
    if(!empty($_GET['id'])){
        $id = $_GET['id'];
        echo $sql = "delete from jk_user where id=$id";
        mysql_query($sql);
        echo '删除成功!';
        header('Location:index.php');
    }
?>