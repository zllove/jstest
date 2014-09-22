<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>test-curd</title>
</head>
<body>
<?php
    include_once 'innc/conn.php';

    $sql = 'select * from jk_user';
    $query = mysql_query($sql);

    if(!empty($_GET['keys'])){
        $w = "username like '%" . $_GET['keys'] ."%'";
    } else {
        $w = 1;
    }
    $sql2 = "select * from jk_user where $w order by id desc";
    $query2 = mysql_query($sql2);
    if(!empty($query2)){
        $query = $query2;
    }
?>
<a href="add.php">新增</a>
<form action="">
    <input type="text" name="keys" id=""/><input type="submit" value="查询"/>
</form>
<table width="500" border="1">
    <tr>
        <td>id</td>
        <td>username</td>
        <td>pwd</td>
        <td>操作</td>
    </tr>
    <?php
        while($rs = mysql_fetch_array($query)){
    ?>
    <tr>
        <td><?php echo $rs['id'] ?></td>
        <td><?php echo $rs['username'] ?></td>
        <td><?php echo $rs['pwd'] ?></td>
        <td>
            <a href="update.php?id=<?php echo $rs['id'] ?>">修改</a>
            <a href="del.php?id=<?php echo $rs['id'] ?>">删除</a>
        </td>
    </tr>
<?php } ?>
</table>
</body>
</html>