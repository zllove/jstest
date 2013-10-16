/**
 * Created by jikey.
 * Link: jikeytang@gmail.com
 * Date: 12-2-24
 * Time: 上午8:45
 * Info:
 */
(function () {
    var imageEditor = {
        // 获得窗口的大小
        getWindowSize   :function () {
            if (self.innerHeight) { // WEBKIT
                return { 'width':self.innerWidth, 'height':self.innerHeight };
            } else if (document.documentElement && document.documentElement.clientHeight) { // IE 标准模式
                return {
                    'width' :document.documentElement.clientWidth,
                    'height':document.documentElement.clientHeight
                };
            } else if (document.body) { // IE quirks
                return {
                    'width' :document.body.clientWidth,
                    'height':document.body.clientHeight
                }
            }
        },
        // 获得对象的宽，高，顶，左
        getDimensions   :function (e) {
            return {
                top   :e.offsetTop,
                left  :e.offsetLeft,
                width :e.offsetWidth,
                height:e.offsetHeight
            };
        },
        /**
         * 设置上，左，右，底边距，宽高属性
         * @param e 要设置的对象
         * @param dim 要设置的样式对象
         * { 'width': 10, 'height': 20}
         * @param updateMessage 是否更新信息
         */
        setNumbericStyle:function (e, dim, updateMessage) {
            // 检查信息
            updateMessage = updateMessage || false;
            // 分配一个新对象，原对象保持不变
            var style = {};
            for (var i in dim) {
                if (!dim.hasOwnProperty(i)) continue;
                style[i] = (dim[i] || '0') + 'px';
            }
            ADS.setStyleById(e, style);
            // 如果存在信息则更新
            if (updateMessage) {
                this.elements.cropSizeDisplay.firstChild.nodeValue = dim.width + 'x' + dim.height;
            }
        }
    };
    var me = imageEditor; // 为了更好的被孙子对象访问，缓存对象
    // 编辑图像时保存信息的属性
    imageEditor.info = {
        resizeCropArea:false, // 拖动区域
        pointerStart  :null,  // 鼠标起始点
        resizeeStart  :null,  //
        cropAreaStart :null,
        imgSrc        :null   // 图片路径
    };
    // 保存编辑器中DOM对象实例的属性
    imageEditor.elements = {
        'backdrop'        :null, // 背景幕
        'editor'          :null, // 编辑器div
        'resizeHandle'    :null, // 缩放手柄
        'cropSizeDisplay' :null, // 裁剪大小显示区域
        'resizee'         :null, // 可缩放的图像
        'resizeeCover'    :null, // 半透明蒙版
        'cropArea'        :null, // 裁剪大小显示区域
        'resizeeClone'    :null, // 在裁剪区域中创建图像的副本
        'cropResizeHandle':null, // 裁剪缩放手柄
        'saveHandle'      :null, // 保存手柄
        'cancelHandle'    :null  // 取消缩放手柄
    };
    // 按着需要注册事件及修改DOM会在window载入时自动运行
    imageEditor.load = function (w3cEvent) {
        // 取得页面中所有带ADSImageEditor类名的表单元素
        var forms = ADS.getElementsByClassName('ADSImageEditor', 'FORM');
        // 在符合条件的表单中查找图像
        for (var i = 0, len = forms.length; i < len; i++) {
            // 查找表单中的图像
            var images = forms[i].getElementsByTagName('img');
            // 如果这个表单不包含图像，跳过
            if (!images[0]) continue;
            // 为图像添加imageEditor.imageClick事件
            ADS.addEvent(images[0], 'click', imageEditor.imageClick);
            // 修改类名以便CSS按照需要修改样式
            forms[i].className += ' ADSImageEditorModified';
            // 如果表单的类名被修改，则会应用CSS文件中包含的修改页面样式的额外规则
        }

    };
    imageEditor.unload = function (w3cEvent) {
        // 移除编辑及背景幕(backdrop)
        document.body.removeChild(imageEditor.elements.editor);
        document.body.removeChild(imageEditor.elements.backdrop);
    };
    imageEditor.imageClick = function (w3cEvent) {
        var that = me;
        // 创建新的JS image对象，以便确定图像的宽度和高度
        var image = new Image();
        // this 引用被单击的图像元素
        image.src = imageEditor.info.imgSrc = this.src;
        // 为放置背景幕和居中编辑器而取得页面大小
        var windowSize = that.getWindowSize();
        // 创建背景幕div,并使其撑满整个页面
        var backdrop = document.createElement('div');
        imageEditor.elements.backdrop = backdrop;
        ADS.setStyleById(backdrop, {
            'position'        :'absolute',
            'background-color':'black',
            'opacity'         :'0.8',
            'width'           :'100%',
            'height'          :'100%',
            'z-index'         :10000,
            'filter'          :'alpha(opacity=80)' // IE滤镜
        });
        that.setNumbericStyle(backdrop, {
            'left'  :0,
            'top'   :0,
            'width' :windowSize.width,
            'height':windowSize.height
        });
        document.body.appendChild(backdrop);
        // 创建编辑器div以包含编辑工具的GUI
        var editor = document.createElement('div');
        imageEditor.elements.editor = editor;
        ADS.setStyleById(editor, {
            'position':'absolute',
            'z-index' :10001
        });
        that.setNumbericStyle(editor, {
            'left'  :Math.ceil((windowSize.width - image.width) / 2),
            'top'   :Math.ceil((windowSize.height - image.height) / 2),
            'width' :image.width,
            'height':image.height
        });
        document.body.appendChild(editor);
        // 创建缩放手柄
        var resizeHandle = document.createElement('div');
        imageEditor.elements.resizeHandle = resizeHandle;
        ADS.setStyleById(resizeHandle, {
            'position'  :'absolute',
            'background':'transparent url(img/handles.gif) no-repeat 0 0'
        });
        that.setNumbericStyle(resizeHandle, {
            'left'  :(image.width - 18),
            'top'   :(image.height - 18),
            'width' :28,
            'height':28
        });
        // 将缩放手柄添加到编辑器中
        editor.appendChild(resizeHandle);
        // 创建可缩放的图像
        var resizee = document.createElement('img');
        imageEditor.elements.resizee = resizee;
        resizee.src = imageEditor.info.imgSrc;
        // 去掉应用给img元素的任何css
        ADS.setStyleById(resizee, {
            'position':'absolute',
            'margin'  :0,
            'padding' :0,
            'border'  :0
        });
        that.setNumbericStyle(resizee, {
            'left'  :0,
            'top'   :0,
            'width' :image.width,
            'height':image.height
        });
        editor.appendChild(resizee);
        // 创建半透明的蒙版(cover)
        var resizeeCover = document.createElement('div');
        imageEditor.elements.resizeeCover = resizeeCover;
        ADS.setStyleById(resizeeCover, {
            'position'        :'absolute',
            'background-color':'white',
            'opacity'         :0.5,
            'filter'          :'alpha(opacity=50)'
        });
        that.setNumbericStyle(resizeeCover, {
            'left'  :0,
            'top'   :0,
            'width' :image.width,
            'height':image.height
        });
        editor.appendChild(resizeeCover);
        // 创建裁剪大小显示区域
        var cropSizeDisplay = document.createElement('div');
        imageEditor.elements.cropSizeDisplay = cropSizeDisplay;
        ADS.setStyleById(cropSizeDisplay, {
            'position'        :'absolute',
            'background-color':'black',
            'color'           :'white'
        });
        that.setNumbericStyle(cropSizeDisplay, {
            'left'         :0,
            'top'          :0,
            'font-size'    :10,
            'line-height'  :10,
            'padding'      :4,
            'padding-right':4
        });
        cropSizeDisplay.appendChild(document.createTextNode('size'));
        // 创建裁剪区域容器
        var cropArea = document.createElement('div');
        imageEditor.elements.cropArea = cropArea;
        ADS.setStyleById(cropArea, {
            'position'        :'absolute',
            'overflow'        :'hidden',
            'background-color':'transparent'
        });
        that.setNumbericStyle(cropArea, {
            'left'  :0,
            'top'   :0,
            'width' :image.width,
            'height':image.height
        });
        editor.appendChild(cropArea);
        // 在裁剪区域中创建图像的副本
        var resizeeClone = resizee.cloneNode(false);
        imageEditor.elements.resizeeClone = resizeeClone;
        cropArea.appendChild(resizeeClone);
        cropArea.appendChild(cropSizeDisplay);
        // 创建裁剪缩放手柄
        var cropResizeHandle = document.createElement('div');
        imageEditor.elements.cropResizeHandle = cropResizeHandle;
        ADS.setStyleById(cropResizeHandle, {
            'position'  :'absolute',
            'background':'transparent url(img/handles.gif) no-repeat 0 0'
        });
        that.setNumbericStyle(cropResizeHandle, {
            'right' :0,
            'bottom':0,
            'width' :18,
            'height':18
        });
        cropArea.appendChild(cropResizeHandle);
        // 创建保存手柄
        var saveHandle = document.createElement('div');
        imageEditor.elements.saveHandle = saveHandle;
        ADS.setStyleById(saveHandle, {
            'position'  :'absolute',
            'background':'transparent url(img/handles.gif) no-repeat -40px 0'
        });
        that.setNumbericStyle(saveHandle, {
            'left'  :0,
            'bottom':0,
            'width' :16,
            'height':18
        });
        cropArea.appendChild(saveHandle);
        // 创建取消缩放手柄
        var cancelHandle = document.createElement('div');
        imageEditor.elements.cancelHandle = cancelHandle;
        ADS.setStyleById(cancelHandle, {
            'position'  :'absolute',
            'background':'transparent url(img/handles.gif) no-repeat -29px -11px'
        });
        that.setNumbericStyle(cancelHandle, {
            'right' :0,
            'top'   :0,
            'width' :18,
            'height':16
        });
        cropArea.appendChild(cancelHandle);
        // 向DOM元素添加事件
        // 缩放手柄翻转图
        ADS.addEvent(resizeHandle, 'mouseover', function (w3cEvent) {
            ADS.setStyleById(this, { 'background-position':'0px -29px' });
        });
        ADS.addEvent(resizeHandle, 'mouseout', function (w3cEvent) {
            ADS.setStyleById(this, { 'background-position':'0px 0px' });
        });
        // 裁剪手柄翻转图
        ADS.addEvent(cropResizeHandle, 'mouseover', function (w3cEvent) {
            ADS.setStyleById(this, { 'background-position':'0px -29px' });
        });
        ADS.addEvent(cropResizeHandle, 'mouseout', function (w3cEvent) {
            ADS.setStyleById(this, { 'background-position':'0px 0px' });
        });
        // 保存手柄翻转图
        ADS.addEvent(saveHandle, 'mouseover', function (w3cEvent) {
            ADS.setStyleById(this, { 'background-position':'-40px -29px' });
        });
        ADS.addEvent(saveHandle, 'mouseout', function (w3cEvent) {
            ADS.setStyleById(this, { 'background-position':'-40px 0px' });
        });
        // 取消手柄翻转图
        ADS.addEvent(cancelHandle, 'mouseover', function (w3cEvent) {
            ADS.setStyleById(this, { 'background-position':'-29px -40px' });
        });
        ADS.addEvent(cancelHandle, 'mouseout', function (w3cEvent) {
            ADS.setStyleById(this, { 'background-position':'-29px -11px' });
        });
        // 启动图像缩放事件流
        ADS.addEvent(resizeHandle, 'mousedown', imageEditor.resizeMouseDown);
        // 启动裁剪区域拖动事件流
        ADS.addEvent(cropArea, 'mousedown', imageEditor.cropMouseDown);
        // 启动裁剪区域缩放事件流
        ADS.addEvent(cropResizeHandle, 'mousedown', function (w3cEvent) {
            imageEditor.info.resizeCropArea = true;
        });
        // 防止保存手柄启动裁剪拖动事件流
        ADS.addEvent(saveHandle, 'mousedown', function (w3cEvent) {
            ADS.stopPropagation(w3cEvent);
        });
        // 在单击保存手柄或双击裁剪区域时保存图像
        ADS.addEvent(saveHandle, 'click', imageEditor.saveClick);
        ADS.addEvent(cropArea, 'dbclick', imageEditor.saveClick);
        // 防止取消手柄启动裁剪拖动事件流
        ADS.addEvent(cancelHandle, 'mousedown', function (w3cEvent) {
            ADS.stopPropagation(w3cEvent);
        });
        // 在单击时取消改变
        ADS.addEvent(cancelHandle, 'click', imageEditor.cancelClick);
        // 如果窗口大小改变则调整背景幕的大小
        ADS.addEvent(window, 'resize', function (w3cEvent) {
            var windowSize = that.getWindowSize();
            that.setNumbericStyle(backdrop, {
                'left'  :0,
                'top'   :0,
                'width' :windowSize.width,
                'height':windowSize.height
            })
        });
    };
    // 拖动手柄添加 mousedown 事件监听
    imageEditor.resizeMouseDown = function (w3cEvent) {
        var that = me;
        // 保存当前位置和尺寸
        imageEditor.info.pointerStart = ADS.getPointerPositionInDocument(w3cEvent);
        imageEditor.info.resizeeStart = that.getDimensions(imageEditor.elements.resizee);
        imageEditor.info.cropAreaStart = that.getDimensions(imageEditor.elements.cropArea);
        // 添加其余事件以启用拖动
        ADS.addEvent(document, 'mousemove', imageEditor.resizeMouseMove); // 添加拖动
        ADS.addEvent(document, 'mouseup', imageEditor.resizeMouseUp); // 释放拖动
        // 停止事件流
        ADS.stopPropagation(w3cEvent);
        ADS.preventDefault(w3cEvent);
    };
    // 拖动手柄添加 mousemove 事件监听
    imageEditor.resizeMouseMove = function (w3cEvent) {
        var that = me,
            info = imageEditor.info;
        // 取得当前鼠标指针所在位置
        var pointer = ADS.getPointerPositionInDocument(w3cEvent);
        // 基于鼠标指针来计算图像新的宽度和高度
        var width = (info.resizeeStart.width + pointer.x - info.pointerStart.x),
            height = (info.resizeeStart.height + pointer.y - info.pointerStart.y);
        // 最小尺寸是42平方像素
        if (width < 42) width = 42;
        if (height < 42) height = 42;
        // 计算基于原始值的百分比
        var widthPercent = (width / info.resizeeStart.width),
            heightPercent = (height / info.resizeeStart.height);
        // 如果按下shift键，则按比例缩放
        if (ADS.getEventObject(w3cEvent).shiftKey) {
            if (widthPercent > heightPercent) {
                heightPercent = widthPercent;
                height = Math.ceil(info.resizeeStart.height * heightPercent);
            } else {
                widthPercent = heightPercent;
                width = Math.ceil(info.resizeeStart.width * widthPercent);
            }
        }
        // 计算裁剪区域的尺寸
        var cropWidth = Math.ceil(info.cropAreaStart.width * widthPercent),
            cropHeight = Math.ceil(info.cropAreaStart.height * heightPercent),
            cropLeft = Math.ceil(info.cropAreaStart.left * widthPercent),
            cropTop = Math.ceil(info.cropAreaStart.top * heightPercent);
        // 缩放对象
        that.setNumbericStyle(imageEditor.elements.resizee, {
            'width' :width,
            'height':height
        });
        that.setNumbericStyle(imageEditor.elements.resizeeCover, {
            'width' :width,
            'height':height
        });
        that.setNumbericStyle(imageEditor.elements.resizeHandle, {
            'left':(width - 18),
            'top' :(height - 18)
        });
        that.setNumbericStyle(imageEditor.elements.cropArea, {
            'left'  :cropLeft,
            'top'   :cropTop,
            'width' :cropWidth,
            'height':cropHeight
        }, true);
        that.setNumbericStyle(imageEditor.elements.resizeeClone, {
            'left'  :(cropLeft * -1),
            'top'   :(cropTop * -1),
            'width' :width,
            'height':height
        });
        // 停止事件流
        ADS.stopPropagation(w3cEvent);
        ADS.preventDefault(w3cEvent);
    };
    imageEditor.resizeMouseUp = function (w3cEvent) {
        // 移除事件侦听器以停止拖动
        ADS.removeEvent(document, 'mousemove', imageEditor.resizeMouseMove);
        ADS.removeEvent(document, 'mouseup', imageEditor.resizeMouseUp);
        // 停止事件流
        ADS.stopPropagation(w3cEvent);
        ADS.preventDefault(w3cEvent);
    };
    imageEditor.cropMouseDown = function (w3cEvent) {
        var that = me;
        imageEditor.info.pointerStart = ADS.getPointerPositionInDocument(w3cEvent);
        imageEditor.info.cropAreaStart = that.getDimensions(imageEditor.elements.cropArea);
        // 包含缩放以限制裁剪区域的移动
        var resizeeStart = that.getDimensions(imageEditor.elements.resizee);
        imageEditor.info.maxX = resizeeStart.left + resizeeStart.width;
        imageEditor.info.maxY = resizeeStart.top + resizeeStart.height;
        ADS.addEvent(document, 'mousemove', imageEditor.cropMouseMove);
        ADS.addEvent(document, 'mouseup', imageEditor.cropMouseUp);
        // 停止事件流
        ADS.stopPropagation(w3cEvent);
        ADS.preventDefault(w3cEvent);
    };
    // 裁剪区域添加 mousemove 事件绑定
    imageEditor.cropMouseMove = function (w3cEvent) {
        var that = me,
            pointer = ADS.getPointerPositionInDocument(w3cEvent);
        // 包含缩放以限制裁剪区域的移动
        if (imageEditor.info.resizeCropArea) {
            // 缩放裁剪区域
            var width = (imageEditor.info.cropAreaStart.width + pointer.x - imageEditor.info.pointerStart.x);
            var height = (imageEditor.info.cropAreaStart.height + pointer.y - imageEditor.info.pointerStart.y);
            // 如果按下shift键，则按比例缩放计算基于原始值的百分比
            var widthPercent = (width / imageEditor.info.cropAreaStart.width);
            var heightPercent = (height / imageEditor.info.cropAreaStart.height);
            if (ADS.getEventObject(w3cEvent).shiftKey) {
                if (widthPercent > heightPercent) {
                    heightPercent = widthPercent;
                    height = Math.ceil(imageEditor.info.cropAreaStart.height * heightPercent);
                } else {
                    widthPercent = heightPercent;
                    width = Math.ceil(imageEditor.info.cropAreaStart.width * widthPercent);
                }
            }
            // 查检新位置是否超过出了边界
            if (imageEditor.info.cropAreaStart.left + width > imageEditor.info.maxX) {
                width = imageEditor.info.maxX - imageEditor.info.cropAreaStart.left;
            } else if (width < 36) {
                width = 36;
            }
            if (imageEditor.info.cropAreaStart.top + height > imageEditor.info.maxY) {
                height = imageEditor.info.maxY - imageEditor.info.cropAreaStart.top;
            } else if (height < 36) {
                height = 36;
            }
            that.setNumbericStyle(imageEditor.elements.cropArea, {
                'width' :width,
                'height':height
            }, true);
        } else {
            // 移动裁剪区域
            var left = (imageEditor.info.cropAreaStart.left + pointer.x - imageEditor.info.pointerStart.x);
            var top = (imageEditor.info.cropAreaStart.top + pointer.y - imageEditor.info.pointerStart.y);
            // 检查新位置是否超出了边界，若超出则加以限制
            var maxLeft = imageEditor.info.maxX - imageEditor.info.cropAreaStart.width;
            if (left < 0) { left = 0; }
            else if (left > maxLeft) { left = maxLeft; }
            var maxTop = imageEditor.info.maxY - imageEditor.info.cropAreaStart.height;
            if (top < 0) { top = 0; }
            else if (top > maxTop) { top = maxTop; }
            that.setNumbericStyle(imageEditor.elements.cropArea, {
                'left':left,
                'top' :top
            });
            that.setNumbericStyle(imageEditor.elements.resizeeClone, {
                'left':(left * -1),
                'top' :(top * -1)
            });
        }
        // 停止事件流
        ADS.stopPropagation(w3cEvent);
        ADS.preventDefault(w3cEvent);
    };
    imageEditor.cropMouseUp = function (w3cEvent) {
        // 移除事件流
        var eventObject = ADS.getEventObject(w3cEvent);
        imageEditor.info.resizeCropArea = false;
        ADS.removeEvent(document, 'mousemove', imageEditor.cropMouseMove);
        ADS.removeEvent(document, 'mouseup', imageEditor.cropMouseUp);
        // 停止事件流
        ADS.stopPropagation(w3cEvent);
        ADS.preventDefault(w3cEvent);
    };
    imageEditor.saveClick = function (w3cEvent) {
        // 此处只是发出一个警告，如果成功则卸载编辑器
        alert('This should save the information back to the server.');
        // 如果成功则卸载编辑器
        imageEditor.unload();

    };
    imageEditor.cancelClick = function (w3cEvent) {
        if (confirm('Are you sure you want to cancel you changes?')) {
            // 卸载编辑器
            imageEditor.unload();
        }
    };
    window['ADS']['imageEditor'] = imageEditor;
})();
