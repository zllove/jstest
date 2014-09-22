/**
 * Created by jikey.
 * Link: jikeytang@gmail.com
 * Date: 12-2-27
 * Time: 下午4:28
 * Info:
 */
;
(function (window) {
    var imageEditor = {
        // 编辑图像时保存信息属性
        info           :{
            resizeCropArea:false, // 特殊的缩放标志，由于在编辑器上操作的事件都会冒泡到cropArea上，(that.cropMouseMove会根据这个标志来确定用户是想要拖动裁剪区域=false, 还是想缩放裁剪区域=true)
            pointerStart  :null, // 鼠标开始位置
            resizeeStart  :null, // 拖动开始位置
            cropAreaStart :null, // 拖动区域开始位置
            imgSrc        :null   // 图像路径
        },
        // DOM 对象实例属性
        elements       :{
            'backdrop'        :null, // 遮罩背景层
            'editor'          :null, // 编辑器容器
            'resizeHandle'    :null, // 缩放手柄
            'cropSizeDisplay' :null, // 裁剪大小显示区域
            'resizee'         :null, // 可缩放的图像
            'resizeeCover'    :null, // 半透明蒙版
            'cropArea'        :null, // 裁剪大小显示区域
            'resizeeClone'    :null, // 在裁剪区域内的图像副本
            'cropResizeHandle':null, // 裁剪缩放手柄
            'saveHandle'      :null, // 保存手柄
            'cancelHandle'    :null // 取消缩放手柄
        },
        // 获得窗口的大小
        getWindowSize  :function () {
            if (self.innerHeight) { // WEBKIT
                return { 'width':self.innerWidth, 'height':self.innerHeight };
            } else if (document.documentElement && document.documentElement.clientHeight) { // IE standards 模式
                return {
                    'width' :document.documentElement.clientWidth,
                    'height':document.documentElement.clientHeight
                };
            } else if (document.body) { // IE quirks 模式
                return {
                    'width' :document.body.clientWidth,
                    'height':document.body.clientHeight
                };
            }
        },
        // 获得给定对象的的宽高，以及离父元素的顶，左的距离
        getDimensions  :function (e) {
            return {
                top   :e.offsetTop,
                left  :e.offsetLeft,
                width :e.offsetWidth,
                height:e.offsetHeight
            }
        },
        /**
         * 设置给定单位添加 + 'px'的样式,以便于各个浏览器的兼容
         * @param e
         * @param dim
         * @param updateMessage
         */
        setNumericStyle:function (e, dim, updateMessage) {
            // 检查信息
            updateMessage = updateMessage || false;
            // 分配一个新对象，原对象保持不变
            var style = {};
            for (var i in dim) {
                if (!dim.hasOwnProperty(i)) {
                    continue;
                }
                style[i] = (dim[i] || '0') + 'px';
            }
            ADS.setStyleById(e, style);
            // 如果存在信息则更新
            if (updateMessage) {
                this.elements.cropSizeDisplay.firstChild.nodeValue = dim.width + 'x' + dim.height;
            }
        },
        // 入口调用方法
        load           :function (w3cEvent) {
            var that = this;
            // 取得页面中所有带ADSImageEditor类名的表单元素
            var forms = ADS.getElementsByClassName('ADSImageEditor', 'FORM');
            // 在符合条件的表单中查找图像
            for (var i = 0, len = forms.length; i < len; i++) {
                // 查找表单中的图像
                var images = forms[i].getElementsByTagName('img');
                // 如果这个表单不包含图像，则跳过
                if (!images[0]) continue;
                imageEditor.info.imgSrc = images[0].src;
                // 为图像添加click事件，弹出新层，以便拖拽操作
                ADS.addEvent(images[0], 'click', function () {
                    that.imageClick.call(that, w3cEvent);
                });
                // 修改类名以便 css 按照需要修改样式
                forms[i].className += ' ADSImageEditorModified';
            }
        },
        // 移除编辑区
        unload         :function (w3cEvent) {
            // 移除编辑区及遮罩
            document.body.removeChild(this.elements.editor);
            document.body.removeChild(this.elements.backdrop);
        },
        // 单击事件
        imageClick     :function (w3cEvent) {
            // 创建新的image对象，以便确定图像的宽高
            var that = this,
                image = new Image();
            // this 引用被单击的的图像元素
            image.src = imageEditor.info.imgSrc;
            // 为放置背景遮罩和居中编辑器而取得页面大小
            var windowSize = that.getWindowSize();
            // 创建背景遮罩div,使其铺满整个页面
            var backdrop = document.createElement('div');
            backdrop.title = '我是全屏遮罩';
            that.elements.backdrop = backdrop;
            // 不需要添加 'px' 的css属性，用 setStyleById 方法处理
            ADS.setStyleById(backdrop, {
                'position'        :'absolute',
                'background-color':'black',
                'opacity'         :'0.8',
                'width'           :'100%',
                'height'          :'100%',
                'z-index'         :10000,
                'filter'          :'alpha(opacity=80)' // IE 滤镜
            });
            // 需要添加 'px' 单位的属性，用 setNumericStyle 方法处理
            that.setNumericStyle(backdrop, {
                'left'  :0,
                'top'   :0,
                'width' :windowSize.width,
                'height':windowSize.height
            });
            document.body.appendChild(backdrop);
            // 创建编辑器div容器
            var editor = document.createElement('div');
            editor.setAttribute('mytitle', '编辑器最大容器-editor');
//            editor.mytitle = '编辑器最大容器-editor';
            that.elements.editor = editor;
            ADS.setStyleById(editor, {
                'position':'absolute',
                'z-index' :10001
            });
            that.setNumericStyle(editor, {
                'left'  :Math.ceil((windowSize.width - image.width) / 2),
                'top'   :Math.ceil((windowSize.height - image.height) / 2),
                'width' :image.width,
                'height':image.height
            });
            document.body.appendChild(editor);
            // 创建容器缩放手柄
            var resizeHandle = document.createElement('div');
            resizeHandle.title = '缩放手柄-resizeHandle';
            that.elements.resizeHandle = resizeHandle;
            ADS.setStyleById(resizeHandle, {
                'position'  :'absolute',
                'background':'transparent url(img/handles.gif) no-repeat 0 0'
            });
            that.setNumericStyle(resizeHandle, {
                'left'  :(image.width - 18),
                'top'   :(image.height - 18),
                'width' :28,
                'height':28
            });
            // 将缩放手柄添加到编辑器中
            editor.appendChild(resizeHandle);
            // 创建可缩放图像
            var resizee = document.createElement('img');
            resizee.alt = '可缩放的图片-resizee';
            that.elements.resizee = resizee;
            resizee.src = that.info.imgSrc;
            ADS.setStyleById(resizee, {
                'position':'absolute',
                'margin'  :0,
                'padding' :0,
                'border'  :0
            });
            that.setNumericStyle(resizee, {
                'left'  :0,
                'top'   :0,
                'width' :image.width,
                'height':image.height
            });
            editor.appendChild(resizee);
            // 创建编辑区内的半透明蒙版
            var resizeeCover = document.createElement('div');
            resizeeCover.title = '编辑区内的透明蒙版-resizeeCover';
            that.elements.resizeeCover = resizeeCover;
            ADS.setStyleById(resizeeCover, {
                'position'        :'absolute',
                'background-color':'white',
                'opacity'         :'0.5',
                'filter'          :'alpha(opacity=50)' // IE 滤镜
            });
            that.setNumericStyle(resizeeCover, {
                'left'  :0,
                'top'   :0,
                'width' :image.width,
                'height':image.height
            });
            editor.appendChild(resizeeCover);
            // 创建裁剪显示区域
            var cropSizeDisplay = document.createElement('div');
            cropSizeDisplay.title = '裁剪显示区域-cropSizeDisplay';
            that.elements.cropSizeDisplay = cropSizeDisplay;
            ADS.setStyleById(cropSizeDisplay, {
                'position'        :'absolute',
                'background-color':'black',
                'color'           :'#f60'
            });
            that.setNumericStyle(cropSizeDisplay, {
                'left'         :0,
                'top'          :0,
                'font-size'    :12,
                'line-height'  :10,
                'padding'      :4,
                'padding-right':4
            });
            cropSizeDisplay.appendChild(document.createTextNode('size'));
            // 创建裁剪容器
            var cropArea = document.createElement('div');
            cropArea.title = '裁剪容器-cropArea';
            that.elements.cropArea = cropArea;
            ADS.setStyleById(cropArea, {
                'position'        :'absolute',
                'overflow'        :'hidden',
                'background-color':'transparent'
            });
            that.setNumericStyle(cropArea, {
                'left'  :0,
                'top'   :0,
                'width' :image.width,
                'height':image.height
            });
            editor.appendChild(cropArea);
            // 在裁剪区域中创建图像的副本
            var resizeeClone = resizee.cloneNode(false);
            resizeeClone.alt += ' 图像的副本-resizeeClone';
            that.elements.resizeeClone = resizeeClone;
            cropArea.appendChild(resizeeClone);
            cropArea.appendChild(cropSizeDisplay);
            // 创建裁剪缩放手柄
            var cropResizeHandle = document.createElement('div');
            cropResizeHandle.title = '裁剪缩放手柄-cropResizeHandle';
            that.elements.cropResizeHandle = cropResizeHandle;
            ADS.setStyleById(cropResizeHandle, {
                'position'  :'absolute',
                'background':'transparent url(img/handles.gif) no-repeat 0 0'
            });
            that.setNumericStyle(cropResizeHandle, {
                'right' :0,
                'bottom':0,
                'width' :18,
                'height':18
            });
            cropArea.appendChild(cropResizeHandle);
            // 创建保存手柄
            var saveHandle = document.createElement('div');
            saveHandle.title = '保存手柄-saveHandle';
            that.elements.saveHandle = saveHandle;
            ADS.setStyleById(saveHandle, {
                'position'  :'absolute',
                'background':'transparent url(img/handles.gif) no-repeat -40px 0'
            });
            that.setNumericStyle(saveHandle, {
                'left'  :0,
                'bottom':0,
                'width' :16,
                'height':18
            });
            cropArea.appendChild(saveHandle);
            // 创建取消缩放手柄
            var cancelHandle = document.createElement('div');
            cancelHandle.title = '取消缩放手柄-cancelHandle';
            that.elements.cancelHandle = cancelHandle;
            ADS.setStyleById(cancelHandle, {
                'position'  :'absolute',
                'background':'transparent url(img/handles.gif) no-repeat -29px -11px'
            });
            that.setNumericStyle(cancelHandle, {
                'right' :0,
                'top'   :0,
                'width' :18,
                'height':16
            });
            cropArea.appendChild(cancelHandle);
            // 向DOM元素添加事件
            // 缩放手柄 hover 效果
            ADS.addEvent(resizeHandle, 'mouseover', function (w3cEvent) {
                ADS.setStyleById(this, {
                    'background-position':'0 -29px',
                    'cursor'             :'se-resize'
                });
            });
            ADS.addEvent(resizeHandle, 'mouseout', function (w3cEvent) {
                ADS.setStyleById(this, { 'background-position':'0 0' });
            });
            // 裁剪手柄 hover 效果
            ADS.addEvent(cropResizeHandle, 'mouseover', function (w3cEvent) {
                ADS.setStyleById(this, {
                    'background-position':'0 -29px',
                    'cursor'             :'se-resize' // 拖动鼠标形状
                });
            });
            ADS.addEvent(cropResizeHandle, 'mouseout', function (w3cEvent) {
                ADS.setStyleById(this, { 'background-position':'0 0' });
            });
            // 保存手柄 hover 效果
            ADS.addEvent(saveHandle, 'mouseover', function (w3cEvent) {
                ADS.setStyleById(this, {
                    'background-position':'-40px -29px',
                    'cursor'             :'pointer'
                });
            });
            ADS.addEvent(saveHandle, 'mouseout', function (w3cEvent) {
                ADS.setStyleById(this, { 'background-position':'-40px 0' });
            });
            // 取消手柄 hover 效果
            ADS.addEvent(cancelHandle, 'mouseover', function (w3cEvent) {
                ADS.setStyleById(this, {
                    'background-position':'-29px -40px',
                    'cursor'             :'pointer'
                });
            });
            ADS.addEvent(cancelHandle, 'mouseout', function (w3cEvent) {
                ADS.setStyleById(this, { 'background-position':'-29px -11px' });
            });
            // 启动图像缩放事件流, 调用resizeMouseDown方法
            ADS.addEvent(resizeHandle, 'mousedown', that.resizeMouseDown);
            // 启动裁剪区域拖动事件流
            ADS.addEvent(cropArea, 'mousedown', that.cropMouseDown);
            ADS.addEvent(cropResizeHandle, 'mousedown', function (w3cEvent) {
                that.info.resizeCropArea = true; // 缩放裁剪区域，如果为false，则为移动裁剪区域
            });
            // 阻止保存手柄启动裁剪拖动事件流
            ADS.addEvent(saveHandle, 'mousedown', function (w3cEvent) {
                ADS.stopPropagation(w3cEvent);
            });
            // 在单击保存手柄或双击裁剪区域内时保存图像
            ADS.addEvent(saveHandle, 'click', imageEditor.saveClick);
            ADS.addEvent(cropArea, 'dblclick', imageEditor.saveClick);
            // 防止取消手柄启动裁剪拖动事件流
            ADS.addEvent(cancelHandle, 'mousedown', function (w3cEvent) {
                ADS.stopPropagation(w3cEvent);
            });
            // 在单击时取消改变
            ADS.addEvent(cancelHandle, 'click', that.cancelClick);
            // 如果窗口大小改变则调整遮罩层大小, (经测试，添加后反而会使遮罩层大小出现裂缝)
            ADS.addEvent(window, 'resize', function (w3cEvent) {
                var windowSize = that.getWindowSize();
                that.setNumericStyle(backdrop, {
                    'left'  :0,
                    'top'   :0,
                    'width' :windowSize.width,
                    'height':windowSize.height
                });
            });

        },
        // 图像缩放事件处理方法, 即右下角拖动(拖动它，即拖动整个弹出层)
        resizeMouseDown:function (w3cEvent) {
            var that = imageEditor,
                info = that.info;
            info.pointerStart = ADS.getPointerPositionInDocument(w3cEvent); // 保存当前鼠标位置，以便拖动后计算差值定位
            info.resizeeStart = that.getDimensions(that.elements.resizee); // 保存当前弹出层大小，顶，左位置，以便拖动后计算差值定位
            info.cropAreaStart = that.getDimensions(that.elements.cropArea); // 保存编辑区大小，顶，左位置，以便拖动后计算差值定位
            // 添加拖动事件绑定
            ADS.addEvent(document, 'mousemove', that.resizeMouseMove);
            ADS.addEvent(document, 'mouseup', that.resizeMouseUp);
            // 停止事件流
            ADS.stopPropagation(w3cEvent);
            ADS.preventDefault(w3cEvent);
        },
        // 拖动整个弹出层
        resizeMouseMove:function (w3cEvent) {
            var that = imageEditor,
                info = that.info;
            // 取得当前鼠标所在位置
            var pointer = ADS.getPointerPositionInDocument(w3cEvent);
            // 基于当前鼠标指针来计算新图像的宽高
            var width = (info.resizeeStart.width + pointer.x - info.pointerStart.x),
                height = (info.resizeeStart.height + pointer.y - info.pointerStart.y);
            // 最小尺寸42
            if (width < 42) width = 42;
            if (height < 42) height = 42;
            // 计算基于原始值的百分比
            var widthPercent = (width / info.resizeeStart.width),
                heightPercent = (height / info.resizeeStart.height);
            // 如果按下 shift 键，则按比例缩放
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
            that.setNumericStyle(that.elements.resizee, {
                'width' :width,
                'height':height
            });
            that.setNumericStyle(that.elements.resizeeCover, {
                'width' :width,
                'height':height
            });
            that.setNumericStyle(that.elements.resizeHandle, {
                'left':(width - 18),
                'top' :(height - 18)
            });
            that.setNumericStyle(that.elements.cropArea, {
                'left'  :cropLeft,
                'top'   :cropTop,
                'width' :cropWidth,
                'height':cropHeight
            });
            that.setNumericStyle(that.elements.resizeeClone, {
                'left'  :(cropLeft * -1),
                'top'   :(cropTop * -1),
                'width' :width,
                'height':height
            });
            // 停止事件流
            ADS.stopPropagation(w3cEvent);
            ADS.preventDefault(w3cEvent);
        },
        // 释放拖动
        resizeMouseUp  :function (w3cEvent) {
            // 移除事件，以释放拖动
            var that = imageEditor;
            ADS.removeEvent(document, 'mousemove', that.resizeMouseMove);
            ADS.removeEvent(document, 'mouseup', that.resizeMouseUp);
            // 停止事件流
            ADS.stopPropagation(w3cEvent);
            ADS.preventDefault(w3cEvent);
        },
        // 裁剪拖动事件处理
        cropMouseDown  :function (w3cEvent) {
            var that = imageEditor,
                info = that.info;
            info.pointerStart = ADS.getPointerPositionInDocument(w3cEvent);
            info.cropAreaStart = that.getDimensions(that.elements.cropArea); // 保存开始拖动时裁剪区域width,height,left,top值
            // 包含缩放以限制裁剪区域移动
            var resizeeStart = that.getDimensions(that.elements.resizee);
            info.maxX = resizeeStart.left + resizeeStart.width;
            info.maxY = resizeeStart.top + resizeeStart.height;
            ADS.addEvent(document, 'mousemove', that.cropMouseMove);
            ADS.addEvent(document, 'mouseup', that.cropMouseUp);
            // 停止事件流
            ADS.stopPropagation(w3cEvent);
            ADS.preventDefault(w3cEvent);
        },
        // 裁剪区域移动事件处理, 包含区域内右下角缩放按钮的事件处理
        cropMouseMove  :function (w3cEvent) {
            var that = imageEditor,
                pointer = ADS.getPointerPositionInDocument(w3cEvent),
                info = that.info;
            // 包含缩放以限制裁剪区域的移动
            if (that.info.resizeCropArea) { // 根据特殊的标志来判断，＝true 缩放裁剪区域
                var width = (info.cropAreaStart.width + pointer.x - info.pointerStart.x),
                    height = (info.cropAreaStart.height + pointer.y - info.pointerStart.y);
                // 如果按下 shift 则按等比例缩放图像
                var widthPercent = (width / info.cropAreaStart.width),
                    heightPercent = (height / info.cropAreaStart.height);
                if (ADS.getEventObject(w3cEvent).shiftKey) {
                    if (widthPercent > heightPercent) {
                        heightPercent = widthPercent;
                        height = Math.ceil(info.cropAreaStart.height * heightPercent);
                    } else {
                        widthPercent = heightPercent;
                        width = Math.ceil(info.cropAreaStart.width * widthPercent);
                    }
                }
                // 检查新位置是否超出了边界
                if (info.cropAreaStart.left + width > info.maxX) {
                    width = info.maxX - info.cropAreaStart.left;
                } else if (width < 36) {
                    width = 36;
                }
                if (info.cropAreaStart.top + height > info.maxY) {
                    height = info.maxY - info.cropAreaStart.top;
                } else if (height < 36) {
                    height = 36;
                }
                that.setNumericStyle(that.elements.cropArea, {
                    'width' :width,
                    'height':height
                }, true);
            } else { // 移动裁剪区域
                var left = (info.cropAreaStart.left + pointer.x - info.pointerStart.x),
                    top = (info.cropAreaStart.top + pointer.y - info.pointerStart.y);
                // 检查新位置是否超出了边界，如果超出则加以限制
                var maxLeft = info.maxX - info.cropAreaStart.width;
                if (left < 0) left = 0;
                else if (left > maxLeft) left = maxLeft;
                var maxTop = info.maxY - info.cropAreaStart.height;
                if (top < 0) top = 0;
                else if (top > maxTop) top = maxTop;
                that.setNumericStyle(that.elements.cropArea, {
                    'left':left,
                    'top' :top
                });
                that.setNumericStyle(that.elements.resizeeClone, {
                    'left':(left * -1),
                    'top' :(top * -1)
                });
            }
            // 停止事件流
            ADS.stopPropagation(w3cEvent);
            ADS.preventDefault(w3cEvent);
        },
        // 释放拖动事件处理
        cropMouseUp    :function (w3cEvent) {
            // 移除事件流
            var that = imageEditor,
                eventObject = ADS.getEventObject(w3cEvent);
            that.info.resizeCropArea = false;
            ADS.removeEvent(document, 'mousemove', that.cropMouseMove);
            ADS.removeEvent(document, 'mouseup', that.cropMouseUp);
            // 停止事件流
            ADS.stopPropagation(w3cEvent);
            ADS.preventDefault(w3cEvent);
        },
        // 保存事件处理
        saveClick      :function (w3cEvent) {
            alert('这个操作将会被保存！');
            imageEditor.unload();
        },
        // 取消事件处理
        cancelClick    :function () {
            if (confirm('确定不保存这个操作?')) {
                imageEditor.unload();
            }
        }

    };
    window['ADS']['imageEditor'] = imageEditor;
})(window);