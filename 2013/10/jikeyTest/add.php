<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>test</title>
</head>
<body>
<?php
    include_once 'innc/conn.php';
    if(!empty($_POST['sub'])){
        $username = $_POST['username'];
        $pwd = $_POST['pwd'];
        echo $sql = "insert into jk_user(username, pwd) value($username, $pwd)";
        mysql_query($sql);
        header('Location:index.php');
        echo '插入成功';
    }
?>
<form action="add.php" method="post">
    <table width="500" border="1">
        <tr>
            <th>用户名：</th>
            <td><input type="text" name="username" id=""/></td>
        </tr>
        <tr>
            <th>密码：</th>
            <td><input type="text" name="pwd" id=""/></td>
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