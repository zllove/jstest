function Xiaomomo(obj) {//构造函数
    //面向对象。made by wuhan/xiaomomo
    this.scrolling = obj;//获取对象
    this.img = this.getByClass("img", obj)[0]; // 获取class为img第一个标签
    this.num = this.getByClass("num", obj)[0]; // 获取class为num第一个标签
    this.ali = this.img.getElementsByTagName("li"); // 获取class为img第一个标签下的所有li
    this.oli = this.num.getElementsByTagName("li"); // 获取class为umg第一个标签下的所有li
    this.imgWidth = this.getRealStyle(obj.getElementsByTagName("img")[0], "width"); // 获取图片的宽度
    this.img.style.width = this.ali.length * parseInt(this.imgWidth) + "px"; // 设置img标签的宽度
    this.inow = 0;//定义inow等于
    var that = this;//定义that等于this
    var time = null;
    var speed = 2000;//速度
    for (var i = 0; i < this.oli.length; i++) {
        this.oli[i].index = i
        this.oli[i].onmouseover = function () {
            this.inow = this.index;
            that.tab(this.index);
            clearInterval(time);
        }
        this.oli[i].onmouseout = function () {
            time = setInterval(function () {
                that.autoPlay();
            }, speed);
        }
    }
    var time = setInterval(function () {
        that.autoPlay();
    }, speed)
}

Xiaomomo.prototype.autoPlay = function () { // 为构造函数原型添加autoPlay方法
    ++this.inow;
    if (this.inow >= this.ali.length) {
        this.inow = 0;
    }
    this.tab(this.inow);
}
Xiaomomo.prototype.tab = function (number) { // 为构造函数原型添加tab方法
    for (var i = 0; i < this.oli.length; i++) {
        this.oli[i].className = ""
        //stopMove(oli[i]);
    }
    this.oli[number].className = "hover";
    //img.style.left=-(inow)*490+"px"
    startMove(this.img, {left:-number * 490}, move_type.buffer);
}
Xiaomomo.prototype.getByClass = function (className, parents) {//为构造函数原型添加获取class方法
    parents = parents || document;
    if (parents.getElementsByClassName) {
        return parents.getElementsByClassName(className);
    }
    var nodes = parents.getElementsByTagName("*");
    ret = [];
    for (i = 0; i < nodes.length; i++) {
        if (this.hasClass(nodes[i], className)) ret.push(nodes[i]);
    }
    return ret;
};
Xiaomomo.prototype.hasClass = function (node, className) {//为构造函数原型添加有无class方法
    var names = node.className.split(/\s+/);
    for (var i = 0; i < names.length; i++) {
        if (names[i] == className) return true
    }
    return false
};
Xiaomomo.prototype.getRealStyle = function (o, name) {//为构造函数原型添加获取本身的样式方法
    if (window.getComputedStyle) {
        var style = window.getComputedStyle(o, null);
        return style.getPropertyValue(name);
    } else {
        var style = o.currentStyle;
        return style[name];
    }
}