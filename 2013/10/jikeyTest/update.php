<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>test</title>
</head>
<body>
<?php
    include_once 'innc/conn.php';
    if(!empty($_GET['id'])){
        $id = $_GET['id'];
        echo $sql = "select * from jk_user where id=$id";
        $query = mysql_query($sql);
        $rs = mysql_fetch_array($query);
    }

    if(!empty($_POST['sub'])){
        $id = $_POST['hid'];
        $username = $_POST['username'];
        $pwd = $_POST['pwd'];
        echo $sql = "update jk_user set username=$username, pwd=$pwd where id=$id limit 1";
        $list = mysql_query($sql);
        echo "<script> alert('更新成功'); location.href='index.php'</script>";
        echo "更新成功";
    }
?>
<form action="update.php" method="post">
    <input type="hidden" name="hid" value="<?php echo $rs['id']; ?>"/>
    <table width="500" border="1">
        <tr>
            <th>用户名：</th>
            <td><input type="text" name="username" id="" value="<?php echo $rs['username']; ?>"/></td>
        </tr>
        <tr>
            <th>密码：</th>
            <td><input type="text" name="pwd" id="" value="<?php echo $rs['pwd']; ?>"/></td>
        </tr>
        <tr>
            <th></th>
            <td>
                <input type="submit" name="sub" value="提交"/>
            </td>
        </tr>
    </table>
</form>
</body>
</html>