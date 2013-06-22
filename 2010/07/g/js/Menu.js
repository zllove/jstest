//load fn
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    }
    else {
        window.onload = function() {
            oldonload();
            func();
        }
    }
}

//menu
function scrollDoor() {
}
scrollDoor.prototype = {
    so: function(menus, divs, openClass, closeClass) {
        var _this = this;
        if (menus.length != divs.length) {
            alert("菜单层数量和内容层数量不一样!");
            return false;
        }
        for (var i = 0; i < menus.length; i++) {
            _this.$a(menus[i]).value = i;
            _this.$a(menus[i]).onclick = function() {
                for (var j = 0; j < menus.length; j++) {
                    _this.$a(menus[j]).className = closeClass;
                    _this.$a(divs[j]).style.display = "none";
                }
                _this.$a(menus[this.value]).className = openClass;
                _this.$a(divs[this.value]).style.display = "block";
            }
        }
    },
    sh: function(menus, divs, openClass, closeClass) {
        var _this = this;
        if (menus.length != divs.length) {
            alert("菜单层数量和内容层数量不一样!");
            return false;
        }
        for (var i = 0; i < menus.length; i++) {
            _this.$a(menus[i]).value = i;
            _this.$a(menus[i]).onmouseover = function() {
                for (var j = 0; j < menus.length; j++) {
                    _this.$a(menus[j]).className = closeClass;
                    _this.$a(divs[j]).style.display = "none";
                }
                _this.$a(menus[this.value]).className = openClass;
                _this.$a(divs[this.value]).style.display = "block";
            }
        }
    },
    $a: function(oid) {
        if (typeof (oid) == "string")
            return document.getElementById(oid);
        return oid;
    }
}
