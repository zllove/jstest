/**
 * @author: zyh
 * @see: <a href="mailto:jikeytang@gmail.com">zyh</a>
 * @time: 2013-10-11 上午11:38
 * @info:
 */
;(function(win, $){
    $.fn.sameEdit = function(options){
        var that = this,
            opts = $.extend({}, {
                type : 'text',  // 'text, textarea, select'
                width : 'auto',
                height : 'auto',
                textCls : 'same-text',
                divCls : 'same-btn-wrap', // 包裹提交按钮div
                submit : '提交',
                submitCls : 'same-submit',
                cancel : '返回',
                cancelCls : 'same-cancel',
                textareaCls : 'same-textarea',
                formCls : 'same-form',
                ajaxType : 'GET',
                onsubmit : function(){ },
                callback : function(){ },
                ajaxOptions : {},
                ajaxUrl : ''
            }, options),
            input = null,
            editing = false; // 是否正在编辑

        return this.each(function(){
            var form = null,
                submit = null,
                cancel = null,
                oDiv = null,
//                input = null,
                html = that.html();

            that.on('click', function(e){
                if(editing){ return; }

                form = $('<form/>').addClass(opts.formCls);

                // 处理各种可能类型
                switch(opts.type){
                    case 'textarea' :
                        input = $('<textarea />').appendTo(form).addClass(opts.textareaCls).val(html);
                        break;
                    case 'text' :
                        input = $('<input type="text" />').appendTo(form).addClass(opts.textCls).val(html);
                    default :
                        break;
                }

                console.log(input);
                that.html('').append(form);

                oDiv = $('<div/>').appendTo(form).addClass(opts.divCls);
                submit = $('<input type="submit" value="' + opts.submit + '" />').appendTo(oDiv).addClass(opts.submitCls);
                cancel = $('<input type="button" value="' + opts.cancel + '" />').appendTo(oDiv).addClass(opts.cancelCls);

                e.stopPropagation();
                e.preventDefault();
                editing = true;

                form.submit(function(e){
                    e.preventDefault();

                    var submitData = {
                            settingname : input.val(),
                            settingid : that.id
                        },
                        ajaxOptions = {
                            type : 'POST',
                            data : submitData,
                            dataType : 'html',
                            url : opts.ajaxUrl,
                            success : function(result, status){
                                if(callback){
                                    callback();
                                }
                                that.html(result);
                            },
                            error : function(){

                            }
                        }

                    $.extend(ajaxOptions, opts.ajaxOptions);
                    $.ajax(ajaxOptions);

                    alert('submit222');
                });

                // 返回按钮处理
                cancel.on('click', function(){
                    console.log(editing);
                    if(editing){
                        console.log(editing);
                        that.html(html);
                        editing = false;
                    }
                });

                $('#out').text($(this).html());
            });

        });
    }
}(window, jQuery));
