$(function(){
    //下面是日期获取js-->
    $("#date1,#date2").datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'yy-mm-dd'
    });
    //下面是复选框js-->
    $("#demo1,#demo2").jstree({
        "plugins": ["themes", "html_data", "checkbox"]
    });
});
//获取jstree选取的id
function getMenuIds(){
    var idArray = new Array();
    $("#demo1").find(".jstree-checked, .jstree-undetermined ").each(function(){
        var isChild = true;
        if ($(this).find('li').length != 0) {
            idArray.push($(this).attr("value"));
            isChild = false;
        }
        if (isChild) {
            idArray.push($(this).attr("value"));//可取得数字格式value
        }
    });
    alert(idArray);
    //var ids=idArray.join(','); //按需要格式输出   
    //alert(ids);
}

//下面是文本框验证js-->
$(document).ready(function(){
    var validator = $("#signupform").validate({
        rules: {
            textarea2: {
                required: true
            }
        },
        // the errorPlacement has to take the table layout into account
        errorPlacement: function(error, element){
            error.appendTo(element.parent());
        },
        // set this class to error-labels to indicate valid fields
        success: function(label){
            // set &nbsp; as text for IE
            label.html("&nbsp;").addClass("checked");
        }
    });
});
