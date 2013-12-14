<?php
    /**
     * @author: Jikey
     * @see: <a href="mailto:jikeytang@gmail.com">Jikey</a>
     * @time: 2013-12-7 上午12:02
     * @info:
     */
    object(AdvsModel) (21) {
    ["_link":protected]=> array(0) {
    } ["_auto":protected]=> array(4) {
        [0]=> array(2) {
            [0]=> string(6) "status" [1]=> int(1) } [1]=> array(4) {
            [0]=> string(9) "inputtime" [1]=> string(4) "time" [2]=> int(1) [3]=> string(8) "function" } [2]=> array(4) {
            [0]=> string(10) "updatetime" [1]=> string(4) "time" [2]=> int(2) [3]=> string(8) "function" } [3]=> array(4) {
            [0]=> string(5) "ctime" [1]=> string(5) "ctime" [2]=> int(1) [3]=> string(8) "callback" } } ["_extModel":"Model":private]=> NULL ["db":protected]=> object(DbMysql) (19) {
        ["dbType":protected]=> string(5) "MYSQL" ["autoFree":protected]=> bool(false) ["model":protected]=> string(7) "_think_" ["pconnect":protected]=> bool(false) ["queryStr":protected]=> string(0) "" ["modelSql":protected]=> array(0) {
        } ["lastInsID":protected]=> NULL ["numRows":protected]=> int(0) ["numCols":protected]=> int(0) ["transTimes":protected]=> int(0) ["error":protected]=> string(0) "" ["linkID":protected]=> array(0) {
        } ["_linkID":protected]=> NULL ["queryID":protected]=> NULL ["connected":protected]=> bool(false) ["config":protected]=> array(8) {
            ["dbms"]=> string(5) "mysql" ["username"]=> string(14) "jinguico_think" ["password"]=> string(12) "jing8402++__" ["hostname"]=> string(9) "127.0.0.1" ["hostport"]=> string(0) "" ["database"]=> string(14) "jinguico_think" ["dsn"]=> NULL ["params"]=> string(0) "" } ["comparison":protected]=> array(10) {
            ["eq"]=> string(1) "=" ["neq"]=> string(2) "<>" ["gt"]=> string(1) ">" ["egt"]=> string(2) ">=" ["lt"]=> string(1) "<" ["elt"]=> string(2) "<=" ["notlike"]=> string(8) "NOT LIKE" ["like"]=> string(4) "LIKE" ["in"]=> string(2) "IN" ["notin"]=> string(6) "NOT IN" } ["selectSql":protected]=> string(96) "SELECT%DISTINCT% %FIELD% FROM %TABLE%%JOIN%%WHERE%%GROUP%%HAVING%%ORDER%%LIMIT% %UNION%%COMMENT%" ["bind":protected]=> array(0) {
        } } ["pk":protected]=> string(2) "id" ["tablePrefix":protected]=> string(3) "tk_" ["name":protected]=> string(4) "Advs" ["dbName":protected]=> string(0) "" ["connection":protected]=> string(0) "" ["tableName":protected]=> string(0) "" ["trueTableName":protected]=> string(7) "tk_advs" ["error":protected]=> string(18) "操作出现错误" ["fields":protected]=> array(9) {
        [0]=> string(2) "id" [1]=> string(7) "modelId" [2]=> string(8) "smallimg" [3]=> string(5) "title" [4]=> string(4) "link" [5]=> string(3) "ord" ["_autoinc"]=> bool(true) ["_pk"]=> string(3) "ord" ["_type"]=> array(6) {
            ["id"]=> string(15) "int(8) unsigned" ["modelId"]=> string(7) "int(10)" ["smallimg"]=> string(12) "varchar(100)" ["title"]=> string(12) "varchar(100)" ["link"]=> string(12) "varchar(100)" ["ord"]=> string(6) "int(8)" } } ["data":protected]=> array(7) {
        ["title"]=> string(15) "望到心里去" ["link"]=> string(8) "/blog/25" ["smallimg"]=> string(13) "banner-01.jpg" ["id"]=> string(1) "1" ["status"]=> int(1) ["inputtime"]=> int(1386345739) ["ctime"]=> string(10) "2013-12-07" } ["options":protected]=> array(0) {
    } ["_validate":protected]=> array(0) {
    } ["_map":protected]=> array(0) {
    } ["_scope":protected]=> array(0) {
    } ["autoCheckFields":protected]=> bool(true) ["patchValidate":protected]=> bool(false) ["methods":protected]=> array(13) {
        [0]=> string(5) "table" [1]=> string(5) "order" [2]=> string(5) "alias" [3]=> string(6) "having" [4]=> string(5) "group" [5]=> string(4) "lock" [6]=> string(8) "distinct" [7]=> string(4) "auto" [8]=> string(6) "filter" [9]=> string(8) "validate" [10]=> string(6) "result" [11]=> string(4) "bind" [12]=> string(5) "token" } }
