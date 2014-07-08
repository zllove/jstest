(function () {
    function e(e, f) {
        return function () {
            var l = this._super;
            this._super = e;
            var h = f.apply(this, arguments);
            this._super = l;
            return h
        }
    }

    var f = !1, k = /xyz/.test(function () {
    }) ? /\b_super\b/ : /.*/, g = function () {
    };
    g.extend = function (n) {
        function h() {
            !f && this.init && this.init.apply(this, arguments)
        }

        var l = this.prototype;
        f = !0;
        var u = new this;
        f = !1;
        for (var g in n)u[g] = typeof n[g] == "function" && typeof l[g] == "function" && k.test(n[g]) ? e(l[g], n[g]) : n[g];
        h.prototype = u;
        h.constructor = h;
        h.extend = arguments.callee;
        return h
    };
    window.Class = g;
    window.MCR = function (e, f, l) {
        this.controller = new e;
        this.model = new f;
        this.renderer = new l;
        this.controller.model = this.model;
        this.controller.renderer = this.renderer;
        this.model.controller = this.controller;
        this.renderer.controller = this.controller;
        typeof this.model.init == "function" && this.model.init();
        typeof this.renderer.init == "function" && this.renderer.init();
        typeof this.controller.init == "function" && this.controller.init();
        return{render : this.renderer, controller : this.controller, model : this.model}
    };
    String.prototype.trimAll = function () {
        return this.replace(/\s/g, "")
    };
    String.prototype.hasString = function (e) {
        if (typeof e == "object") {
            for (var f = 0, l = e.length; f < l; f++)if (!this.hasString(e[f]))return!1;
            return!0
        } else return this.indexOf(e) != -1 ? !0 : !1
    };
    window.templates = {};
    window.APP = {};
    window.Config = {timeOut : 6E3, common : {url : {actionUpdate : "/rank/tweetV2.do"}}};
    window.WB = {widget : {status : {}, statusList : {}, sendBox : {}}};
    WB.merge = APP.merge = function (e) {
        for (var f in e)this[f] = e[f]
    };
    var h, m = {
        pageWidth : function () {
            return parseFloat(document.documentElement.clientWidth)
        },
        pageHeight : function () {
            return Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
        },
        windowWidth : function () {
            return parseFloat(screen.width)
        },
        windowHeight : function () {
            return self.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body.clientHeight
        },
        scrollY : function () {
            return self.pageYOffset || document.documentElement && document.documentElement.scrollTop || document.body.scrollTop
        },
        scrollX : function () {
            return self.pageXOffset || document.documentElement && document.documentElement.scrollLeft || document.body.scrollLeft
        },
        getRandomNum : function () {
            return(new Date).getTime()
        },
        random : function (e, f) {
            typeof e === "undefined" && (e = 0);
            typeof f === "undefined" && (f = 10);
            return Math.floor(Math.random() * (f - e) + e)
        },
        imgArray : [], initAnalytics : function () {
            for (var e = 0; e < 5; e++)APP.imgArray.push(new Image)
        },
        analytics : function (e) {
            if (typeof e === "undefined")throw"no analytics address";
            APP.imgArray[APP.random(0, 5)].src = e.hasString("http") ? e : "http://" + location.host + (/^\//.test(e) ? e : "/" + e)
        },
        encodeSpecialHtmlChar : function (e) {
            if (e) {
                for (var f = ["&", "<", ">", '"'], l = ["&amp;", "&lt;", "&gt;", "&quot;"], h = l.length, g = 0; g < h; g++)e = e.replace(RegExp(f[g], "g"), l[g]);
                return e
            } else return""
        },
        decodeSpecialHtmlChar : function (e) {
            if (e) {
                for (var f = ["&amp;", "&lt;", "&gt;", "&quot;", "&#quot", "&#rmrow", "&#lmrow"], l = ["&", "<", ">", '"', "'", "(", ")"], h = l.length, g = 0; g < h; g++)e = e.replace(RegExp(f[g], "g"), l[g]);
                return e
            } else return""
        },
        appendHtmlNode : function (e) {
            var f = document.createElement("DIV"), l = [];
            f.innerHTML = e.trim();
            $.dom.eachNode(f.childNodes, function () {
                l.push(this)
            });
            return l
        },
        scrollToTop : function () {
            APP.scrollTo(0)
        },
        focus : function (e) {
            var f = e.value.length;
            e.focus();
            APP.setCursorTo(e, f)
        },
        setCursorTo : function (e, f) {
            APP.selectText(e, f, f)
        },
        selectText : function (e, f, l) {
            document.createRange ? e.setSelectionRange(f, l) : (e = e.createTextRange(), e.collapse(1), e.moveStart("character", f), e.moveEnd("character", l - f), e.select())
        }, selectedText : function (e) {
            return document.selection ? (e = document.selection.createRange(), e.text ? e.text : "") : e.selectionStart < e.selectionEnd ? e.value.substring(e.selectionStart, e.selectionEnd) : ""
        }, replaceSelectedText : function (e, f) {
            if (document.selection) {
                var l = document.selection.createRange();
                if (l.text)l.text = f
            } else {
                var h = e.value;
                if (e.selectionStart < e.selectionEnd)l = h.substring(0, e.selectionStart), h = h.substring(e.selectionEnd), e.value = l + f + h
            }
        }, insertText : function (e, f, l) {
            if (document.selection)document.selection.createRange().text = f; else {
                var h = e.value, g = h.length;
                e.value = h.substring(0, l) + f + h.substring(l, g);
                f = (h.substring(0, l) + f).length;
                APP.setCursorTo(e, f)
            }
        }, getCursorSelection : function (e) {
            if (typeof e.selectionStart == "number")return{start : e.selectionStart, end : e.selectionEnd}; else {
                var f = end = 0;
                if (document.selection) {
                    var l = document.selection.createRange();
                    if (l.parentElement() == e) {
                        var h = document.body.createTextRange();
                        h.moveToElementText(e);
                        for (f = 0; h.compareEndPoints("StartToStart", l) < 0; f++)h.moveStart("character", 1);
                        for (h = 0; h <= f; h++)e.value.charAt(h) == "\n" && f++;
                        h = document.body.createTextRange();
                        h.moveToElementText(e);
                        for (end = 0; h.compareEndPoints("StartToEnd", l) < 0; end++)h.moveStart("character", 1);
                        for (h = 0; h <= end; h++)e.value.charAt(h) == "\n" && end++
                    }
                }
                return{start : f, end : end}
            }
        }, getSelectPos : function (e) {
            if (document.selection) {
                e.focus();
                var f = document.selection.createRange();
                e.select();
                var l = document.selection.createRange();
                try {
                    f.setEndPoint("StartToStart", l);
                    var h = f.text.length;
                    f.collapse(!1);
                    f.select();
                    return h
                } catch (g) {
                    return e.selectionStart
                }
            } else return e.selectionStart
        }, getAbsPosition : function (e) {
            var f = {};
            e.getBoundingClientRect ? (e = e.getBoundingClientRect(), f.y = e.top + APP.scrollY(), f.x = e.left + APP.scrollX()) : (f.y = e.offsetTop, f.x = e.offsetLeft);
            return f
        }, getElemSize : function (e) {
            return{width : e.width(), height : e.height()}
        }, toggleDefaultVal : function (e, f) {
            e = $(e);
            e.addEvent("focus", function () {
                if (this.value == f)e.value = ""
            }).addEvent("blur", function () {
                if (this.value == "")e.value = f
            })
        }, toggleLabel : function (e, f) {
            f.addEvent("focus", function () {
                $.style.getCurrentStyle(e, "display") !== "none" && e.addCss("display:none;")
            });
            f.addEvent("blur", function () {
                var l = $.style.getCurrentStyle(e, "display");
                this.value === "" && l === "none" && e.addCss("display:block;")
            })
        }, removeNode : function (e) {
            var f = e.parentNode;
            f && f.removeChild(e)
        }, getPreviousNode : function (e) {
            return e.previousSibling.nodeType == 1 ? e.previousSibling : e.previousSibling.previousSibling
        }, getNextNode : function (e) {
            return e.nextSibling.nodeType == 1 ? e.nextSibling : e.nextSibling.nextSibling
        }, insertBefore : function (e, f) {
            f.parentNode.insertBefore(e, f)
        }, insertAfter : function (e, f) {
            var l = f.parentNode;
            l.lastChild == f ? l.appendChild(e) : l.insertBefore(e, f.nextSibling)
        }, countCharacters : function (e, f, l) {
            var h = e.replace(/[\u4e00-\u9fa5\s]/g, "**").length, g = [];
            totalCount = 0;
            if (h <= f)return e; else {
                for (var k = 0; k < h; k++) {
                    var m = e.charAt(k);
                    totalCount += /[^\x00-\xff]/.test(m) ? 2 : 1;
                    g.push(m);
                    if (f <= totalCount)break
                }
                return l ? g.join("") : g.join("") + "..."
            }
        }, fireEvent : function (e, f) {
            if (e.fireEvent)e.fireEvent("on" + f); else {
                var l = document.createEvent("HTMLEvents");
                l.initEvent(f, !0, !0);
                e.dispatchEvent(l)
            }
        }, mousePosition : function (e) {
            return e.pageX || e.pageY ? {x : e.pageX, y : e.pageY} : {x : e.clientX + document.body.scrollLeft - document.body.clientLeft, y : e.clientY + document.body.scrollTop - document.body.clientTop}
        }, asyncInnerHTML : function (e, f) {
            var l = document.createElement("div"), h = document.createDocumentFragment();
            l.innerHTML = e;
            (function () {
                l.firstChild ? (h.appendChild(l.firstChild), setTimeout(arguments.callee, 0)) : f(h)
            })()
        }, isHasClassName : function (e, f) {
            try {
                return e.className.indexOf(f) !== -1 ? !0 : !1
            } catch (l) {
                return!1
            }
        }, clickToHide : function (e, f) {
            var l = $(document.body), h = function (g) {
                g = g.target ? g.target : event.srcElement;
                do {
                    if (g == f || g == e)break;
                    if (g.tagName.toUpperCase() == "BODY" || g.tagName.toUpperCase() == "HTML")e.style.display = "none", l.removeEvent("mousedown", h);
                    g = g.parentNode
                } while (g.parentNode)
            };
            l.addEvent("mousedown", h)
        },
        getIndex : function (e, f) {
            for (var l = f.length, h = 0; h < l; h++)if (e == f[h])break;
            return 0
        },
        enterSubmit : function (e) {
            var f = e.element, l;
            f && f.addEvent("keydown", function (l) {
                var h = e.action || null;
                l.keyCode == 13 && h && h(f)
            }.bind(f))
        },
        removeOpacity : function (e) {
            e.style.opacity = "";
            e.style.filter = ""
        },
        scrollTo : function (e, f) {
            for (var l = [], g = APP.scrollY() - e, k = f ? f * 30 : 30, f = f || 2; Math.abs(g) > 0;) {
                g /= 2;
                if (Math.abs(g) < 1) {
                    l.push(0);
                    break
                }
                l.push(g)
            }
            h && clearInterval(h);
            h = setInterval(function () {
                l.length ? window.scrollTo(0, e + l.shift()) : clearInterval(h)
            }, k)
        },
        hover : function (e, f, l) {
            var h, g;
            e.addEvent("mouseover", function () {
                var e = this;
                g && clearTimeout(g);
                h = setTimeout(function () {
                    f(e)
                }, 20)
            });
            e.addEvent("mouseout", function () {
                var e = this;
                h && clearTimeout(h);
                g = setTimeout(function () {
                    l(e)
                }, 20)
            })
        },
        cutString : function (e, f, l) {
            l *= 2;
            if (!e || !l)return"";
            for (var h = 0, g = 0, k = "", g = f; g < e.length; g++) {
                e.charCodeAt(g) > 255 ? h += 2 : h++;
                if (h > l)return k;
                k += e.charAt(g)
            }
            return e
        },
        format : function (e) {
            if (typeof e == "undefined")return"";
            if (typeof e != "object")throw Error("data sended to the server must be 'object'");
            var f = [], l;
            for (l in e)f.push(encodeURIComponent(l) + "=" + encodeURIComponent(e[l]));
            return f.join("&").replace(/%20/g, "+")
        },
        stripTime : function (e) {
            return e.replace(/\+0800|\S\S\S\+0800|CST/g, "")
        },
        addDate : function (e, f) {
            var l = new Date(e), h = l.getFullYear().toString(), g = l.getMonth().toString(), l = l.getDate().toString(), k = parseInt(f + 1);
            g.substr(0, 1) == 0 && (g = 0);
            l.substr(0, 1) == 0 && (l = l.substr(1, 1));
            var h = parseInt(h), g = parseInt(g), l = parseInt(l), m = g + k;
            h += parseInt(m / 12);
            m >= 12 ? m % 12 == 0 ? (h -= 1, g = 12) : g = parseInt(m % 12) : g += k;
            if (g == 2 && l >= 28)l = h % 4 == 0 && h % 100 != 0 ? 29 : 28; else if (l >= 30)switch (g) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    l = 31;
                    break;
                case 4:
                case 6:
                case 9:
                case 11:
                    l = 30
            }
            g < 10 && (g = "0" + g);
            l < 10 && (l = "0" + l);
            return{enddate : h + "-" + g + "-" + l, year : h,
                month : g, day : l}
        },
        mouseEnter : function () {
            return document.all ? function (e, f) {
                $(e).addEvent("mouseenter", function () {
                    f()
                })
            } : function (e, f) {
                $(e).addEvent("mouseover", function (e) {
                    for (var h = e.relatedTarget; h != this && h;)try {
                        h = h.parentNode
                    } catch (g) {
                        break
                    }
                    h != this && f(e)
                })
            }
        }(),
        mouseLeave : function () {
            return document.all ? function (e, f) {
                $(e).addEvent("mouseleave", function () {
                    f()
                })
            } : function (e, f) {
                $(e).addEvent("mouseout", function (e) {
                    for (var h = e.relatedTarget; h != this && h;)try {
                        h = h.parentNode
                    } catch (g) {
                        break
                    }
                    h != this && f(e)
                })
            }
        }(),
        ajaxSend : function (e) {
            var f = e.requestUrl, l = e.method || "GET", h = e.param || {};
            dataType = e.dataType || "text";
            $.ajax.send(f, l, h, {timeout : 6E3, onSuccess : function (f) {
                f = f.responseText;
                f !== "" && dataType === "json" && (f = eval("(" + f + ")"));
                e.success && e.success(f)
            }, onError : function (f) {
                e.error && e.error(f)
            }, onTimeout : function () {
                e.timeout && e.timeout()
            }})
        },
        crossDomainSend : function (e) {
            $.ajax.importJs(e.requestUrl, function () {
                e.success && e.success()
            }, e.charset)
        },
        crossDomainRequest : function (e) {
            var f = e.url;
            e.param && (f = e.url + "?" + APP.format(e.param));
            $.ajax.importJs(f, function () {
                e.callBack()
            }, "UTF-8")
        },
        bindEnterEvent : function (e, f) {
            e.addEvent("keydown", function (e) {
                e = e || window.event;
                e.keyCode == 13 && (e.preventDefault(), f())
            })
        },
        bubbleNode : function (e, f, l) {
            var h = !1;
            do if (f(e)) {
                h = !0;
                break
            } else e = e.parentNode; while (e.parentNode);
            h && l()
        },
        bubbleNodeNe : function (e, f, l) {
            var h = !0;
            do if (f(e)) {
                h = !1;
                break
            } else e = e.parentNode; while (e.parentNode);
            h && l()
        }};
    APP.merge(m);
    m = {
        shortUrlCache : {}, shortUrlTimer : null, followCache : {}, defollowCache : {},
        getLongUrl : function () {
            var e = this, f = e.innerHTML.replace("http://163.fm/", "");
            WB.shortUrlCache[f] ? e.title = WB.shortUrlCache[f] : (WB.shortUrlTimer && clearTimeout(WB.shortUrlTimer), WB.shortUrlTimer = setTimeout(function () {
                window.showLongUrl = function (l) {
                    if (l.match(/^\w{50,}/)) {
                        var h = e.innerHTML;
                        e.title = "";
                        e.href = "http://idj.163.com/";
                        e.innerHTML = h
                    } else e.title = l;
                    WB.shortUrlCache[f] = l
                };
                APP.crossDomainSend({requestUrl : "http://163.fm/getOriginal?q=" + f + "&callback=showLongUrl", charset : "UTF-8"})
            }, 500))
        },
        follow : function (e) {
            var f = {screenName : "no",
                node : document.body, func : function () {
                }, audit : {method : "follow", followfrom : "no"}, callbackFuc : function (e) {
                    if (e != "out of limit")f.node.parentNode.innerHTML = '<a class="remove-focusS" onclick="WB.destroy({screenName:\'' + f.screenName + "',node:this,audit:{method:'defollow',defollowfrom:'" + f.audit.followfrom + '\'}}); return false;" href="javascript:;"><em class="remove-signS"></em>\u53d6\u6d88</a>'
                }}, l;
            for (l in e)f[l] = e[l];
            if (WB.User.checkUserIsLogin(f.audit))return!1;
            WB.followCache[f.screenName] || (e = {requestUrl : $.util.simpleParse("/friendships/create/<#=screen_name#>.json", {screen_name : f.screenName}), type : "addfocus", param : f.audit, callbackFuc : function (e) {
                f.callbackFuc(e);
                f.func();
                WB.defollowCache[f.screenName] = !1
            }, error : function () {
                WB.followCache[f.screenName] = !1
            }}, WB.followCache[f.screenName] = !0, WB.focusAjaxSend(e))
        },
        destroy : function (e) {
            var f = {screenName : "no", func : function () {
            }, audit : {method : "defollow", defollowfrom : "no"}, callbackFuc : function (e) {
                if (e != "out of limit")f.node.parentNode.innerHTML = '<a class="add-focusS" onclick="WB.follow({screenName:\'' + f.screenName + "',node:this,audit:{method:'follow',followfrom:'" + f.audit.defollowfrom + '\'}}); return false;" href="javascript:;"><em class="add-signS">+</em>\u5173\u6ce8</a>'
            }}, l;
            for (l in e)f[l] = e[l];
            WB.defollowCache[f.screenName] || (e = {requestUrl : $.util.simpleParse("/friendships/destroy/<#=screen_name#>.json", {screen_name : f.screenName}), type : "addfocus", param : f.audit, callbackFuc : function (e) {
                f.callbackFuc(e);
                f.func();
                WB.followCache[f.screenName] = !1
            }, error : function () {
                WB.defollowCache[f.screenName] = !1
            }}, WB.defollowCache[f.screenName] = !0, WB.focusAjaxSend(e))
        },
        focusAjaxSend : function (e) {
            $.ajax.send(e.requestUrl, "POST", e.param, {timeout : 6E3, onSuccess : function (f) {
                try {
                    var l = eval("(" + f.responseText + ")");
                    e.callbackFuc(l)
                } catch (h) {
                    e.error()
                }
            }, onError : function () {
                e.error()
            }, onTimeout : function () {
                e.error()
            }})
        },
        oimage : function () {
            var e = {}, f = ["timge1", "timge2", "timge3", "timge4", "timge5", "timge6", "timge7", "timge8", "timge9"];
            return function (l) {
                var h = {url : "", gif : 1}, g;
                for (g in l)h[g] = l[g];
                if (h.url.indexOf("timge") != -1)return h.url;
                if (h.url.indexOf("ydstatic") != -1)return h.url;
                l = h.gif + h.width + "|" + h.height + h.url;
                e[l] || (g = h.url.substr(h.url.length - 1, 1).charCodeAt() % 9, e[l] = "http://" + f[g] + ".126.net/image?" + (typeof h.width === "number" ? "w=" + h.width : "") + (typeof h.height === "number" ? "&h=" + h.height : "") + "&url=" + h.url + "&gif=" + h.gif + "&quality=85");
                return e[l]
            }
        }(),
        getLinkParam : function (e) {
            return e.getAttribute("href").replace("javascript://", "")
        },
        audit : function (e) {
            var f = {}, l;
            for (l in e)f[l] = e[l];
            e = {requestUrl : "http://t.163.com/service/page.do?" + APP.format(f)};
            APP.crossDomainSend(e)
        },
        slide : function (e) {
            var f = $(e), e = f.scrollHeight - 36;
            f.addCss({height : "0px",
                overflow : "hidden"});
            var l = {height : parseFloat(e) + "px"};
            setTimeout(function () {
                f.animate(l, 0.3, "linear", function () {
                    f.addCss({height : "", overflow : ""})
                })
            }, 0)
        },
        goTop : function () {
            var e = $(".js-gotop").$(0), f = $(APP.appendHtmlNode('<div class="toTop"><a hidefocus="true" href="javascript:;"><em>&lt;</em>\u8fd4\u56de\u9876\u90e8</a></div>')[0]);
            f.addCss("marginLeft:" + APP.getElemSize(e).width / 2 + "px");
            f.addCss("bottom:83px");
            document.body.appendChild(f);
            f.addEvent("click", function () {
                APP.scrollToTop()
            });
            var l = f.height() + 83, h = $.browser.msie && $.browser.version < 7 ? !0 : !1, g = null, e = function () {
                APP.scrollY() > 100 ? (f.addCss("display:block"), h && (g && clearTimeout(g), g = setTimeout(function () {
                    f.addCss("top:" + (APP.windowHeight() - l + APP.scrollY()) + "px")
                }, 80))) : f.addCss("display:none")
            };
            e();
            $(window).addEvent("scroll", e)
        },
        toTop : function () {
            var e = $(".js-totop").$(0), f = $(APP.appendHtmlNode('<a hidefocus="true" href="javascript:;" class="toTopIcon"><em></em></a>')[0]);
            f.addCss("marginLeft:" + (APP.getElemSize(e).width / 2 + 128) + "px");
            f.addCss("bottom:83px");
            document.body.appendChild(f);
            f.addEvent("click", function () {
                APP.scrollToTop()
            });
            var l = f.height() + 83, h = $.browser.msie && $.browser.version < 7 ? !0 : !1, g = null, k = function () {
                APP.scrollY() > 100 ? (f.addCss("display:block"), h && (g && clearTimeout(g), g = setTimeout(function () {
                    f.addCss("marginLeft:" + (APP.getElemSize(e).width / 2 + 80) + "px");
                    f.addCss("top:" + (APP.windowHeight() - l + APP.scrollY()) + "px")
                }, 80))) : f.addCss("display:none")
            };
            k();
            $(window).addEvent("scroll", k)
        },
        itagTimer : null,
        showiTip : function (e) {
            if (!$("#itag_tip")) {
                var f = APP.appendHtmlNode('<div id="itag_tip" class="itag-tip" onmouseover="WB.holdiTip();" onmouseout="WB.hideiTip();"></div>')[0];
                document.body.appendChild(f)
            }
            f = $("#itag_tip");
            clearTimeout(WB.itagTimer);
            var l = APP.getAbsPosition($("#itag_icon_" + e)), e = $("#itag_icon_" + e).$("span")[0].innerHTML.split(",");
            f.style.visibility = "visible";
            f.style.top = l.y - 28 + "px";
            f.style.left = l.x - 20 + "px";
            l = "<em>";
            for (i = 0; i < e.length; i++)l += "<a href='/search/itag/" + e[i].trim() + "' target='_blank'>" + e[i].trim() + "</a>";
            l += "</em>";
            f.innerHTML = l
        }, hideiTip : function () {
            var e = $("#itag_tip");
            if (e)WB.itagTimer = setTimeout(function () {
                e.style.visibility = "hidden"
            }, 200)
        }, holdiTip : function () {
            clearTimeout(WB.itagTimer)
        }, log : function (e) {
            this.audit(e)
        }, parseMusic : function (e) {
            for (var f = [], l = 0; l < e.length; l++)f.push({photoUrl : e[l].photoUrl, songName : e[l].songName, songUrl : e[l].songUrl, playKey : e[l].playKey, albumName : e[l].albumName, singer : e[l].singer});
            return f
        }, parseStatusObj : function (e, f) {
            var l = null, h = null, f = f || 48;
            if (e.root && e.root.user) {
                h = e.root;
                l = {id : h.id,
                    name : h.user.name, screen_name : h.user.screen_name, isFollowing : h.user.following, realname : h.user.realName, itag : h.user.sysTag, activity : h.user.activity, isColumnUser : h.user.columnUser, text : h.richText, content : h.text, source : h.source, createTime : h.created_at, retweetCount : h.retweetCount, replyCount : h.replyCount, media : h.media ? !0 : !1, pic : null, video : null, linkInfos : null, voteInfo : null, music : null};
                if (l.media)h.media.pic && (l.pic = {url : h.media.pic, src : WB.oimage({width : 120, height : 120, url : h.media.pic})}), h.media.musicInfos && h.media.musicInfos.length > 0 && (l.music = WB.parseMusic(h.media.musicInfos)), h.media.video && (l.video = {pic : WB.oimage({width : 120, height : 120, url : h.media.video.pic}), title : h.media.video.title, src : h.media.video.src, url : h.media.video.url}), h.media.linkInfos && h.media.linkInfos.length > 0 && (l.linkInfos = h.media.linkInfos), h.media.voteInfo && (l.voteInfo = {originalUrl : h.media.voteInfo.originalUrl, shortUrl : h.media.voteInfo.shortUrl, smallCoverurl : h.media.voteInfo.smallCoverurl, title : h.media.voteInfo.title, options : h.media.voteInfo.options});
                !l.pic && !l.video && !l.linkInfos && !l.voteInfo && !l.music && (l.media = null)
            }
            h = {id : e.id, name : e.user.name, screen_name : e.user.screen_name, isFollowing : e.user.following, realname : e.user.realName, profile_image : WB.oimage({width : f, height : f, url : e.user.sourcePic || e.user.pic}), itag : e.user.sysTag, activity : e.user.activity, isColumnUser : e.user.columnUser, text : e.richText, content : e.text, source : e.source, createTime : e.created_at, createTimeMs : e.createTime ? e.createTime : "", fav : e.favorited, retweetCount : e.retweetCount, replyCount : e.replyCount,
                media : e.media ? !0 : !1, isSelf : e.user.screen_name == WB.User.screenName ? !0 : !1, position : e.position, root : l, pic : null, video : null, linkInfos : null, voteInfo : null, music : null};
            if (h.media)e.media.pic && (h.pic = {url : e.media.pic, src : WB.oimage({width : 120, height : 120, url : e.media.pic})}), e.media.musicInfos && e.media.musicInfos.length > 0 && (h.music = WB.parseMusic(e.media.musicInfos)), e.media.video && (h.video = {pic : WB.oimage({width : 120, height : 120, url : e.media.video.pic}), title : e.media.video.title, src : e.media.video.src, url : e.media.video.url}), e.media.linkInfos && e.media.linkInfos.length > 0 && (h.linkInfos = e.media.linkInfos), e.media.voteInfo && (h.voteInfo = {originalUrl : e.media.voteInfo.originalUrl, shortUrl : e.media.voteInfo.shortUrl, smallCoverurl : e.media.voteInfo.smallCoverurl, title : e.media.voteInfo.title, options : e.media.voteInfo.options});
            !h.pic && !h.video && !h.linkInfos && !h.voteInfo && !h.music && (h.media = null);
            return h
        }};
    WB.merge(m);
    WB.widget.sendBox.BasicSendBox = g.extend({init : function (e, f, h) {
        this.$wrapperElem = e;
        this.$textAreaElem = e.$(".js-textarea").$(0);
        this.$sendBtnElem = e.$(".js-sendBtn").$(0);
        this.$sendInfoTipElem = e.$(".js-sendInfo").$(0);
        this._initTip = f || "";
        this.textAreaObj = new WB.widget.sendBox.TextArea(this.$textAreaElem, this._autoHeight, this._maxHeight);
        h && (this.atList = new WB.widget.sendBox.At(this.$textAreaElem))
    }, _isMoreLimit : !1, _isRequest : !1, _countTipsTimer : null, _flag : 0, _urlReg : /(http)s?:\/\/(?:[\w-]+\.?)+[\.\/\?%&=#@$(),;\[\]\-+_!:*~\w-]+/g, _imageUrl : "", uploadPicObj : null, screenName : "screenName", _maxLen : 326, _maxUrlLen : 256, _urlInclude : 302,
        infotemp : '<#=note#><span class="char-constantia" style="color:<#=color#>"><#=countnum#></span> \u5b57', keywordRe : /([#\uff03])([^#\uff03\s]+)([#\uff03]?)/g, render : function () {
            this.renderHandler();
            return this
        }, clear : function () {
            this.$textAreaElem.value = this._initTip;
            APP.focus(this.$textAreaElem);
            this.countTips();
            this.uploadPicObj && this.uploadPicObj.hideUploadStat();
            this._imageUrl = ""
        }, toggleFocus : function () {
            APP.focus(this.$textAreaElem)
        }, renderHandler : function () {
            this.$textAreaElem.value = this._initTip;
            this.toggleFocus();
            this.textAreaObj.triggerEvent();
            this.initTextAreaHandle();
            this.$sendBtnElem.addEvent("click", this.sendInfo.bind(this));
            this.countTips()
        }, gotoTextPos : function (e, f) {
            if (f) {
                var h = f.length, g = e.value.search(RegExp(f, "g"));
                if (g == -1) {
                    var g = APP.getSelectPos(e), k = e.value;
                    e.value = k.substring(0, g) + f + k.substring(g, k.length)
                }
                APP.setCursorTo(e, g + h)
            } else APP.setCursorTo(e, e.value.length);
            this.countTips()
        }, initTextAreaHandle : function () {
            var e = this, f = function () {
                clearTimeout(e._countTipsTimer);
                e._countTipsTimer = setTimeout(function () {
                    e._flag || e.countTips()
                }, 60)
            };
            e.$textAreaElem.addEvent("keyup", f);
            e.$textAreaElem.addEvent("focus", function () {
                e._flag = 0;
                f()
            });
            e.$textAreaElem.addEvent("paste", f);
            e.$textAreaElem.addEvent("cut", f);
            e.$textAreaElem.addEvent("delete", f);
            e.$textAreaElem.addEvent("keypress", f);
            e.$textAreaElem.addEvent("keydown", function (h) {
                h = h || window.event;
                e._flag = 0;
                h.ctrlKey && h.keyCode == 13 && (h.preventDefault(), f(), e.sendInfo())
            })
        }, countTips : function () {
            var e = this, f = e.$textAreaElem.value.trim();
            f.match(/^\s+$/) ? f = "" : (f = f.replace(e._urlReg, function (f) {
                if (f.length > e._maxUrlLen)return f.substr(e._maxUrlLen - 22, f.length);
                return!f.match(/:\d+/g) ? "**********************" : f
            }), f = f.replace(/[\uFE30-\uFFA0\u2E80-\u9FFF\u3000\uac00-\ud7ff\u2018\u201c\u201d\u2019]/g, "**"));
            var f = Math.floor((e._maxLen - f.length) / 2), h = f < 0 ? {note : "\u5df2\u8d85\u51fa", color : "#BA2636", countnum : Math.abs(f)} : {note : "\u8fd8\u53ef\u4ee5\u8f93", color : "#898989", countnum : Math.abs(f)};
            e._isMoreLimit = f < 0 ? !0 : !1;
            e.showTip($.util.simpleParse(e.infotemp, h))
        }, checkTag : function (e) {
            var f = e.match(this.keywordRe);
            if (f) {
                var h = f.length;
                if (h == 1 && f[0] == e)return this.showTip('<em class="cDRed">\u518d\u8bf4\u70b9\u5185\u5bb9\u5427</em>'), !1; else if (h == 2 && e.trimAll() == f[0] + f[1])return this.showTip('<em class="cDRed">\u518d\u8bf4\u70b9\u5185\u5bb9\u5427</em>'), !1;
                if (h > 2)return this.showTip('<em class="cDRed">\u6700\u591a\u5305\u62ec2\u4e2a#\u8bdd\u9898</em>'), !1
            }
            return!0
        }, sendInfo : function () {
        }, checkAction : function () {
            var e = this.$textAreaElem.value.trim();
            this.countTips();
            if ("" === e)return this.textError('<em class="cDRed">\u518d\u8bf4\u70b9\u4ec0\u4e48\u5427</em>'), !1;
            if (this._isMoreLimit)return this.textError(), !1;
            if (!this.checkTag(e))return!1;
            return!0
        }, sendAction : function (e) {
            var f = this;
            if (!f._isRequest) {
                f._isRequest = !0;
                if (f._actionTitle) {
                    var h = f.$sendBtnElem.innerHTML;
                    f.$sendBtnElem.attr("innerHTML", f._actionTitle + "\u4e2d...");
                    f.$sendBtnElem.addCss("sending");
                    var g = function () {
                        f.$sendBtnElem.removeCss("sending");
                        f.$sendBtnElem.attr("innerHTML", h)
                    }
                }
                APP.ajaxSend({requestUrl : e.requestUrl,
                    method : "POST", dataType : "json", param : e.param, success : function (h) {
                        f._actionTitle && g();
                        f._isRequest = !1;
                        e.callBack && e.callBack(h)
                    }, error : function (e) {
                        f._actionTitle && g();
                        f._isRequest = !1;
                        e.status == 405 && f.textError('<em class="cDRed">\u5fae\u535a\u4e0d\u5b9c\u8fc7\u4e8e\u9891\u7e41\u54e6 :)</em>');
                        e.status == 406 && f.textError('<em class="cDRed">\u76f8\u4f3c\u5185\u5bb9\u8fc7\u591a\u54e6 :)</em>');
                        e.status == 400 && f.textError('<em class="cDRed">\u5185\u5bb9\u8d85\u957f\u5566\uff0c\u8fd9\u53ef\u662f\u5fae\u535a\u54e6 :)</em>');
                        e.status == 407 && f.textError('<em class="cDRed">\u8be5\u7528\u6237\u5df2\u5c06\u4f60\u52a0\u5165\u9ed1\u540d\u5355,\u65e0\u6cd5\u5bf9\u5176\u53d1\u9001\u4fe1\u606f</em>')
                    }, timeout : function () {
                        f._actionTitle && g();
                        f._isRequest = !1
                    }})
            }
        }, successAction : function () {
            this.$textAreaElem.value = "";
            this.$textAreaElem.focus();
            this.countTips()
        }, textError : function (e) {
            for (var f = this, h = 0; h < 3; h++)setTimeout(function () {
                f.$textAreaElem.style.backgroundColor = "#FEE9E9"
            }, h * 300 + 1), setTimeout(function () {
                f.$textAreaElem.style.backgroundColor = "#FFF"
            }, h * 300 + 151);
            if (e)f._flag = 1, f.showTip(e)
        }, showTip : function (e) {
            this.$sendInfoTipElem.attr("innerHTML", e)
        }})
})();
WB.BatchAllFollow = function (e) {
    var f = this;
    f.options = {wraper : document.body, callbackFuc : function () {
    }, isLink : !1, audit : {method : "click", keyfrom : "no"}};
    for (var k in e)f.options[k] = e[k];
    f.wrapperElem = $(f.options.wraper);
    f.fousBtnElem = f.wrapperElem.$(".js-addfocus").$(0);
    f.icons = f.wrapperElem.$(".js-icon");
    f.fousBtnElem.addEvent("click", function () {
        f.focusAllBatch();
        return!1
    })
};
WB.BatchAllFollow.prototype = {focusAllBatch : function () {
    if (WB.User.checkUserIsLogin())return!1;
    var e = this, f = "", k = [];
    e.icons.each(function (e, f) {
        k.push(f.getAttribute("value"))
    });
    f = k.join(",");
    f = {requestUrl : "/user/batchAddFocus", method : "post", param : {screenNames : f, keyfrom : e.options.audit.keyfrom, method : e.options.audit.method}, dataType : "json", success : function (f) {
        e.successAction(f)
    }};
    k.length > 0 ? APP.ajaxSend(f) : alert("\u8bf7\u9009\u62e9\u8981\u5173\u6ce8\u7684\u4eba\uff01")
}, successAction : function (e) {
    typeof e.batchAddFocusStatus != "undefined" ? parseInt(e.batchAddFocusStatus) == 0 ? this.fousBtnElem.attr("innerHTML", "\u5173\u6ce8\u6210\u529f") : this.fousBtnElem.attr("innerHTML", "\u5173\u6ce8\u5931\u8d25") : this.fousBtnElem.attr("innerHTML", "\u5173\u6ce8\u5931\u8d25");
    this.options.callbackFuc()
}};
WB.BatchFollow = function (e) {
    var f = this;
    f.options = {wraper : document.body, callbackFuc : function () {
    }, isLink : !1, audit : {method : "click", keyfrom : "no"}};
    for (var k in e)f.options[k] = e[k];
    f.wrapperElem = $(f.options.wraper);
    f.singleInputElem = f.wrapperElem.$(".js-check");
    f.allInputElem = f.wrapperElem.$(".js-checkAll").$(0);
    f.fousBtnElem = f.wrapperElem.$(".js-addfocus").$(0);
    f.icons = f.wrapperElem.$(".js-icon");
    f.define();
    f.icons.each(function (e, h) {
        $(h).addEvent("click", function (e) {
            f.doCheck(h, elem = e.target || e.srcElement);
            f.checkState()
        })
    });
    f.allInputElem.addEvent("click", function () {
        f.checkAll(this)
    });
    f.fousBtnElem.addEvent("click", function () {
        f.focusBatch();
        return!1
    })
};
WB.BatchFollow.prototype = {doCheck : function (e, f, k) {
    switch (f.tagName.toLowerCase()) {
        case "img":
            e = $(e).$("input").$(0);
            k ? e.checked = k : e.checked = !e.checked;
            e.checked ? $(f).addCss("border: 1px solid #C6F1AD") : $(f).addCss("border: 1px solid #ccc");
            break;
        case "input":
            e = $(e).$("img").$(0), f.checked ? e.addCss("border: 1px solid #C6F1AD") : e.addCss("border: 1px solid #ccc")
    }
}, define : function () {
    var e = this;
    if (e.options.isLink)e.doCheck = function (e, k, g) {
        switch (k.tagName.toLowerCase()) {
            case "input":
                if (typeof g != "undefined")k.checked = g;
                e = $(e).$("img").$(0);
                k.checked ? e.addCss("border: 1px solid #C6F1AD") : e.addCss("border: 1px solid #ccc")
        }
    }, e.checkAll = function (f) {
        e.icons.each(function (k, g) {
            e.doCheck(g, $(g).$("input")[0], f.checked)
        });
        e.fousBtnElem.attr("innerHTML", "<em>\u5173\u6ce8\u6240\u9009</em>")
    }
}, checkState : function () {
    var e = !0;
    this.singleInputElem.each(function (f, k) {
        !k.checked && (e = !1)
    });
    this.allInputElem.checked = e;
    this.fousBtnElem.attr("innerHTML", "<em>\u5173\u6ce8\u6240\u9009</em>")
}, checkAll : function (e) {
    var f = this;
    f.icons.each(function (k, g) {
        f.doCheck(g, $(g).$("img")[0], e.checked)
    });
    f.fousBtnElem.attr("innerHTML", "<em>\u5173\u6ce8\u6240\u9009</em>")
}, focusBatch : function () {
    if (WB.User.checkUserIsLogin())return!1;
    var e = this, f = "", k = [];
    e.singleInputElem.each(function (e, f) {
        f.checked && f.value != "" && k.push(f.value)
    });
    f = k.join(",");
    f = {requestUrl : "/user/batchAddFocus", method : "post", param : {screenNames : f, keyfrom : e.options.audit.keyfrom, method : e.options.audit.method}, dataType : "json", success : function (f) {
        e.successAction(f)
    }};
    k.length > 0 ? APP.ajaxSend(f) : alert("\u8bf7\u9009\u62e9\u8981\u5173\u6ce8\u7684\u4eba\uff01")
}, successAction : function (e) {
    typeof e.batchAddFocusStatus != "undefined" ? parseInt(e.batchAddFocusStatus) == 0 ? this.fousBtnElem.attr("innerHTML", "<em>\u5173\u6ce8\u6210\u529f</em>") : this.fousBtnElem.attr("innerHTML", "<em>\u5173\u6ce8\u5931\u8d25</em>") : this.fousBtnElem.attr("innerHTML", "<em>\u5173\u6ce8\u5931\u8d25</em>");
    this.options.callbackFuc()
}};
WB.DatePicker = function (e) {
    var f = this;
    f.opts = {input : document.body, format : "yyyy-MM-dd", showTime : !1};
    for (var k in e)f.opts[k] = e[k];
    f.$input = $(f.opts.input);
    f._showing = !1;
    f._locked = !1;
    f._activeTime = 0;
    f.time = [
        {size : 24, set : function (e, f) {
            e.setHours(f)
        }, get : function (e) {
            return e.getHours()
        }},
        {size : 60, set : function (e, f) {
            e.setMinutes(f)
        }, get : function (e) {
            return e.getMinutes()
        }},
        {size : 60, set : function (e, f) {
            e.setSeconds(f)
        }, get : function (e) {
            return e.getSeconds()
        }}
    ];
    f.value = new Date;
    f.$box = $("#dp-box");
    !f.$box && f.initBox();
    f.$date = $("#dp-date");
    f.$dateTitle = $("#dp-date-title");
    f.$prevMonth = $("#dp-month-prev");
    f.$nextMonth = $("#dp-month-next");
    f.$prevTime = $("#dp-time-prev");
    f.$nextTime = $("#dp-time-next");
    f.time[0].$handle = $("#dp-hour");
    f.time[1].$handle = $("#dp-minute");
    f.time[2].$handle = $("#dp-second");
    f._lock = function () {
        f._locked = !0
    };
    f._unlock = function () {
        f._locked = !1;
        f.$input.focus()
    };
    f._prevMonth = function (e) {
        e.preventDefault();
        f._changeMonth(-1)
    };
    f._nextMonth = function (e) {
        e.preventDefault();
        f._changeMonth(1)
    };
    f._changeTimeActive = function (e, h) {
        e.preventDefault();
        f.time[f._activeTime].$handle.removeCss("dp-state-active");
        f._activeTime = h;
        f.time[f._activeTime].$handle.addCss("dp-state-active");
        f._updateTime()
    };
    f._prevTime = f._changeTime.bind(f, -1);
    f._nextTime = f._changeTime.bind(f, 1);
    f._changedTime = function () {
        if (f._timer) {
            var e = f.time[f._activeTime];
            clearTimeout(f._timer);
            f._timer = void 0;
            e.set(f.value, e.$handle.attr("innerHTML"));
            f.setInputValue();
            f._updateDate()
        }
    };
    f.$input.addEvent("click", function () {
        !f._showing && f.show();
        f.$input.focus()
    }).addEvent("blur", function () {
        !f._locked && f.hide()
    }).addEvent("keyup", function () {
        f._setValue(f.$input.value);
        f._build()
    })
};
WB.DatePicker.prototype = {initBox : function () {
    var e = '<div class="dp-time" style="display:none">';
    this.opts.showTime == !0 && (e = '<div class="dp-time">');
    this.$box = $(document.createElement("div")).addCss("dp-box").addCss({display : "none"}).attr("id", "dp-box").attr("innerHTML", '<div class="dp-date"><div class="dp-date-ctrl"><a href="#prev" target="_self" class="dp-date-prev" id="dp-month-prev">&lt;&lt;</a><a href="#next" target="_self" class="dp-date-next" id="dp-month-next">&gt;&gt;</a><span class="dp-date-title" id="dp-date-title"></span></div><div class="dp-date-display" id="dp-date"></div></div>' + e + '<div class="dp-time-ctrl"><a href="#next" target="_self" class="dp-time-next" id="dp-time-next">+</a><a href="#prev" target="_self" class="dp-time-prev" id="dp-time-prev">-</a></div><div class="dp-time-display"><a href="#time" target="_self" id="dp-hour"></a><span class="dp-time-break">:</span><a href="#time" target="_self" id="dp-minute"></a><span class="dp-time-break">:</span><a href="#time" target="_self" id="dp-second"></a></div></div>');
    $("body").$(0).appendChild(this.$box);
    $("#dp-hour, #dp-minute, #dp-second").addEvent("mouseover", function () {
        $(this).addCss("dp-state-hover")
    }).addEvent("mouseout", function () {
        $(this).removeCss("dp-state-hover")
    });
    $("#dp-month-prev").addEvent("mouseover", function () {
        $(this).addCss("dp-date-prev-hover")
    }).addEvent("mouseout", function () {
        $(this).removeCss("dp-date-prev-hover")
    });
    $("#dp-month-next").addEvent("mouseover", function () {
        $(this).addCss("dp-date-next-hover")
    }).addEvent("mouseout", function () {
        $(this).removeCss("dp-date-next-hover")
    });
    $("#dp-time-prev").addEvent("mouseover", function () {
        $(this).addCss("dp-time-prev-hover")
    }).addEvent("mouseout", function () {
        $(this).removeCss("dp-time-prev-hover")
    }).addEvent("click", function (e) {
        e.preventDefault()
    });
    $("#dp-time-next").addEvent("mouseover", function () {
        $(this).addCss("dp-time-next-hover")
    }).addEvent("mouseout", function () {
        $(this).removeCss("dp-time-next-hover")
    }).addEvent("click", function (e) {
        e.preventDefault()
    })
}, show : function () {
    var e = this.time.length;
    this.$box.addCss({display : "block"}).addCss(this._getPos(this.$input, [0, this.$input.offsetHeight + 2]));
    this.time[this._activeTime].$handle.addCss("dp-state-active");
    !this._isInRange(this.value) && (this.start && (this.value = new Date(this.start)) || this.end && (this.value = new Date(this.end)));
    this._build();
    this.$box.addEvent("mousedown", this._lock).addEvent("click", this._unlock);
    this.$prevMonth.addEvent("click", this._prevMonth);
    for (this.$nextMonth.addEvent("click", this._nextMonth); --e >= 0;)this.time[e].$handle.addEvent("click", this._changeTimeActive, e);
    this.$prevTime.addEvent("mousedown", this._prevTime).addEvent("mouseout, mouseup", this._changedTime);
    this.$nextTime.addEvent("mousedown", this._nextTime).addEvent("mouseout, mouseup", this._changedTime);
    this._showing = !0
}, hide : function () {
    var e = this.time.length;
    this.$box.addCss({display : "none"});
    this.time[this._activeTime].$handle.removeCss("dp-state-active");
    this.$box.removeEvent("mousedown", this._lock).removeEvent("click", this._unlock);
    this.$prevMonth.removeEvent("click", this._prevMonth);
    for (this.$nextMonth.removeEvent("click", this._nextMonth); --e >= 0;)this.time[e].$handle.removeEvent("click", this._changeTimeActive, e);
    this.$prevTime.removeEvent("mousedown", this._prevTime).removeEvent("mouseout, mouseup", this._changedTime);
    this.$nextTime.removeEvent("mousedown", this._nextTime).removeEvent("mouseout, mouseup", this._changedTime);
    this._showing = !1
}, _build : function () {
    this._cal = {year : this.value.getFullYear(), month : this.value.getMonth() + 1};
    this._buildDate();
    this._buildTime()
}, _buildDate : function () {
    var e = new $.ui.Calendar(this._cal.year, this._cal.month);
    this.$dateTitle.attr("innerHTML", String.format("%1\u5e74%2\u6708", this._cal.year, this._cal.month));
    this._calendar = e.build().weeks;
    this._updateDate()
}, _buildTime : function () {
    for (var e = this.time.length; --e >= 0;)this._setTimeValue(this.time[e], this.time[e].get(this.value));
    this._updateTime()
}, _updateDate : function () {
    var e = this;
    if (e.start || e.end)for (var f = e._calendar.length, k, g = new Date(e.value), h; --f >= 0;)for (k = 7; --k >= 0;)if (h = e._calendar[f][k], h.value)g.setFullYear(e._cal.year, e._cal.month - 1, h.value), h.disabled = e._isInRange(g) ? !1 : !0;
    for (var g = '<table width="100%" cellspacing="2" cellpadding="0" border="0"><thead><tr><th>\u65e5</th><th>\u4e00</th><th>\u4e8c</th><th>\u4e09</th><th>\u56db</th><th>\u4e94</th><th>\u516d</th></tr></thead><tbody>', f = 0, m = e._calendar.length; f < m; f++) {
        g += "<tr>";
        for (k = 0; k < 7; k++)h = e._calendar[f][k], g += !h.value ? "<td></td>" : h.disabled ? '<td class="dp-state-disabled"><span>' + h.value + "</span></td>" : '<td><a target="_self" href="#date">' + h.value + "</a></td>";
        g += "</tr>"
    }
    g += "</tbody></table>";
    e.$date.attr("innerHTML", g).$("a").each(function () {
        var f = $(this);
        if (e._cal.year == e.value.getFullYear() && e._cal.month == e.value.getMonth() + 1 && f.attr("innerHTML") == e.value.getDate())e._$activeDate = f, e._$activeDate.addCss("dp-state-active");
        f.addEvent("mouseover", function () {
            f.addCss("dp-state-hover")
        }).addEvent("mouseout", function () {
            f.removeCss("dp-state-hover")
        }).addEvent("click", function (h) {
            h.preventDefault();
            e._$activeDate && e._$activeDate.removeCss("dp-state-active");
            e._$activeDate = f;
            e._$activeDate.addCss("dp-state-active");
            e.value.setFullYear(e._cal.year, e._cal.month - 1, f.attr("innerHTML"));
            e.setInputValue();
            e.hide();
            e._updateTime()
        })
    })
}, _updateTime : function () {
    var e = this.time[this._activeTime], f = e.size;
    e.start = 0;
    e.end = f - 1;
    if (this.start || this.end)for (var k = new Date(this.value), g; --f >= 0;)e.set(k, f), g = k.getTime(), this.start && this.start.getTime() > g && e.start < f + 1 && (e.start = f + 1), this.end && this.end.getTime() < g && e.end > f - 1 && (e.end = f - 1);
    this._checkTimeCtrl(e, e.get(this.value))
}, _changeMonth : function (e) {
    e > 12 ? (this._cal.year++, this._changeMonth(e - 12)) : e < -12 ? (this._cal.year--, this._changeMonth(e + 12)) : (this._cal.month += e, this._cal.month < 1 ? (this._cal.month += 12, this._cal.year--) : this._cal.month > 12 && (this._cal.month -= 12, this._cal.year++), this._buildDate())
},
    _changeTime : function (e) {
        var f = this, k = f.time[f._activeTime], g = k.get(f.value);
        f._timer = setInterval(function () {
            g = Math.max(k.start, Math.min(g + e, k.end));
            f._setTimeValue(k, g)
        }, 78)
    }, _checkTimeCtrl : function (e, f) {
        e.start == f ? this.$prevTime.addCss("dp-time-prev-disabled") : this.$prevTime.removeCss("dp-time-prev-disabled");
        e.end == f ? this.$nextTime.addCss("dp-time-next-disabled") : this.$nextTime.removeCss("dp-time-next-disabled")
    }, _setValue : function (e) {
        e = new Date(e);
        !isNaN(e.getTime()) && this._isInRange(e) && (this.value = e)
    }, _setTimeValue : function (e, f) {
        e.$handle.attr("innerHTML", ("0" + f).slice(-2));
        this._checkTimeCtrl(e, f)
    }, setInputValue : function (e) {
        e && e.constructor == Date && this._setValue(e);
        this.$input.value = this.value.format(this.opts.format);
        this.onChange && this.onChange()
    }, _isInRange : function (e) {
        e = e.getTime();
        if (this.start && this.start.getTime() > e || this.end && this.end.getTime() < e)return!1;
        return!0
    }, _getPos : function (e, f) {
        for (var k = e.offsetLeft, g = e.offsetTop; (e = e.offsetParent) != null;)k += e.offsetLeft, g += e.offsetTop;
        return{left : k + f[0] + "px", top : g + f[1] + "px"}
    }};
(function (e) {
    function f() {
        var e = document.getElementById("passportusernamelist"), f = g.getXY(this.usernameInputElement).x, k = g.getXY(this.usernameInputElement).y;
        e.style.left = f + "px";
        e.style.top = k + this.usernameInputElement.offsetHeight + "px"
    }

    function k(e, f, g) {
        if (arguments.length) {
            this.constructor = arguments.callee;
            this.noscroll = !0;
            if (g)this.noscroll = !1;
            this.usernameListElement = this.usernameInputHeight = this.usernameInputElementY = this.usernameInputElementX = this.usernameInputElement = !1;
            this._initWidth = 0;
            this._runFuc = f;
            this.currentSelectIndex = -1;
            this.domainSelectElmentString = '<div style="padding:0px; margin-top:-3px;"><table width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td class="title" style="title" >\u8bf7\u9009\u62e9\u6216\u7ee7\u7eed\u8f93\u5165...</td></tr><tr><td><td /></tr></tbody></table></div><div style="display: none;"></div><div id="passport_111"></div>';
            this.domainSelectElement = !1;
            this.domainArray = ["163.com", "126.com", "yeah.net", "qq.com", "vip.163.com", "vip.126.com", "188.com", "gmail.com", "sina.com", "hotmail.com"];
            this.helpDivString = '<div style="width:100%;" id="passport_helper_div"></div>';
            this.bind(e)
        }
    }

    var g = {getXY : function (e) {
        for (var f = 0, g = 0; e != document.body && e != null;)g += e.offsetLeft, f += e.offsetTop, e = e.offsetParent;
        return{x : g, y : f}
    }};
    k.prototype = {bind : function (e) {
        var f = this;
        f.usernameInputElement = e;
        e = g.getXY(f.usernameInputElement);
        f.usernameInputElementX = e.x;
        f.usernameInputElementY = e.y;
        f.handle();
        $(f.usernameInputElement).addEvent("focus", function () {
            f._initWidth = f.usernameInputElement.offsetWidth - 4;
            f.domainSelectElement.style.width = f.usernameInputElement.offsetWidth - 4 + "px"
        })
    }, handle : function () {
        var h = this;
        if (!document.getElementById("passportusernamelist")) {
            var g = document.createElement("DIV");
            g.id = "passportusernamelist";
            g.className = "domainSelector";
            g.style.display = "none";
            document.body.appendChild(g);
            g.innerHTML = h.domainSelectElmentString
        }
        h.domainSelectElement = document.getElementById("passportusernamelist");
        h.usernameListElement = h.domainSelectElement.firstChild.firstChild.rows[1].firstChild;
        h.currentSelectIndex = 0;
        h.usernameInputElement.onblur = function () {
            h.doSelect.call(h)
        };
        try {
            this.usernameInputElement.addEventListener("keypress", h.keypressProc.bind(h), !1), this.usernameInputElement.addEventListener("keyup", h.keyupProc.bind(h), !1)
        } catch (k) {
            try {
                this.usernameInputElement.attachEvent("onkeydown", h.checkKeyDown.bind(h)), this.usernameInputElement.attachEvent("onkeypress", h.keypressProc.bind(h)), this.usernameInputElement.attachEvent("onkeyup", h.keyupProc.bind(h))
            } catch (r) {
            }
        }
        f.call(h);
        if ($.browser.msie && $.browser.version < 7 && h.noscroll)h.doc = document.documentElement, h._tempTop = h.doc.scrollTop, h._tempScroll = h._scroll.bind(h), e.addEvent("scroll", h._tempScroll);
        navigator.userAgent.indexOf("MSIE") > 0 ? e.attachEvent("onresize", f.bind(h)) : e.onresize = f.bind(h)
    }, preventEvent : function (e) {
        e.cancelBubble = !0;
        e.returnValue = !1;
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation()
    }, _scroll : function () {
        this.domainSelectElement.style.top = parseInt(this.domainSelectElement.style.top) + this.doc.scrollTop - this._tempTop;
        this._tempTop = this.doc.scrollTop
    }, checkKeyDown : function (e) {
        e = e.keyCode;
        if (e == 38 || e == 40)this.clearFocus(), e == 38 ? this.upSelectIndex() : this.downSelectIndex(), this.setFocus()
    }, keyupProc : function (e) {
        var f = e.keyCode;
        this.changeUsernameSelect();
        f == 13 && this.doSelect();
        if (navigator.userAgent.indexOf("Safari") > 0 && (f == 38 || f == 40))this.preventEvent(e), this.clearFocus(), f == 38 ? this.upSelectIndex() : this.downSelectIndex(), this.setFocus()
    }, keypressProc : function (e) {
        var f = e.keyCode;
        f == 13 ? this.preventEvent(e) : f == 38 || f == 40 ? (this.clearFocus(), f == 38 ? this.upSelectIndex() : this.downSelectIndex(), this.setFocus()) : this.changeUsernameSelect()
    }, clearFocus : function (e) {
        e = this.currentSelectIndex;
        try {
            this.findTdElement(e).style.backgroundColor = "white"
        } catch (f) {
        }
    }, findTdElement : function (e) {
        try {
            for (var f = this.usernameListElement.firstChild.rows, g = 0; g < f.length; ++g)if (f[g].firstChild.idx == e)return f[g].firstChild
        } catch (k) {
        }
        return!1
    }, upSelectIndex : function () {
        var e = this.currentSelectIndex;
        if (this.usernameListElement.firstChild != null) {
            var f = this.usernameListElement.firstChild.rows, g;
            for (g = 0; g < f.length; ++g)if (f[g].firstChild.idx == e)break;
            this.currentSelectIndex = g == 0 ? f.length - 1 : f[g - 1].firstChild.idx
        }
    }, downSelectIndex : function () {
        var e = this.currentSelectIndex;
        if (this.usernameListElement.firstChild != null) {
            for (var f = this.usernameListElement.firstChild.rows, g = 0; g < f.length; ++g)if (f[g].firstChild.idx == e)break;
            this.currentSelectIndex = g >= f.length - 1 ? f[0].firstChild.idx : f[g + 1].firstChild.idx
        }
    }, setFocus : function () {
        var e = this.currentSelectIndex;
        try {
            this.findTdElement(e).style.backgroundColor = "#D5F1FF"
        } catch (f) {
        }
    }, changeUsernameSelect : function () {
        var e = this, g = APP.encodeSpecialHtmlChar(this.usernameInputElement.value);
        if (g.trim() == "")this.domainSelectElement.style.display = "none"; else {
            var k = "", r = "", l;
            (l = g.indexOf("@")) < 0 ? (k = g, r = "") : (k = g.substr(0, l), r = g.substr(l + 1, g.length));
            g = [];
            if (r == "")for (l = 0; l < this.domainArray.length; ++l)g.push(k + "@" + this.domainArray[l]); else for (l = 0; l < this.domainArray.length; ++l)this.domainArray[l].indexOf(r) == 0 && g.push(k + "@" + this.domainArray[l]);
            if (g.length > 0) {
                f.call(e);
                e.domainSelectElement.style.zIndex = "10000";
                e.domainSelectElement.style.paddingRight = "0";
                e.domainSelectElement.style.paddingLeft = "0";
                e.domainSelectElement.style.paddingTop = "2px";
                e.domainSelectElement.style.paddingBottom = "0";
                e.domainSelectElement.style.backgroundColor = "white";
                e.domainSelectElement.style.display = "block";
                k = document.createElement("TABLE");
                k.cellSpacing = 0;
                k.cellPadding = 3;
                r = document.createElement("TBODY");
                k.appendChild(r);
                for (l = 0; l < g.length; ++l) {
                    var u = document.createElement("TR"), t = document.createElement("TD");
                    t.nowrap = "true";
                    t.align = "left";
                    t.innerHTML = g[l];
                    t.idx = l;
                    t.onmouseover = function () {
                        e.clearFocus();
                        e.currentSelectIndex = this.idx;
                        e.setFocus();
                        this.style.cursor = "hand"
                    };
                    t.onmouseout = function () {
                    };
                    t.onclick = function () {
                        e.doSelect()
                    };
                    u.appendChild(t);
                    r.appendChild(u)
                }
                e.usernameListElement.innerHTML = "";
                e.usernameListElement.appendChild(k);
                for (r = l = 0; r < g.length; ++r)if (g[r].length > l)l = g[r].length;
                l *= 7.4;
                if (l < e._initWidth)l = e._initWidth;
                k.style.width = l + "px";
                this.domainSelectElement.style.width = k.style.width;
                this.setFocus()
            } else this.domainSelectElement.style.display = "none", this.currentSelectIndex = -1
        }
    }, doSelect : function () {
        this.domainSelectElement.style.display = "none";
        if (this.usernameInputElement.value.trim() != "") {
            var e = this.findTdElement(this.currentSelectIndex);
            if (e)this.usernameInputElement.value = APP.decodeSpecialHtmlChar(e.innerHTML);
            this._runFuc()
        }
    }};
    e.Passport = k
})(window);
WB.Fade = function (e) {
    this.options = {autoRun : !0, className : "current", interval : 1E3, currentIndex : 1, hashTable : [], eventType : "mouseover", isSyn : !0};
    if (typeof e != "undefined")for (var f in e)this.options[f] = e[f];
    var k = [];
    if (this.options.hashTable.length)k = this.options.hashTable; else {
        var g = $(this.options.hashTable).$(".js-panel");
        $(this.options.hashTable).$(".js-cursor").each(function (e, f) {
            k.push({trigger : f, target : g[e]})
        })
    }
    this.ary = k;
    if (this.ary.length == 0)throw Error("hashTable can not  be null");
    if (this.ary.length == 1)this.options.autoRun = !1;
    var h = this;
    h.currentIndex = h.options.currentIndex;
    h.current = $(h.ary[h.currentIndex - 1].trigger);
    for (e = 0; obj = h.ary, e < obj.length; e++) {
        if (e != h.currentIndex - 1)$(obj[e].target).opacity(0), $(obj[e].target).style.display = "none";
        $(obj[e].trigger)._target = obj[e].target;
        $(obj[e].trigger).index = e + 1;
        $(obj[e].trigger).addEvent(h.options.eventType, function () {
            h.rotate && clearInterval(h.rotate);
            WB.Fade.doit.apply(h, [this])
        });
        $(obj[e].trigger).addEvent("mouseout", function () {
            if (h.options.autoRun)h.rotate = window.setInterval(function () {
                WB.Fade.doit.apply(h, [WB.Fade.getNext.apply(h)])
            }, h.options.interval)
        });
        $($(obj[e].trigger)._target).addEvent(h.options.eventType, function () {
            h.options.isSyn && h.rotate && clearInterval(h.rotate)
        });
        $($(obj[e].trigger)._target).addEvent("mouseout", function () {
            if (h.options.isSyn && h.options.autoRun)h.rotate = window.setInterval(function () {
                WB.Fade.doit.apply(h, [WB.Fade.getNext.apply(h)])
            }, h.options.interval)
        })
    }
    $(h.current).addCss(h.options.className);
    $(h.current._target).style.display = "block"
};
WB.Fade.doit = function (e) {
    $(this.current._target).opacity(0);
    $(this.current).removeCss(this.options.className);
    $(this.current._target).style.display = "none";
    $(e).addCss(this.options.className);
    $(e._target).style.display = "block";
    $(e._target).animate({opacity : 1}, 0.6, "linear");
    this.current = e;
    this.currentIndex = e.index
};
WB.Fade.getNext = function () {
    return this.currentIndex == this.ary.length ? $(this.ary[0].trigger) : $(this.ary[this.currentIndex].trigger)
};
WB.FadeSwitch = function (e) {
    var f = new WB.Fade(e);
    if (f.options.autoRun)f.rotate = window.setInterval(function () {
        WB.Fade.doit.apply(f, [WB.Fade.getNext.apply(f)])
    }, f.options.interval)
};
WB.Float = function (e) {
    this.options = {audit : {method : "follow", keyfrom : "floatIntro"}, wraper : document.body, ispop : !0, scrollNode : null};
    if (e)for (var f in e)this.options[f] = e[f];
    this.dataPool = {};
    this.userInfoUrl = "/rank/floatWindow";
    this.delay = 500;
    this.top = this.left = 0;
    this.docWidth = this.getWidth(this.options.wraper);
    this.docPos = this.getAbsPos(this.options.wraper);
    this.entertimer = setTimeout(function () {
    }, this.delay);
    this.outtimer = setTimeout(function () {
    }, this.delay);
    this.frame = '<table class="intro-table">             <tbody>                <tr>                  <td class="intro-top-left"></td>                  <td class="intro-top-center"></td>                  <td class="intro-top-right"></td>                </tr>                <tr>                  <td class="intro-middle-left"></td>                  <td class="intro-middle-center">                     <div class="intro-wrapper">                              <div class="intro-arrow intro-arrow-bottom" id="floatArrow"></div>                              <div class="intro-content" id="floatContent">                                  <div class="intro-content-mess">                                       <em class="icon-loading"></em>                                          <p>\u52a0\u8f7d\u4e2d\uff0c\u8bf7\u7a0d\u7b49...</p>                                   </div>                              </div>                     </div>                  </td>                  <td class="intro-middle-right"></td>                </tr>                <tr>                  <td class="intro-bottom-left"></td>                  <td class="intro-bottom-center"></td>                  <td class="intro-bottom-right"></td>                </tr>             </tbody>        </table>';
    this.loadding = '<div class="intro-content-mess">                <em class="icon-loading"></em>                <p>\u52a0\u8f7d\u4e2d\uff0c\u8bf7\u7a0d\u7b49...</p>        </div>';
    this.noneuser = '<div class="intro-content-mess">                <p>\u8be5\u7528\u6237\u4e0d\u5b58\u5728</p>        </div>';
    this.template = '<div class="intro-bd">               <div class="intro-userinfo clearfix">                        <div class="intro-userinfo-left">                              <a title="<#=onickName#>" href="/<#=screenName#>" data-keyfrom="avatar" target="_blank"><img alt="<#=onickName#>" src="<#=avatar#>" /></a>                              <# if (isSelf==true) { #>                              <p>\u6211\u81ea\u5df1</p>                              <# } else { #>                              <div class="intro-relation <#if(following==0){#>intro-unfollowed<#}else if(following==1){#>intro-followed<#}else if(following==2){#>intro-mutualfollowed<#}#>" id="relationNode">                                    <a class="intro-addfocus" id="floatFollow" nickName="<#=onickName#>"  href="javascript://<#=screenName#>"><em>+</em>\u5173\u6ce8</a>                                    <span class="intro-focused"><em class="icon-correctS"></em>\u5173\u6ce8\u4e2d</span>                                    <em class="icon-mutualfollow" title="\u4f60\u4eec\u76f8\u4e92\u5173\u6ce8"></em>                              </div>                             <# } #>                        </div>                        <div class="intro-userinfo-right">                             <div class="clearfix">                                 <a class="intro-userinfo-name" href="/<#=screenName#>" data-keyfrom="nickname" target="_blank" title=<#=onickName#>><#=nickName#></a>                                    <# if (sysTag && sysTag.length > 0) { #>                                         <a class="iTag" data-tags="<#=sysTag.join(",")#>" href="/rank/daren?Method=click" title="\u7f51\u6613\u5fae\u535a i \u8ba4\u8bc1" target="_blank">                                             <span><#=sysTag.join(",")#></span>                                        </a>                                   <# } #>                              </div>                              <div class="intro-userinfo-num">                                  <ul>                                      <li>                                         <span>                                            <span>\u88ab\u5173\u6ce8\uff1a</span><strong><#=followerCount#></strong>                                         </span>                                      </li>                                  </ul>                               </div>                               <# if (description) { #>                               <p class="intro-desc"><#=description#></p>                               <# } #>                       </div>               </div>        </div>';
    this.wraper = document.createElement("div");
    this.wraper.className = "float-intro";
    document.body.insertBefore(this.wraper, document.body.firstChild);
    this.wraper.innerHTML = this.frame;
    this.arrow = $("#floatArrow");
    this.content = $("#floatContent");
    var k = this;
    APP.mouseEnter(k.wraper, function () {
        clearTimeout(k.outtimer);
        k.entertimer = setTimeout(function () {
            k.show()
        }, k.delay)
    });
    APP.mouseLeave(k.wraper, function () {
        clearTimeout(k.outtimer);
        k.outtimer = setTimeout(function () {
            k.hide()
        }, k.delay)
    });
    $(k.wraper).addEvent("click", function (e) {
        var f = e.target || e.srcElement;
        switch (f.id) {
            case "floatFollow":
                e = f.getAttribute("href").replace("javascript://", ""), f = f.getAttribute("nickName"), k.follow(e, f)
        }
    })
};
WB.Float.prototype.bind = function (e, f) {
    var k = this;
    f.length ? APP.mouseEnter(e, function () {
        clearTimeout(k.entertimer);
        k.entertimer = setTimeout(function () {
            k.asyCreate(e, f)
        }, k.delay)
    }) : APP.mouseEnter(e, function () {
        clearTimeout(k.entertimer);
        k.entertimer = setTimeout(function () {
            k.synCreate(e, f)
        }, k.delay)
    });
    APP.mouseLeave(e, function () {
        clearTimeout(k.entertimer);
        k.outtimer = setTimeout(function () {
            k.hide()
        }, k.delay)
    })
};
WB.Float.prototype.synCreate = function (e, f) {
    this.accept(f, e);
    this.setPos(e)
};
WB.Float.prototype.asyCreate = function (e, f) {
    this.dataPool[f] ? this.accept(this.dataPool[f], e) : this.asyFetch(f, e);
    this.setPos(e)
};
WB.Float.prototype.accept = function (e, f) {
    var k = {};
    if (e.length)this.render(e, f); else {
        if (this.dataPool[e.nickName])k = this.dataPool[e.nickName]; else {
            var k = {isSelf : !1, description : "\u8be5\u7528\u6237\u5df2\u6ce8\u9500", following : 0, followerCount : 0, nickName : "\u5df2\u6ce8\u9500", avatar : "http://mimg.126.net/p/butter/1008031648/img/face_big.gif", screenName : "", sysTag : ["I\u8fbe\u4eba"]}, g;
            for (g in e)k[g] = e[g];
            k.avatar = WB.oimage({url : k.avatar});
            k.onickName = k.nickName;
            k.nickName = APP.cutString(k.nickName, 0, 7);
            k.description = !k.description || k.description.trim() == "" ? " " : k.description;
            if (k.screenName == WB.User.screenName)k.isSelf = !0;
            this.dataPool[k.nickName] = k
        }
        this.render(k, f)
    }
};
WB.Float.prototype.asyFetch = function (e, f) {
    var k = this;
    k.content.innerHTML = k.loadding;
    $.ajax.send(this.userInfoUrl, "GET", {nickname : e}, {onSuccess : function (e) {
        e.responseText == "" ? k.accept(" ", f) : (e = (new Function("return " + e.responseText))(), k.accept(e, f))
    }, onError : function () {
    }})
};
WB.Float.prototype.render = function (e, f) {
    e.length ? (this.content.innerHTML = $.util.parseTpl(this.noneuser, e), this.setPos(f)) : this.content.innerHTML = $.util.parseTpl(this.template, e)
};
WB.Float.prototype.setPos = function (e) {
    var f = this.getHeight(this.wraper) + 10, k = this.getStrollTop();
    this.getHeight(e);
    var g = this.getHeight(e), e = this.getAbsPos(e);
    e.y - k - f > 0 ? (this.top = e.y - f, this.addClassName("intro-arrow-bottom")) : (this.top = e.y + 10 + g, this.addClassName("intro-arrow-top"));
    this.docWidth + this.docPos.x - e.x - 238 > 0 ? this.left = e.x : (this.left = e.x - 238, this.top = e.y - 20, this.addClassName("intro-arrow-right"));
    this.options.scrollNode && (this.top -= this.options.scrollNode.scrollTop);
    this.wraper.style.left = this.left + "px";
    this.wraper.style.top = this.top + "px";
    this.show()
};
WB.Float.prototype.follow = function (e, f) {
    var k = this;
    if (WB.User.checkUserIsLogin({}, function () {
        if (!k.options.ispop)window.location = "/";
        k.dataPool[f] = null
    }))return!1;
    WB.follow({audit : {method : k.options.audit.method, keyfrom : k.options.audit.keyfrom}, callbackFuc : function () {
        $("#relationNode").removeCss("intro-unfollowed").addCss("intro-followed");
        k.dataPool[f].following = 1
    }, screenName : e})
};
WB.Float.prototype.hide = function () {
    this.wraper.style.visibility = "hidden"
};
WB.Float.prototype.show = function () {
    this.wraper.style.visibility = "visible"
};
WB.Float.prototype.addClassName = function (e) {
    this.arrow.removeCss("intro-arrow-bottom").removeCss("intro-arrow-top").removeCss("intro-arrow-right").addCss(e)
};
WB.Float.prototype.getAbsPos = function (e) {
    for (var f = 0, k = 0; e != document.body && e != null;)k += e.offsetLeft, f += e.offsetTop, e = e.offsetParent;
    return{x : k, y : f}
};
WB.Float.prototype.getHeight = function (e) {
    return e.offsetHeight
};
WB.Float.prototype.getWidth = function (e) {
    return e.offsetWidth
};
WB.Float.prototype.getStrollTop = function () {
    oDocument = document;
    return Math.max(oDocument.documentElement.scrollTop, oDocument.body.scrollTop)
};
WB.Float.prototype.getLength = function (e) {
    return e.replace(/[^\u0000-\u007f]/g, "aa").length
};
(function () {
    if (e === void 0) {
        var e = {};
        (function (e) {
            function k(e, f, g, r) {
                if (e === void 0 || f === void 0)return{};
                var g = g || !1, r = r || !1, l;
                for (l in f)typeof l == "object" && k(e[l], f[l], g, r), g && (r ? e.prototype[l] = f[l] : e[l] = f[l]), !g && !e.hasOwnProperty(l) && (e[l] = f[l])
            }

            function g(e) {
                if (!(this instanceof g))return new g(e);
                config = this._config;
                k(config, e, !0);
                config.screenH = this._getScreen();
                this._config = config;
                this._init()
            }

            k(g, {_config : {dataSrc : "data-src", screenValue : 1.5}, _getTop : function (e) {
                return e.getBoundingClientRect().top
            },
                _imgLoad : function () {
                    var e = this._config, f = e.imgs || [], g = e.tops || [], k = e.dataSrc, l = f.length, e = e.screenH + this._getScrollTop(), u = [], t = [], p, z;
                    if (!(l < 1)) {
                        for (; l--;)p = g[l], z = f[l], g[l] <= e ? (p = z.getAttribute(k)) && (z.src = p) : (u.push(z), t.push(p));
                        this._config.imgs = u;
                        this._config.tops = t
                    }
                }, _getScreen : function () {
                    return document.documentElement.clientHeight * this._config.screenValue
                }, _getScrollTop : function () {
                    return Math.max(document.body.scrollTop, document.documentElement.scrollTop)
                }, _filterImg : function () {
                    for (var e = this._config, f = [], g = e.imgs || [], k = e.dataSrc, e = e.placehold, l = this._getScrollTop(), u = g.length ? g : document.getElementsByTagName("img"), t = u.length, p, g = []; t--;)if (p = u[t], p.getAttribute(k) && (f.push(this._getTop(p) + l), g.push(p), e))p.src = e;
                    this._config.imgs = g;
                    this._config.tops = f;
                    this._filterImg = function () {
                    }
                }, _addEvent : function (e, f, g, k) {
                    e.addEventListener ? e.addEventListener(f, g, k || !1) : e.attachEvent ? e.attachEvent("on" + f, g) : e["on" + f] = g
                }, _removeEvent : function (e, f, g) {
                    e.removeEventListener ? e.removeEventListener(f, g, !0) : e.detachEvent && e.detachEvent("on" + f, g)
                }, _init : function () {
                    function e() {
                        f._imgLoad();
                        f._config.imgs.length == 0 && (f._removeEvent(window, "scroll", e), f._removeEvent(window, "resize", resizeLoader))
                    }

                    var f = this;
                    f._filterImg();
                    f._addEvent(window, "scroll", e);
                    f._addEvent(window, "resize", resizeLoader = function () {
                        f._config.screenH = f._getScreen();
                        setTimeout(function () {
                            f._imgLoad()
                        }, 100)
                    });
                    e()
                }}, !0, !0);
            e._mix = k;
            e.imgLoadLazy = g;
            e.loadImgs = function (e, f) {
                var g = typeof e === "object" && e.length, k, l;
                if (g)for (f = f || "data-src"; g--;)if (k = e[g], l = k.getAttribute(f))k.src = l, k.removeAttribute(f); else return!0;
                return!1
            }
        })(e)
    }
    WB.imgLoadLazy = e.imgLoadLazy
})();
WB.Analytics = function () {
    if (!WB.Analytics.instance)this.route = {"t.163.com/rank" : "pRank", "t.163.com/rank/topics" : "pRank.topics", "t.163.com/rank/retweets" : "pRank.retweets", "t.163.com/rank/hot" : "pRank.hot", "t.163.com/rank/tag" : "pRank.tag", "t.163.com/rank/public" : "pRank.public", "t.163.com/rank/public/1" : "pRank.public.pic", "t.163.com/rank/public/2" : "pRank.public.mobile", "t.163.com/rank/daren" : "pRank.daren", "t.163.com/rank/group" : "pRank.group", "t.163.com/rank/media" : "pRank.media", "t.163.com/rank/daren/tweet" : "pRank.daren.tweet",
        "t.163.com/zt" : "pRank.zt", "t.163.com/debate" : "pRank.debate", "t.163.com/chat" : "pRank.chat", "t.163.com/chat/list/news" : "pRank.chat.news", "t.163.com/chat/list/ent" : "pRank.chat.ent", "t.163.com/chat/list/fashion" : "pRank.chat.fashion", "t.163.com/chat/list/book" : "pRank.chat.book", "t.163.com/chat/list/car" : "pRank.chat.car", "t.163.com/chat/list/life" : "pRank.chat.life", "t.163.com/chat/list/edu" : "pRank.chat.edu", "t.163.com/chat/list/game" : "pRank.chat.game", "t.163.com/event" : "pRank.event", "t.163.com/event/listAll" : "pRank.event.listAll",
        "t.163.com/event/mine" : "pRank.event.mine", "t.163.com/app" : "pApp", "t.163.com/app/list/games" : "pApp.games", "t.163.com/app/list/tools" : "pApp.tools", "t.163.com/app/list/life" : "pApp.life", "t.163.com/app/list/client" : "pApp.client", "t.163.com/app/website" : "pApp.website", "t.163.com/app/myapp" : "pApp.myapp", "t.163.com/mobile" : "pMobile", "t.163.com/mobile/wap" : "pMobile.wap", "t.163.com/mobile/html5" : "pMobile.html5", "t.163.com/mobile/sms" : "pMobile.sms", "t.163.com/mobile/iphone" : "pMobile.iphone", "t.163.com/mobile/ipad" : "pMobile.ipad",
        "t.163.com/mobile/android" : "pMobile.android", "t.163.com/mobile/androidpad" : "pMobile.androidPad", "t.163.com/mobile/s60v5" : "pMobile.s60v5", "t.163.com/mobile/s60v3" : "pMobile.s60v3", "t.163.com/mobile/kjava" : "pMobile.java", "t.163.com/mobile/blackberry" : "pMobile.blackberry", "t.163.com/mobile/wm" : "pMobile.wm", "t.163.com/mobile/WP7" : "pMobile.wp7", "t.163.com/column" : "pColumn"}
};
WB.Analytics.prototype.stripHash = function () {
    var e = window.location.href, f = window.location.hash, k = e.indexOf(f), e = e.split("?")[0];
    if (k != -1 && f != "")return e.slice(0, k);
    return e
};
WB.Analytics.getInstance = function () {
    if (!WB.Analytics.instance)WB.Analytics.instance = new WB.Analytics;
    return WB.Analytics.instance
};
WB.Analytics.prototype.getPv = function (e) {
    this.route[e] && WB.log({PAGE : this.route[e]})
};
WB.Analytics.prototype.pvInit = function () {
    var e = this.stripHash().match("[0-9a-zA-Z]+.([0-9a-zA-Z]+.)*([0-9a-zA-Z]+)/[0-9a-zA-Z/_]+[0-9a-zA-Z_]+")[0];
    e && this.getPv(e);
    return this
};
WB.Analytics.prototype.trigger = function (e) {
    var f = e.getAttribute("tracker"), k = e.getAttribute("target"), g = e.getAttribute("href");
    if (f)return!k || k != "_blank" ? (WB.log((new Function("return " + f))()), setTimeout(function () {
        window.location = g
    }, 100), !1) : (setTimeout(function () {
        WB.log((new Function("return " + f))())
    }, 1E3), !0)
};
WB.Analytics.prototype.logInit = function () {
    var e = this;
    $("body").addEvent("click", function (f) {
        f = f.target || f.srcElement;
        switch (f.tagName.toLowerCase()) {
            case "a":
                return e.trigger(f);
            case "span":
                return e.trigger(f.parentNode);
            case "em":
                return e.trigger(f.parentNode);
            case "img":
                return e.trigger(f.parentNode)
        }
    })
};
WB.Analytics.getInstance().pvInit().logInit();
(function () {
    function e(e) {
        var f = {userNameVal : "", password : "", showMessage : function () {
        }, showProccessing : function () {
        }, afterLogin : function () {
        }, afterOpenLogin : function () {
        }, saveLogin : !0}, h;
        for (h in e)f[h] = e[h];
        if (f.userNameVal == "")f.showMessage("\u5e10\u53f7\u4e0d\u80fd\u4e3a\u7a7a"); else if (f.password == "")f.showMessage("\u5bc6\u7801\u4e0d\u80fd\u4e3a\u7a7a"); else {
            f.showProccessing();
            (new Date).getTime();
            var e = BASE64(f.userNameVal), g = f.saveLogin;
            APP.crossDomainRequest({url : m.url.login1, param : {rnd : e, jsonp : "setLoginStatus"},
                callBack : function () {
                    if (typeof loginStatus != "undefined") {
                        var e = loginStatus.split("\n");
                        if (e[0] == "200") {
                            var h = e[1], e = e[2], k = new RSAKey;
                            k.setPublic(e, h);
                            var u = k.encrypt(getMd5(f.password));
                            APP.crossDomainRequest({url : m.url.login2, param : {rcode : u, product : "t", jsonp : "setLoginStatus", savelogin : g, username : f.userNameVal}, callBack : function () {
                                if (typeof loginStatus != "undefined")switch (loginStatus) {
                                    case "200":
                                        var e = {url : m.url.checkStatus, param : {screenName : "163", timestamp : (new Date).getTime()}, callBack : function () {
                                            if (typeof shareResult != "undefined")switch (shareResult.status) {
                                                case "1":
                                                    WB.User.email = shareResult.email;
                                                    WB.User.loginstate = "1";
                                                    f.afterLogin();
                                                    break;
                                                case "-1":
                                                    f.showMessage("\u53d1\u751f\u9519\u8bef\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5");
                                                    break;
                                                case "-3":
                                                    WB.User.email = shareResult.email;
                                                    WB.User.loginstate = "2";
                                                    f.afterOpenLogin();
                                                    break;
                                                case "-5":
                                                    f.showMessage("\u767b\u5f55\u5931\u8d25")
                                            }
                                        }};
                                        APP.crossDomainRequest(e);
                                        break;
                                    case "420":
                                        f.showMessage("\u7528\u6237\u540d\u9519\u8bef");
                                        break;
                                    case "460":
                                        f.showMessage("\u5bc6\u7801\u9519\u8bef");
                                        break;
                                    case "412":
                                        f.showMessage("\u767b\u5f55\u9519\u8bef\u6b21\u6570\u592a\u591a\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5");
                                        break;
                                    case "414":
                                        f.showMessage("IP\u767b\u5f55\u5931\u8d25\u6b21\u6570\u8fc7\u591a,\u8bf7\u7a0d\u540e\u518d\u8bd5");
                                        break;
                                    case "415":
                                        f.showMessage("\u4eca\u5929\u767b\u5f55\u9519\u8bef\u6b21\u6570\u592a\u591a,\u8bf7\u660e\u5929\u518d\u8bd5");
                                        break;
                                    case "416":
                                        f.showMessage("IP\u4eca\u5929\u767b\u5f55\u8fc7\u4e8e\u9891\u7e41\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5");
                                        break;
                                    case "417":
                                        f.showMessage("IP\u4eca\u5929\u767b\u5f55\u6b21\u6570\u8fc7\u591a\uff0c\u8bf7\u660e\u5929\u518d\u8bd5");
                                        break;
                                    case "418":
                                        f.showMessage("\u4eca\u5929\u767b\u5f55\u6b21\u6570\u8fc7\u591a,\u8bf7\u660e\u5929\u518d\u8bd5");
                                        break;
                                    case "419":
                                        f.showMessage("\u767b\u5f55\u64cd\u4f5c\u8fc7\u4e8e\u9891\u7e41\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5");
                                        break;
                                    case "420":
                                        f.showMessage("\u7528\u6237\u540d\u4e0d\u5b58\u5728");
                                        break;
                                    case "422":
                                        f.showMessage("\u5e10\u53f7\u88ab\u9501\u5b9a\uff0c\u8bf7\u60a8\u89e3\u9501\u540e\u518d\u767b\u5f55\uff01");
                                        break;
                                    case "424":
                                        f.showMessage("\u8be5\u9753\u53f7\u670d\u52a1\u5df2\u5230\u671f\uff0c\u8bf7\u60a8\u7eed\u8d39\uff01");
                                        break;
                                    case "425":
                                        f.showMessage("\u5916\u57df\u5e10\u53f7\u5e76\u4e14\u5728\u6fc0\u6d3b\u6709\u6548\u671f\u4ee5\u5185");
                                        break;
                                    case "426":
                                        f.showMessage("\u5916\u57df\u5e10\u53f7\u5e76\u4e14\u5df2\u7ecf\u8fc7\u4e86\u6fc0\u6d3b\u6709\u6548\u671f\u9650");
                                        break;
                                    case "427":
                                        f.showMessage("\u8d85\u65f6\uff0c\u5df2\u8d85\u8fc75\u5206\u949f\u6709\u6548\u671f");
                                        break;
                                    case "500":
                                        f.showMessage("\u7cfb\u7edf\u7e41\u5fd9\uff0c\u8bf7\u60a8\u7a0d\u540e\u518d\u8bd5\uff01");
                                        break;
                                    case "503":
                                        f.showMessage("\u7cfb\u7edf\u7ef4\u62a4\uff0c\u8bf7\u60a8\u7a0d\u540e\u518d\u8bd5\uff01");
                                        break;
                                    case "428":
                                        if (typeof parent.WbApp != "undefined") {
                                            window.parent.location.href = m.url.login2 + "?rcode=" + u + "&product=t&url=" + window.parent.location.href + "&savelogin=" + g + "&username=" + f.userNameVal;
                                            break
                                        }
                                        window.location.href = m.url.login2 + "?rcode=" + u + "&product=t&url=" + window.location.href + "&savelogin=" + g + "&username=" + f.userNameVal;
                                        break;
                                    default:
                                        f.showMessage("\u8d26\u53f7\u5f02\u5e38\uff01")
                                }
                            }})
                        } else f.showMessage("\u767b\u5f55\u5931\u8d25")
                    }
                }})
        }
    }

    function f(e) {
        var f = {userNameVal : "", showMessage : function () {
        },
            showProccessing : function () {
            }, afterOpen : function () {
            }}, h;
        for (h in e)f[h] = e[h];
        f.userNameVal == "" ? f.showMessage("\u6635\u79f0\u4e0d\u80fd\u4e3a\u7a7a") : f.userNameVal.replace(/[\u4e00-\u9fa5]/g, "**").length > m.showNameMaxLen * 2 ? f.showMessage("\u6635\u79f0\u4e0d\u8d85\u8fc7" + m.showNameMaxLen + "\u4e2a\u6c49\u5b57") : m.reg.showNameReg.test(f.userNameVal) ? (f.showProccessing(), APP.crossDomainRequest({url : m.url.checkNickName, param : {showName : f.userNameVal}, callBack : function () {
            if (typeof shareResult != "undefined")switch (shareResult.status) {
                case 0:
                    APP.crossDomainRequest({url : m.url.openAccount,
                        param : {nickName : f.userNameVal}, callBack : function () {
                            if (typeof shareResult != "undefined")switch (shareResult.status) {
                                case "1":
                                    f.afterOpen();
                                    break;
                                case "0":
                                    f.showMessage("\u60a8\u5df2\u7ecf\u5f00\u901a\u5fae\u535a\uff0c\u4e0d\u80fd\u91cd\u590d\u5f00\u901a");
                                    break;
                                case "-1":
                                    f.showMessage("\u5f00\u901a\u5931\u8d25");
                                    break;
                                case "-10":
                                    f.showMessage("\u5f00\u901a\u5931\u8d25");
                                    break;
                                case "3":
                                    f.showMessage("\u5f00\u901a\u5931\u8d25");
                                    break;
                                default:
                                    f.showMessage("\u5f00\u901a\u5931\u8d25")
                            }
                        }});
                    break;
                case 1:
                    f.showMessage("\u8be5\u7528\u6237\u6635\u79f0\u5df2\u5b58\u5728");
                    break;
                default:
                    f.showMessage("\u5f00\u901a\u5931\u8d25")
            }
        }})) : f.showMessage("\u53ea\u80fd\u662f\u6c49\u5b57\u3001\u5b57\u6bcd\u6216\u6570\u5b57")
    }

    function k(e, f, h) {
        this._wrapperId = e;
        this._wrapperClass = f;
        this._wrapperTemplatesHtml = h;
        this.wrapperElem = $(document.createElement("DIV"));
        this.wrapperElem.id = this._wrapperId;
        this.wrapperElem.className = this._wrapperClass;
        this.wrapperElem.innerHTML = this._wrapperTemplatesHtml;
        $(document.body).appendChild(this.wrapperElem);
        this.commonPopWindow = new $.ui.WinLayer(this.wrapperElem, !0, "display", !0)
    }

    function g(e, f, h) {
        this.email = WB.User.email;
        f ? this.renderWindow() : this.renderPop();
        this.errorNode = $("#error");
        this.userNameNode = $("#loginEmail");
        this.passwordNode = $("#loginPassword");
        this.btnNode = $("#loginBtn");
        this.saveLoginNode = $("#saveLogin");
        this.savaWraper = $("#saveLoginWraper");
        this.regBtn = $("#registerBtn");
        this.refer = h;
        this.func = e;
        this.iswindow = f;
        var g = this, k = $("#autologin_tiparea");
        g.hint = $("#popLogin-area-hint");
        g.savaWraper.addEvent("mouseover", function () {
            k.addCss("display:block")
        }).addEvent("mouseout", function () {
            k.addCss("display:none")
        });
        g.email == "" ? g.hint.style.display = "block" : APP.selectText(g.userNameNode, 0, g.userNameNode.value.length);
        g.hint.addEvent("click", function () {
            this.style.display = "none";
            g.userNameNode.focus()
        });
        g.userNameNode.addEvent("blur", function () {
            if (g.userNameNode.value.trim() == "")g.hint.style.display = "block"
        }).addEvent("focus", function () {
            g.recover()
        });
        g.passwordNode.addEvent("focus", function () {
            g.recover()
        });
        APP.bindEnterEvent(g.userNameNode, function () {
            g.userNameNode.value.trim() != "" && g.passwordNode.focus()
        });
        APP.bindEnterEvent(g.passwordNode, function () {
            g.send()
        });
        new Passport(g.userNameNode, function () {
            g.passwordNode.focus()
        });
        g.regBtn.addEvent("click", function () {
            WB.audit({method : "op.regfrom", keyfrom : g.refer.keyfrom})
        });
        this.init()
    }

    function h(e, f, g) {
        this.email = WB.User.email;
        f ? this.renderWindow() : this.renderPop();
        this.errorNode = $("#error");
        this.userNameNode = $("#loginEmail");
        this.btnNode = $("#loginBtn");
        this.changeAccountNode = $("#changeAccount");
        this.regBtn = $("#registerBtn");
        this.refer = g;
        this.func = e;
        this.iswindow = f;
        var h = this;
        APP.bindEnterEvent(h.userNameNode, function () {
            h.send()
        });
        h.userNameNode.addEvent("focus", function () {
            h.recover()
        });
        h.regBtn.addEvent("click", function () {
            WB.audit({method : "op.regfrom", keyfrom : h.refer.keyfrom})
        });
        this.init()
    }

    var m = {url : {checkNickName : "http://t.163.com/share/check/nickname", openAccount : "http://t.163.com/share/open/account", checkStatus : "http://t.163.com/share/check/status", login1 : "http://reg.163.com/services/httpLoginExchgKeyNew", login2 : "http://reg.163.com/httpLoginVerifyNew.jsp"},
        reg : {url : /(http)s?:\/\/(?:[\w-]+\.?)+[\.\/\?%&=#@\[\]\-+_!:*~\w-]+|(www)\.(?:[\w-]+\.?)+[\.\/\?%&=#@\[\]\-+_!:*~\w-]+/gi, keyword : /([#\uff03])([\u4e00-\u9fa5a-zA-Z0-9+|]{1,20})/g, user : /([@\uff20])([\u4e00-\u9fa5a-zA-Z0-9]{1,24})/g, reTplValues : /<#=(\w+)#>/g, showNameReg : /^[\u4e00-\u9fa5a-zA-Z0-9]+$/}};
    window.setLoginStatus = function (e) {
        window.loginStatus = e
    };
    WB.login = e;
    WB.register = f;
    var n = {model : '     <table class="dialogLayer-table">         <tbody>             <tr>                 <td class="dialogLayer-top-left">                 </td>                 <td class="dialogLayer-top-center">                 </td>                 <td class="dialogLayer-top-right">                 </td>             </tr>             <tr>                 <td class="dialogLayer-middle-left">                 </td>                 <td class="dialogLayer-middle-center">                     <div class="dialogLayer-content popLogin-w">                         <div class="dialogLayer-bd">                             <div class="pop-login-title js-move">                                 <div class="pop-login-yi">                                     <em></em><#=title#>                                 </div>                                 <div>                                     <a class="dialogLayer-close js-close" href="javascript:;" title="\u5173\u95ed"></a>                                 </div>                             </div>                             <div class="popWindow-formWraper">                                 <div class="popLogin-main">                                     <div class="popLoginContent">                                         <div class="popLoginArea">                                           <#=content#>                                         </div>                                     </div>                                     <div class="popLoginSideColumn">                                         <a target="_blank" href="http://t.163.com/signup/login?keyfrom=reg.login"                                             id="registerBtn" class="popLoginBg popLoginRegBtn"></a>                                     </div>                                 </div>                             </div>                         </div>                     </div>                 </td>                 <td class="dialogLayer-middle-right">                 </td>             </tr>             <tr>                 <td class="dialogLayer-bottom-left">                 </td>                 <td class="dialogLayer-bottom-center">                 </td>                 <td class="dialogLayer-bottom-right">                 </td>             </tr>         </tbody>     </table>',
        login : '      <table>          <tbody>              <tr>                  <td>                      <label class="popLoginLb pop-login-lb-m2" for="loginEmail">                          \u5e10\u53f7\uff1a</label>                  </td>                  <td>                      <div class="popLogin-wraper">                          <div class="popLogin-message" id="error">                              <em class="icon-forbidS"></em><span>\u7f51\u6613\u90ae\u7bb1/\u901a\u884c\u8bc1\u7528\u6237\u53ef\u76f4\u63a5\u767b\u5f55</span></div>                          <input type="text" id="loginEmail" value="<#=email#>" name="loginEmail" class="popLogin-inputField"                              autocomplete="off" />                          <input type="text" value="\u5982 name@example.com" id="popLogin-area-hint" class="popLogin-area-hint" <#if(email!=""){#> style="display:none;"<#}#> /></div>                  </td>                  <td>                  </td>              </tr>              <tr>                  <td>                      <label for="loginPassword" class="popLoginLb">                          \u5bc6\u7801\uff1a</label>                  </td>                  <td>                      <input type="password" id="loginPassword" name="loginPassword" class="popLogin-inputField" />                  </td>                  <td>                  </td>              </tr>              <tr>                  <td>                  </td>                  <td>                      <div id="popLogin-remmber-chk" class="popLogin-remmber-chk">                          <span id="saveLoginWraper"><input type="checkbox" id="saveLogin" name="saveLogin" /><label for="saveLogin">\u4e0b\u6b21\u81ea\u52a8\u767b\u5f55</label></span>                          <div id="autologin_tiparea" class="popLogin-tiparea">                              <div class="popLogin-tiparea-top arrowup-red">                              </div>                              <p>                                  \u4e3a\u4e86\u60a8\u7684\u4fe1\u606f\u5b89\u5168\uff0c\u8bf7\u4e0d\u8981\u5728\u7f51\u5427\u6216\u516c\u7528\u7535\u8111\u4e0a\u4f7f\u7528\u6b64\u529f\u80fd\uff01</p>                          </div>                      </div>                      <a href="http://reg.163.com/RecoverPasswd1.shtml" target="_blank" class="popLogin-remmber">                          \u5fd8\u8bb0\u5bc6\u7801?</a>                  </td>                  <td>                  </td>              </tr>              <tr>                  <td>                  </td>                  <td>                      <a href="javascript:;" id="loginBtn" target="_self" class="rect-btn-icon r-green-btn"><em>\u767b\u5f55</em></a>                  </td>                  <td>                  </td>              </tr>          </tbody>      </table>      ',
        open : '      <table>          <tbody>              <tr>                  <td colspan="2">                      <div class="popLogin-reminder">                          <div>                              \u68c0\u6d4b\u5230\u60a8\u5df2\u7ecf\u767b\u5f55\u7f51\u6613\u901a\u884c\u8bc1\uff1a</div>                          <em><#=email#></em><a id="changeAccount" target="_self" href="javascript:;"> \u6362\u4e2a\u5e10\u53f7\uff1f</a>                      </div>                      <div class="popLogin-reminder">                          <span>\u7ed9\u81ea\u5df1\u8d77\u4e2a\u6635\u79f0\uff0c\u5feb\u901f\u5f00\u901a\u5fae\u535a</span>                      </div>                  </td>              </tr>              <tr>                  <td valign="top">                      <label class="popLoginLb pop-login-lb-m1" for="loginEmail">                          \u6635\u79f0\uff1a</label>                  </td>                  <td>                      <input type="text" id="loginEmail" name="loginEmail" class="popLogin-inputField" />                      <div class="popLogin-message" id="error">                         <em class="icon-forbidS"></em><span>\u53d6\u4e2a\u72ec\u4e00\u65e0\u4e8c\u7684\u540d\u5b57\uff0c\u4ee5\u540e\u53ef\u4ee5\u4fee\u6539</span></div>                  </td>              </tr>              <tr>                  <td>                  </td>                  <td>                      <a href="javascript:;" id="loginBtn" target="_self" class="rect-btn-icon r-green-btn"><em>\u5f00\u901a\u5fae\u535a</em></a>                  </td>              </tr>          </tbody>      </table>'};
    n.windowlogin = n.login;
    k.prototype.show = function () {
        this.commonPopWindow.show()
    };
    k.prototype.hide = function () {
        this.commonPopWindow.hide()
    };
    g.prototype.show = function () {
        this.miniLoginWindow.show()
    };
    g.prototype.hide = function () {
        this.miniLoginWindow.hide()
    };
    g.prototype.renderWindow = function () {
        $("#state").innerHTML = "\u60a8\u9700\u8981\u767b\u5f55\u624d\u80fd\u7ee7\u7eed\u64cd\u4f5c";
        $("#popLoginArea").innerHTML = $.util.parseTpl(n.windowlogin, {email : this.email})
    };
    g.prototype.renderPop = function () {
        this.miniLoginWindow = new k("popLoginWindow", "dialogLayer pop-login-width", $.util.parseTpl(n.model, {content : $.util.parseTpl(n.login, {email : this.email}), title : "\u767b\u5f55\u7f51\u6613\u5fae\u535a"}));
        this.miniLoginWindow.show()
    };
    g.prototype.afterAction = function () {
        this.func()
    };
    g.prototype.loginOpenAction = function () {
        new h(this.func, this.iswindow, this.refer)
    };
    g.prototype.showMessage = function (e) {
        this.errorNode.addCss("poplogin-icon").$("span")[0].innerHTML = e;
        this.btnNode.$("em")[0].innerHTML = "\u767b\u5f55"
    };
    g.prototype.recover = function () {
        this.errorNode.removeCss("poplogin-icon").$("span")[0].innerHTML = "\u7f51\u6613\u90ae\u7bb1/\u901a\u884c\u8bc1\u7528\u6237\u53ef\u76f4\u63a5\u767b\u5f55"
    };
    g.prototype.showProccessing = function () {
        this.btnNode.$("em")[0].innerHTML = "\u767b\u5f55\u4e2d..."
    };
    g.prototype.send = function () {
        var f = this, g = f.userNameNode.attr("value").trim(), h = f.passwordNode.attr("value").trim();
        e({userNameVal : g, password : h, saveLogin : f.saveLoginNode.checked ? 1 : 0, showProccessing : function () {
            f.showProccessing()
        }, showMessage : function (e) {
            f.showMessage(e)
        },
            afterLogin : function () {
                f.iswindow ? (window.opener.resetUser(), window.close()) : (setTimeout(function () {
                    f.hide()
                }, 1E3), setTimeout(function () {
                    f.afterAction()
                }, 2E3), WB.audit({method : "op.login", keyfrom : f.refer.keyfrom}))
            }, afterOpenLogin : function () {
                f.iswindow || setTimeout(function () {
                    f.hide()
                }, 100);
                setTimeout(function () {
                    f.loginOpenAction()
                }, 200)
            }});
        return!1
    };
    g.prototype.init = function () {
        var e = this;
        e.btnNode.addEvent("click", function () {
            e.send();
            return!1
        })
    };
    h.prototype.show = function () {
        this.miniOpenWindow.show()
    };
    h.prototype.hide = function () {
        this.miniOpenWindow.hide()
    };
    h.prototype.renderWindow = function () {
        $("#state").innerHTML = "\u60a8\u9700\u8981\u5f00\u901a\u5fae\u535a\u624d\u80fd\u7ee7\u7eed\u64cd\u4f5c";
        $("#popLoginArea").innerHTML = $.util.parseTpl(n.open, {email : this.email})
    };
    h.prototype.renderPop = function () {
        this.miniOpenWindow = new k("popOpenWindow", "dialogLayer pop-login-width", $.util.parseTpl(n.model, {content : $.util.parseTpl(n.open, {email : this.email}), title : "\u5f00\u901a\u7f51\u6613\u5fae\u535a"}));
        this.show()
    };
    h.prototype.afterAction = function () {
        this.func()
    };
    h.prototype.changeAccountAction = function () {
        new g(this.func, this.iswindow, this.refer)
    };
    h.prototype.showMessage = function (e) {
        this.errorNode.addCss("poplogin-icon").$("span")[0].innerHTML = e;
        this.btnNode.$("em")[0].innerHTML = "\u5f00\u901a\u5fae\u535a"
    };
    h.prototype.recover = function () {
        this.errorNode.removeCss("poplogin-icon").$("span")[0].innerHTML = "\u53d6\u4e2a\u72ec\u4e00\u65e0\u4e8c\u7684\u540d\u5b57\uff0c\u4ee5\u540e\u53ef\u4ee5\u4fee\u6539"
    };
    h.prototype.showProccessing = function () {
        this.btnNode.$("em")[0].innerHTML = "\u5f00\u901a\u4e2d..."
    };
    h.prototype.send = function () {
        var e = this;
        f({userNameVal : e.userNameNode.value.trim(), showMessage : function (f) {
            e.showMessage(f)
        }, showProccessing : function () {
            e.showProccessing()
        }, afterOpen : function () {
            e.iswindow ? (window.opener.resetUser(), window.close()) : (e.showMessage("\u5f00\u901a\u6210\u529f"), setTimeout(function () {
                e.hide()
            }, 1E3), setTimeout(function () {
                e.afterAction()
            }, 1500), WB.log({keyfrom : e.refer.keyfrom, method : "op.reg.nickname"}))
        }})
    };
    h.prototype.init = function () {
        var e = this;
        e.btnNode.addEvent("click", function () {
            e.send();
            return!1
        });
        e.changeAccountNode.addEvent("click", function () {
            e.iswindow || setTimeout(function () {
                e.hide()
            }, 100);
            setTimeout(function () {
                e.changeAccountAction()
            }, 200)
        })
    };
    WB.renderLoginPop = function (e) {
        var e = e || {}, f = {func : function () {
        }, refer : {keyfrom : "op.other"}}, h;
        for (h in e)f[h] = e[h];
        new g(f.func, !1, f.refer)
    };
    WB.renderOpenPop = function (e) {
        var e = e || {}, f = {func : function () {
        }, refer : {keyfrom : "op.other"}}, g;
        for (g in e)f[g] = e[g];
        new h(f.func, !1, f.refer)
    };
    WB.renderLoginWindow = function (e) {
        var e = e || {}, f = {func : function () {
        }, refer : {keyfrom : "op.other"}}, h;
        for (h in e)f[h] = e[h];
        new g(f.func, !0, f.refer)
    };
    WB.renderOpenWindow = function (e) {
        var e = e || {}, f = {func : function () {
        }, refer : {keyfrom : "op.other"}}, g;
        for (g in e)f[g] = e[g];
        new h(f.func, !0, f.refer)
    };
    window.resetUser = function () {
        WB.User.loginstate = "1"
    }
})();
(function () {
    function e(e) {
        str = "";
        for (j = 0; j <= 3; j++)str += q.charAt(e >> j * 8 + 4 & 15) + q.charAt(e >> j * 8 & 15);
        return str
    }

    function f(e, f) {
        var g = (e & 65535) + (f & 65535);
        return(e >> 16) + (f >> 16) + (g >> 16) << 16 | g & 65535
    }

    function k(e, f) {
        return e << f | e >>> 32 - f
    }

    function g(e, g, h, l, o, q) {
        return f(k(f(f(g, e), f(l, q)), o), h)
    }

    function h(e, f, h, l, o, k, q) {
        return g(f & h | ~f & l, e, f, o, k, q)
    }

    function m(e, f, h, l, o, k, q) {
        return g(f & l | h & ~l, e, f, o, k, q)
    }

    function n(e, f, h, l, o, k, q) {
        return g(h ^ (f | ~l), e, f, o, k, q)
    }

    function f(e, f) {
        return(e & 2147483647) + (f & 2147483647) ^ e & 2147483648 ^ f & 2147483648
    }

    function r(e) {
        for (var f = "", g = 7; g >= 0; g--)f += "0123456789abcdef".charAt(e >> g * 4 & 15);
        return f
    }

    function k(e, f) {
        return e << f | e >>> 32 - f
    }

    function l(e, f, g) {
        e != null && ("number" == typeof e ? this.fromNumber(e, f, g) : f == null && "string" != typeof e ? this.fromString(e, 256) : this.fromString(e, f))
    }

    function u() {
        return new l(null)
    }

    function t(e, f, g, h, l, o) {
        for (; --o >= 0;) {
            var k = f * this[e++] + g[h] + l, l = Math.floor(k / 67108864);
            g[h++] = k & 67108863
        }
        return l
    }

    function p(e, f, g, h, l, o) {
        var k = f & 32767;
        for (f >>= 15; --o >= 0;) {
            var q = this[e] & 32767, s = this[e++] >> 15, m = f * q + s * k, q = k * q + ((m & 32767) << 15) + g[h] + (l & 1073741823), l = (q >>> 30) + (m >>> 15) + f * s + (l >>> 30);
            g[h++] = q & 1073741823
        }
        return l
    }

    function z(e, f, g, h, l, o) {
        var k = f & 16383;
        for (f >>= 14; --o >= 0;) {
            var q = this[e] & 16383, s = this[e++] >> 14, m = f * q + s * k, q = k * q + ((m & 16383) << 14) + g[h] + l, l = (q >> 28) + (m >> 14) + f * s;
            g[h++] = q & 268435455
        }
        return l
    }

    function A(e) {
        var f = u();
        f.fromInt(e);
        return f
    }

    function F(e) {
        var f = 1, g;
        if ((g = e >>> 16) != 0)e = g, f += 16;
        if ((g = e >> 8) != 0)e = g, f += 8;
        if ((g = e >> 4) != 0)e = g, f += 4;
        if ((g = e >> 2) != 0)e = g, f += 2;
        e >> 1 != 0 && (f += 1);
        return f
    }

    function D(e) {
        this.m = e
    }

    function B(e) {
        this.m = e;
        this.mp = e.invDigit();
        this.mpl = this.mp & 32767;
        this.mph = this.mp >> 15;
        this.um = (1 << e.DB - 15) - 1;
        this.mt2 = 2 * e.t
    }

    function G() {
        this.j = this.i = 0;
        this.S = []
    }

    function J(e) {
        y[w++] ^= e & 255;
        y[w++] ^= e >> 8 & 255;
        y[w++] ^= e >> 16 & 255;
        y[w++] ^= e >> 24 & 255;
        w >= I && (w -= I)
    }

    function K() {
    }

    function o() {
        this.n = null;
        this.e = 0;
        this.coeff = this.dmq1 = this.dmp1 = this.q = this.p = this.d = null
    }

    var q = "0123456789abcdef";
    window.getMd5 = function (l) {
        nblk = (l.length + 8 >> 6) + 1;
        blks = Array(nblk * 16);
        for (i = 0; i < nblk * 16; i++)blks[i] = 0;
        for (i = 0; i < l.length; i++)blks[i >> 2] |= l.charCodeAt(i) << i % 4 * 8;
        blks[i >> 2] |= 128 << i % 4 * 8;
        blks[nblk * 16 - 2] = l.length * 8;
        x = blks;
        a = 1732584193;
        b = -271733879;
        c = -1732584194;
        d = 271733878;
        for (i = 0; i < x.length; i += 16)olda = a, oldb = b, oldc = c, oldd = d, a = h(a, b, c, d, x[i + 0], 7, -680876936), d = h(d, a, b, c, x[i + 1], 12, -389564586), c = h(c, d, a, b, x[i + 2], 17, 606105819), b = h(b, c, d, a, x[i + 3], 22, -1044525330), a = h(a, b, c, d, x[i + 4], 7, -176418897), d = h(d, a, b, c, x[i + 5], 12, 1200080426), c = h(c, d, a, b, x[i + 6], 17, -1473231341), b = h(b, c, d, a, x[i + 7], 22, -45705983), a = h(a, b, c, d, x[i + 8], 7, 1770035416), d = h(d, a, b, c, x[i + 9], 12, -1958414417), c = h(c, d, a, b, x[i + 10], 17, -42063), b = h(b, c, d, a, x[i + 11], 22, -1990404162), a = h(a, b, c, d, x[i + 12], 7, 1804603682), d = h(d, a, b, c, x[i + 13], 12, -40341101), c = h(c, d, a, b, x[i + 14], 17, -1502002290), b = h(b, c, d, a, x[i + 15], 22, 1236535329), a = m(a, b, c, d, x[i + 1], 5, -165796510), d = m(d, a, b, c, x[i + 6], 9, -1069501632), c = m(c, d, a, b, x[i + 11], 14, 643717713), b = m(b, c, d, a, x[i + 0], 20, -373897302), a = m(a, b, c, d, x[i + 5], 5, -701558691), d = m(d, a, b, c, x[i + 10], 9, 38016083), c = m(c, d, a, b, x[i + 15], 14, -660478335), b = m(b, c, d, a, x[i + 4], 20, -405537848), a = m(a, b, c, d, x[i + 9], 5, 568446438), d = m(d, a, b, c, x[i + 14], 9, -1019803690), c = m(c, d, a, b, x[i + 3], 14, -187363961), b = m(b, c, d, a, x[i + 8], 20, 1163531501), a = m(a, b, c, d, x[i + 13], 5, -1444681467), d = m(d, a, b, c, x[i + 2], 9, -51403784), c = m(c, d, a, b, x[i + 7], 14, 1735328473), b = m(b, c, d, a, x[i + 12], 20, -1926607734), a = g(b ^ c ^ d, a, b, x[i + 5], 4, -378558), d = g(a ^ b ^ c, d, a, x[i + 8], 11, -2022574463), c = g(d ^ a ^ b, c, d, x[i + 11], 16, 1839030562), b = g(c ^ d ^ a, b, c, x[i + 14], 23, -35309556), a = g(b ^ c ^ d, a, b, x[i + 1], 4, -1530992060), d = g(a ^ b ^ c, d, a, x[i + 4], 11, 1272893353), c = g(d ^ a ^ b, c, d, x[i + 7], 16, -155497632), b = g(c ^ d ^ a, b, c, x[i + 10], 23, -1094730640), a = g(b ^ c ^ d, a, b, x[i + 13], 4, 681279174), d = g(a ^ b ^ c, d, a, x[i + 0], 11, -358537222), c = g(d ^ a ^ b, c, d, x[i + 3], 16, -722521979), b = g(c ^ d ^ a, b, c, x[i + 6], 23, 76029189), a = g(b ^ c ^ d, a, b, x[i + 9], 4, -640364487), d = g(a ^ b ^ c, d, a, x[i + 12], 11, -421815835), c = g(d ^ a ^ b, c, d, x[i + 15], 16, 530742520), b = g(c ^ d ^ a, b, c, x[i + 2], 23, -995338651), a = n(a, b, c, d, x[i + 0], 6, -198630844), d = n(d, a, b, c, x[i + 7], 10, 1126891415), c = n(c, d, a, b, x[i + 14], 15, -1416354905), b = n(b, c, d, a, x[i + 5], 21, -57434055), a = n(a, b, c, d, x[i + 12], 6, 1700485571), d = n(d, a, b, c, x[i + 3], 10, -1894986606), c = n(c, d, a, b, x[i + 10], 15, -1051523), b = n(b, c, d, a, x[i + 1], 21, -2054922799), a = n(a, b, c, d, x[i + 8], 6, 1873313359), d = n(d, a, b, c, x[i + 15], 10, -30611744), c = n(c, d, a, b, x[i + 6], 15, -1560198380), b = n(b, c, d, a, x[i + 13], 21, 1309151649), a = n(a, b, c, d, x[i + 4], 6, -145523070), d = n(d, a, b, c, x[i + 11], 10, -1120210379), c = n(c, d, a, b, x[i + 2], 15, 718787259), b = n(b, c, d, a, x[i + 9], 21, -343485551), a = f(a, olda), b = f(b, oldb), c = f(c, oldc), d = f(d, oldd);
        return e(a) + e(b) + e(c) + e(d)
    };
    window.SHA1 = function (e) {
        for (var g = (e.length + 8 >> 6) + 1, h = Array(g * 16), l = 0; l < g * 16; l++)h[l] = 0;
        for (l = 0; l < e.length; l++)h[l >> 2] |= e.charCodeAt(l) << 24 - (l & 3) * 8;
        h[l >> 2] |= 128 << 24 - (l & 3) * 8;
        h[g * 16 - 1] = e.length * 8;
        for (var e = Array(80), g = 1732584193, l = -271733879, o = -1732584194, q = 271733878, s = -1009589776, m = 0; m < h.length; m += 16) {
            for (var u = g, n = l, E = o, v = q, t = s, p = 0; p < 80; p++) {
                e[p] = p < 16 ? h[m + p] : k(e[p - 3] ^ e[p - 8] ^ e[p - 14] ^ e[p - 16], 1);
                var z = f, I = f, H = k(g, 5), y;
                y = p < 20 ? l & o | ~l & q : p < 40 ? l ^ o ^ q : p < 60 ? l & o | l & q | o & q : l ^ o ^ q;
                C = z(I(H, y), f(f(s, e[p]), p < 20 ? 1518500249 : p < 40 ? 1859775393 : p < 60 ? -1894007588 : -899497514));
                s = q;
                q = o;
                o = k(l, 30);
                l = g;
                g = C
            }
            g = f(g, u);
            l = f(l, n);
            o = f(o, E);
            q = f(q, v);
            s = f(s, t)
        }
        return SHA1Value = r(g) + r(l) + r(o) + r(q) + r(s)
    };
    window.BASE64 = function (e) {
        var f, g, h, l, o, k;
        h = e.length;
        g = 0;
        for (f = ""; g < h;) {
            l = e.charCodeAt(g++) & 255;
            if (g == h) {
                f += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(l >> 2);
                f += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((l & 3) << 4);
                f += "==";
                break
            }
            o = e.charCodeAt(g++);
            if (g == h) {
                f += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(l >> 2);
                f += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((l & 3) << 4 | (o & 240) >> 4);
                f += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((o & 15) << 2);
                f += "=";
                break
            }
            k = e.charCodeAt(g++);
            f += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(l >> 2);
            f += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((l & 3) << 4 | (o & 240) >> 4);
            f += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((o & 15) << 2 | (k & 192) >> 6);
            f += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(k & 63)
        }
        return f
    };
    window.utf16to8 = function (e) {
        var f, g, h, l;
        f = "";
        h = e.length;
        for (g = 0; g < h; g++)l = e.charCodeAt(g), l >= 1 && l <= 127 ? f += e.charAt(g) : (l > 2047 ? (f += String.fromCharCode(224 | l >> 12 & 15), f += String.fromCharCode(128 | l >> 6 & 63)) : f += String.fromCharCode(192 | l >> 6 & 31), f += String.fromCharCode(128 | l >> 0 & 63));
        return f
    };
    var s;
    navigator.appName == "Microsoft Internet Explorer" ? (l.prototype.am = p, s = 30) : navigator.appName != "Netscape" ? (l.prototype.am = t, s = 26) : (l.prototype.am = z, s = 28);
    l.prototype.DB = s;
    l.prototype.DM = (1 << s) - 1;
    l.prototype.DV = 1 << s;
    l.prototype.FV = Math.pow(2, 52);
    l.prototype.F1 = 52 - s;
    l.prototype.F2 = 2 * s - 52;
    var E = [], v;
    s = "0".charCodeAt(0);
    for (v = 0; v <= 9; ++v)E[s++] = v;
    s = "a".charCodeAt(0);
    for (v = 10; v < 36; ++v)E[s++] = v;
    s = "A".charCodeAt(0);
    for (v = 10; v < 36; ++v)E[s++] = v;
    D.prototype.convert = function (e) {
        return e.s < 0 || e.compareTo(this.m) >= 0 ? e.mod(this.m) : e
    };
    D.prototype.revert = function (e) {
        return e
    };
    D.prototype.reduce = function (e) {
        e.divRemTo(this.m, null, e)
    };
    D.prototype.mulTo = function (e, f, g) {
        e.multiplyTo(f, g);
        this.reduce(g)
    };
    D.prototype.sqrTo = function (e, f) {
        e.squareTo(f);
        this.reduce(f)
    };
    B.prototype.convert = function (e) {
        var f = u();
        e.abs().dlShiftTo(this.m.t, f);
        f.divRemTo(this.m, null, f);
        e.s < 0 && f.compareTo(l.ZERO) > 0 && this.m.subTo(f, f);
        return f
    };
    B.prototype.revert = function (e) {
        var f = u();
        e.copyTo(f);
        this.reduce(f);
        return f
    };
    B.prototype.reduce = function (e) {
        for (; e.t <= this.mt2;)e[e.t++] = 0;
        for (var f = 0; f < this.m.t; ++f) {
            var g = e[f] & 32767, h = g * this.mpl + ((g * this.mph + (e[f] >> 15) * this.mpl & this.um) << 15) & e.DM, g = f + this.m.t;
            for (e[g] += this.m.am(0, h, e, f, 0, this.m.t); e[g] >= e.DV;)e[g] -= e.DV, e[++g]++
        }
        e.clamp();
        e.drShiftTo(this.m.t, e);
        e.compareTo(this.m) >= 0 && e.subTo(this.m, e)
    };
    B.prototype.mulTo = function (e, f, g) {
        e.multiplyTo(f, g);
        this.reduce(g)
    };
    B.prototype.sqrTo = function (e, f) {
        e.squareTo(f);
        this.reduce(f)
    };
    l.prototype.copyTo = function (e) {
        for (var f = this.t - 1; f >= 0; --f)e[f] = this[f];
        e.t = this.t;
        e.s = this.s
    };
    l.prototype.fromInt = function (e) {
        this.t = 1;
        this.s = e < 0 ? -1 : 0;
        e > 0 ? this[0] = e : e < -1 ? this[0] = e + DV : this.t = 0
    };
    l.prototype.fromString = function (e, f) {
        var g;
        if (f == 16)g = 4; else if (f == 8)g = 3; else if (f == 256)g = 8; else if (f == 2)g = 1; else if (f == 32)g = 5; else if (f == 4)g = 2; else {
            this.fromRadix(e, f);
            return
        }
        this.s = this.t = 0;
        for (var h = e.length, o = !1, k = 0; --h >= 0;) {
            var q;
            g == 8 ? q = e[h] & 255 : (q = E[e.charCodeAt(h)], q = q == null ? -1 : q);
            q < 0 ? e.charAt(h) == "-" && (o = !0) : (o = !1, k == 0 ? this[this.t++] = q : k + g > this.DB ? (this[this.t - 1] |= (q & (1 << this.DB - k) - 1) << k, this[this.t++] = q >> this.DB - k) : this[this.t - 1] |= q << k, k += g, k >= this.DB && (k -= this.DB))
        }
        if (g == 8 && (e[0] & 128) != 0)this.s = -1, k > 0 && (this[this.t - 1] |= (1 << this.DB - k) - 1 << k);
        this.clamp();
        o && l.ZERO.subTo(this, this)
    };
    l.prototype.clamp = function () {
        for (var e = this.s & this.DM; this.t > 0 && this[this.t - 1] == e;)--this.t
    };
    l.prototype.dlShiftTo = function (e, f) {
        var g;
        for (g = this.t - 1; g >= 0; --g)f[g + e] = this[g];
        for (g = e - 1; g >= 0; --g)f[g] = 0;
        f.t = this.t + e;
        f.s = this.s
    };
    l.prototype.drShiftTo = function (e, f) {
        for (var g = e; g < this.t; ++g)f[g - e] = this[g];
        f.t = Math.max(this.t - e, 0);
        f.s = this.s
    };
    l.prototype.lShiftTo = function (e, f) {
        var g = e % this.DB, h = this.DB - g, l = (1 << h) - 1, o = Math.floor(e / this.DB), k = this.s << g & this.DM, q;
        for (q = this.t - 1; q >= 0; --q)f[q + o + 1] = this[q] >> h | k, k = (this[q] & l) << g;
        for (q = o - 1; q >= 0; --q)f[q] = 0;
        f[o] = k;
        f.t = this.t + o + 1;
        f.s = this.s;
        f.clamp()
    };
    l.prototype.rShiftTo = function (e, f) {
        f.s = this.s;
        var g = Math.floor(e / this.DB);
        if (g >= this.t)f.t = 0; else {
            var h = e % this.DB, l = this.DB - h, o = (1 << h) - 1;
            f[0] = this[g] >> h;
            for (var k = g + 1; k < this.t; ++k)f[k - g - 1] |= (this[k] & o) << l, f[k - g] = this[k] >> h;
            h > 0 && (f[this.t - g - 1] |= (this.s & o) << l);
            f.t = this.t - g;
            f.clamp()
        }
    };
    l.prototype.subTo = function (e, f) {
        for (var g = 0, h = 0, l = Math.min(e.t, this.t); g < l;)h += this[g] - e[g], f[g++] = h & this.DM, h >>= this.DB;
        if (e.t < this.t) {
            for (h -= e.s; g < this.t;)h += this[g], f[g++] = h & this.DM, h >>= this.DB;
            h += this.s
        } else {
            for (h += this.s; g < e.t;)h -= e[g], f[g++] = h & this.DM, h >>= this.DB;
            h -= e.s
        }
        f.s = h < 0 ? -1 : 0;
        h < -1 ? f[g++] = this.DV + h : h > 0 && (f[g++] = h);
        f.t = g;
        f.clamp()
    };
    l.prototype.multiplyTo = function (e, f) {
        var g = this.abs(), h = e.abs(), o = g.t;
        for (f.t = o + h.t; --o >= 0;)f[o] = 0;
        for (o = 0; o < h.t; ++o)f[o + g.t] = g.am(0, h[o], f, o, 0, g.t);
        f.s = 0;
        f.clamp();
        this.s != e.s && l.ZERO.subTo(f, f)
    };
    l.prototype.squareTo = function (e) {
        for (var f = this.abs(), g = e.t = 2 * f.t; --g >= 0;)e[g] = 0;
        for (g = 0; g < f.t - 1; ++g) {
            var h = f.am(g, f[g], e, 2 * g, 0, 1);
            if ((e[g + f.t] += f.am(g + 1, 2 * f[g], e, 2 * g + 1, h, f.t - g - 1)) >= f.DV)e[g + f.t] -= f.DV, e[g + f.t + 1] = 1
        }
        e.t > 0 && (e[e.t - 1] += f.am(g, f[g], e, 2 * g, 0, 1));
        e.s = 0;
        e.clamp()
    };
    l.prototype.divRemTo = function (e, f, g) {
        var h = e.abs();
        if (!(h.t <= 0)) {
            var o = this.abs();
            if (o.t < h.t)f != null && f.fromInt(0), g != null && this.copyTo(g); else {
                g == null && (g = u());
                var k = u(), q = this.s, e = e.s, s = this.DB - F(h[h.t - 1]);
                s > 0 ? (h.lShiftTo(s, k), o.lShiftTo(s, g)) : (h.copyTo(k), o.copyTo(g));
                h = k.t;
                o = k[h - 1];
                if (o != 0) {
                    var m = o * (1 << this.F1) + (h > 1 ? k[h - 2] >> this.F2 : 0), n = this.FV / m, m = (1 << this.F1) / m, E = 1 << this.F2, p = g.t, v = p - h, t = f == null ? u() : f;
                    k.dlShiftTo(v, t);
                    g.compareTo(t) >= 0 && (g[g.t++] = 1, g.subTo(t, g));
                    l.ONE.dlShiftTo(h, t);
                    for (t.subTo(k, k); k.t < h;)k[k.t++] = 0;
                    for (; --v >= 0;) {
                        var r = g[--p] == o ? this.DM : Math.floor(g[p] * n + (g[p - 1] + E) * m);
                        if ((g[p] += k.am(0, r, g, v, 0, h)) < r) {
                            k.dlShiftTo(v, t);
                            for (g.subTo(t, g); g[p] < --r;)g.subTo(t, g)
                        }
                    }
                    f != null && (g.drShiftTo(h, f), q != e && l.ZERO.subTo(f, f));
                    g.t = h;
                    g.clamp();
                    s > 0 && g.rShiftTo(s, g);
                    q < 0 && l.ZERO.subTo(g, g)
                }
            }
        }
    };
    l.prototype.invDigit = function () {
        if (this.t < 1)return 0;
        var e = this[0];
        if ((e & 1) == 0)return 0;
        var f = e & 3, f = f * (2 - (e & 15) * f) & 15, f = f * (2 - (e & 255) * f) & 255, f = f * (2 - ((e & 65535) * f & 65535)) & 65535, f = f * (2 - e * f % this.DV) % this.DV;
        return f > 0 ? this.DV - f : -f
    };
    l.prototype.isEven = function () {
        return(this.t > 0 ? this[0] & 1 : this.s) == 0
    };
    l.prototype.exp = function (e, f) {
        if (e > 4294967295 || e < 1)return l.ONE;
        var g = u(), h = u(), o = f.convert(this), k = F(e) - 1;
        for (o.copyTo(g); --k >= 0;)if (f.sqrTo(g, h), (e & 1 << k) > 0)f.mulTo(h, o, g); else var q = g, g = h, h = q;
        return f.revert(g)
    };
    l.prototype.toString = function (e) {
        if (this.s < 0)return"-" + this.negate().toString(e);
        if (e == 16)e = 4; else if (e == 8)e = 3; else if (e == 2)e = 1; else if (e == 32)e = 5; else if (e == 4)e = 2; else return this.toRadix(e);
        var f = (1 << e) - 1, g, h = !1, l = "", o = this.t, k = this.DB - o * this.DB % e;
        if (o-- > 0) {
            if (k < this.DB && (g = this[o] >> k) > 0)h = !0, l = "0123456789abcdefghijklmnopqrstuvwxyz".charAt(g);
            for (; o >= 0;)k < e ? (g = (this[o] & (1 << k) - 1) << e - k, g |= this[--o] >> (k += this.DB - e)) : (g = this[o] >> (k -= e) & f, k <= 0 && (k += this.DB, --o)), g > 0 && (h = !0), h && (l += "0123456789abcdefghijklmnopqrstuvwxyz".charAt(g))
        }
        return h ? l : "0"
    };
    l.prototype.negate = function () {
        var e = u();
        l.ZERO.subTo(this, e);
        return e
    };
    l.prototype.abs = function () {
        return this.s < 0 ? this.negate() : this
    };
    l.prototype.compareTo = function (e) {
        var f = this.s - e.s;
        if (f != 0)return f;
        var g = this.t, f = g - e.t;
        if (f != 0)return this.s < 0 ? -f : f;
        for (; --g >= 0;)if ((f = this[g] - e[g]) != 0)return f;
        return 0
    };
    l.prototype.bitLength = function () {
        if (this.t <= 0)return 0;
        return this.DB * (this.t - 1) + F(this[this.t - 1] ^ this.s & this.DM)
    };
    l.prototype.mod = function (e) {
        var f = u();
        this.abs().divRemTo(e, null, f);
        this.s < 0 && f.compareTo(l.ZERO) > 0 && e.subTo(f, f);
        return f
    };
    l.prototype.modPowInt = function (e, f) {
        var g;
        g = e < 256 || f.isEven() ? new D(f) : new B(f);
        return this.exp(e, g)
    };
    l.ZERO = A(0);
    l.ONE = A(1);
    G.prototype.init = function (e) {
        var f, g, h;
        for (f = 0; f < 256; ++f)this.S[f] = f;
        for (f = g = 0; f < 256; ++f)g = g + this.S[f] + e[f % e.length] & 255, h = this.S[f], this.S[f] = this.S[g], this.S[g] = h;
        this.j = this.i = 0
    };
    G.prototype.next = function () {
        var e;
        this.i = this.i + 1 & 255;
        this.j = this.j + this.S[this.i] & 255;
        e = this.S[this.i];
        this.S[this.i] = this.S[this.j];
        this.S[this.j] = e;
        return this.S[e + this.S[this.i] & 255]
    };
    var I = 256, H, y, w;
    if (y == null) {
        y = [];
        w = 0;
        var C;
        if (navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto && window.crypto.random) {
            s = window.crypto.random(32);
            for (C = 0; C < s.length; ++C)y[w++] = s.charCodeAt(C) & 255
        }
        for (; w < I;)C = Math.floor(65536 * Math.random()), y[w++] = C >>> 8, y[w++] = C & 255;
        w = 0;
        J((new Date).getTime())
    }
    K.prototype.nextBytes = function (e) {
        var f;
        for (f = 0; f < e.length; ++f) {
            var g = e, h = f, l;
            if (H == null) {
                J((new Date).getTime());
                H = new G;
                H.init(y);
                for (w = 0; w < y.length; ++w)y[w] = 0;
                w = 0
            }
            l = H.next();
            g[h] = l
        }
    };
    o.prototype.doPublic = function (e) {
        return e.modPowInt(this.e, this.n)
    };
    o.prototype.setPublic = function (e, f) {
        e != null && f != null && e.length > 0 && f.length > 0 ? (this.n = new l(e, 16), this.e = parseInt(f, 16)) : alert("Invalid RSA public key")
    };
    o.prototype.encrypt = function (e) {
        var f;
        f = this.n.bitLength() + 7 >> 3;
        if (f < e.length + 11)alert("Message too long for RSA"), f = null; else {
            for (var g = [], h = e.length - 1; h >= 0 && f > 0;) {
                var o = e.charCodeAt(h--);
                o < 128 ? g[--f] = o : o > 127 && o < 2048 ? (g[--f] = o & 63 | 128, g[--f] = o >> 6 | 192) : (g[--f] = o & 63 | 128, g[--f] = o >> 6 & 63 | 128, g[--f] = o >> 12 | 224)
            }
            g[--f] = 0;
            e = new K;
            for (h = []; f > 2;) {
                for (h[0] = 0; h[0] == 0;)e.nextBytes(h);
                g[--f] = h[0]
            }
            g[--f] = 2;
            g[--f] = 0;
            f = new l(g)
        }
        if (f == null)return null;
        f = this.doPublic(f);
        if (f == null)return null;
        f = f.toString(16);
        return(f.length & 1) == 0 ? f : "0" + f
    };
    window.RSAKey = o
})();
WB.Move = function (e) {
    this.options = {elem : {}, interval : 50, speed : 10};
    for (var f in e)this.options[f] = e[f]
};
WB.Move.prototype.run = function (e, f) {
    var k = this, g = k.options.elem;
    k.stop();
    if (!g.style.left)g.style.left = "0px";
    if (!g.style.top)g.style.top = "0px";
    var h = parseInt(g.style.left), m = parseInt(g.style.top);
    if (h == e && m == f)return!0;
    if (h < e) {
        var n = Math.ceil((e - h) / 10);
        h += n
    }
    h > e && (n = Math.ceil((h - e) / 10), h -= n);
    m < f && (n = Math.ceil((f - m) / 10), m += n);
    m > f && (n = Math.ceil((m - f) / 10), m -= n);
    g.style.left = h + "px";
    g.style.top = m + "px";
    g.movement = setTimeout(function () {
        k.run(e, f)
    }, k.options.interval)
};
WB.Move.prototype.uniformRun = function (e, f) {
    var k = this, g = k.options.elem;
    k.stop();
    if (!g.style.left)g.style.left = "0px";
    if (!g.style.top)g.style.top = "0px";
    var h = parseInt(g.style.left), m = parseInt(g.style.top);
    if (h == e && m == f)return!0;
    var n = k.options.speed;
    h < e && (h += n);
    h > e && (h -= n);
    m < f && (m += n);
    m > f && (m -= n);
    g.style.left = h + "px";
    g.style.top = m + "px";
    g.movement = setTimeout(function () {
        k.uniformRun(e, f)
    }, k.options.interval)
};
WB.Move.prototype.stop = function () {
    this.options.elem.movement && clearTimeout(this.options.elem.movement)
};
function NavModel() {
    this.message = "http://t.163.com/service/newMessage/<#=email#>/0/1/1/1/1/1/1";
    this.app = "/app/navi";
    this.qun = "/service/qun.do";
    this.mail = {"163.com" : "http://entry.mail.163.com/coremail/fcg/ntesdoor2?verifycookie=1&lightweight=1", "126.com" : "http://entry.mail.126.com/cgi/ntesdoor?verifycookie=1&lightweight=1&style=-1", "vip.126.com" : "http://reg.vip.126.com/enterMail.m", "yeah.net" : "http://entry.yeah.net/cgi/ntesdoor?verifycookie=1&lightweight=1&style=-1", "188.com" : "http://reg.mail.188.com/servlet/enter",
        "vip.163.com" : "http://reg.vip.163.com/enterMail.m?enterVip=true", others : "others"}
}
NavModel.prototype.getMessage = function (e, f) {
    var k = {url : $.util.parseTpl(this.message, {email : e}), callBack : function () {
        typeof resultStatus != "undefined" && f(resultStatus)
    }};
    APP.crossDomainRequest(k)
};
NavModel.prototype.getApps = function (e) {
    APP.ajaxSend({requestUrl : this.app, method : "GET", dataType : "json", success : function (f) {
        e(f)
    }})
};
NavModel.prototype.getMail = function (e, f) {
    var k = "others";
    this.mail[e] && (k = this.mail[e]);
    f(k)
};
NavModel.prototype.getQun = function (e) {
    APP.ajaxSend({requestUrl : this.qun, method : "GET", dataType : "json", success : function (f) {
        e(f)
    }})
};
function NavController() {
}
NavController.prototype.buildMessage = function (e) {
    var f = this;
    f.model.getMessage(e, function (e) {
        f.renderer.renderMessage(e)
    })
};
NavController.prototype.buildApps = function () {
    var e = this;
    e.model.getApps(function (f) {
        e.renderer.renderApps(f)
    })
};
NavController.prototype.buildMailList = function (e) {
    var f = this, e = e.split("@")[1];
    f.model.getMail(e, function (e) {
        f.renderer.renderMailList(e)
    })
};
NavController.prototype.buildQunList = function () {
    var e = this;
    e.model.getQun(function (f) {
        e.renderer.renderQunList(f)
    })
};
function NavRender() {
    this.navNode = $("#globalNav");
    this.userNode = $("#globalNavUser");
    this.leftApp = $("#leftApp");
    this.rightApp = $("#rightApp");
    this.qunNode = $("#qun-list");
    this.pageWraper = $("#pageWraper");
    this.topBanner = $("#globalTopBanner");
    this.appTemp = '          <li>             <a href="/app/detail/<#=key#>?<#=log#>"><span><img src="<#=icon#>"><#=name#></span></a>          </li>';
    this.qunTemp = '          <li>             <a href="/qun/<#=key#>" class="pos-rel">                <#if(r>0){#>                 <#=name#>                 <em class="q-ower-status-num"><#=count#></em>                <#}else{#>                 <#=oname#>                <#}#>             </a>          </li>';
    this.myqunTemp = '          <li>             <a href="/qun/<#=key#>" class="link-qOwer">                <b class="icon-qOwer"></b><#=name#>                <#if(r>0){#>                 <em class="q-ower-status-num"><#=count#></em>                <#}#>             </a>          </li>';
    this.loginTemp = '           <li class="item js-hover">           <a class="link global-nav-user" href="/<#=screenName#>/mine" tracker="{ method:\'click\',keyfrom:\'opNav.mine\'}" title="<#=oname#>" >             <img src="<#=oimage#>" />           </a>           <div class="global-nav-sublist js-list global-nav-sublist-passport">             <ul class="global-nav-sublist-list" id="navProduct">             </ul>           </div>         </li>         <li class="item item-info js-hover" data-type="news"><#=message#></li>         <li class="item js-hover">           <a class="global-nav-setting link link-hover" href="/settings/profile"><em></em></a>           <div class="global-nav-sublist global-nav-sublist-setting js-list">              <ul class="global-nav-sublist-list">                 <li><a href="/settings/profile" tracker="{ method:\'click\',keyfrom:\'opNav.setting\'}">\u8bbe\u7f6e</a></li>                 <li><a href="/?setSkin" tracker="{ method:\'click\',keyfrom:\'opNav.skin\'}">\u6362\u80a4<i class="icon-newS"></i></a></li>                 <li><a href="http://reg.163.com/Logout.jsp?username=&url=http://t.163.com">\u9000\u51fa</a></li>              </ul>           </div>         </li>         <li class="item <#if(isMobile==1){#>current<#}#>" id="js-mobile">            <a href="/mobile" class="global-nav-mobile link" tracker="{ method:\'click\',keyfrom:\'opNav.mobile\'}"><em></em></a>         </li>';
    this.unloginTemp = '         <li class="item">           <span class="link">\u4f60\u8fd8\u6ca1\u6709\u5fae\u535a\u5e10\u53f7\uff1f</span>         </li>         <li class="item">            <a class="link" href="http://t.163.com/signup/login" tracker="{ method:\'click\',keyfrom:\'reg.login\'}">             <strong>\u6ce8\u518c</strong>           </a>         </li>         <li class="item item-line">|</li>         <li class="item">           <a class="link" href="javascript:;" id="navLogin" class="need-login">\u767b\u5f55</a>         </li>';
    this.mailListTemp = '         <li>             <a  href="http://reg.163.com/Main.jsp?username=<#=username#>">\u8fdb\u5165\u901a\u884c\u8bc1</a>         </li>         <#if(mailAddress!="others"){#>          <li>              <a  href="<#=mailAddress#>">\u8fdb\u5165\u6211\u7684\u90ae\u7bb1</a>          </li>          <li>             <a  href="http://blog.163.com/passportIn.do?entry=163">\u8fdb\u5165\u6211\u7684\u535a\u5ba2</a>         </li>         <li>             <a  href="http://photo.163.com/?username=<#=username#>">\u8fdb\u5165\u6211\u7684\u76f8\u518c</a>         </li>         <#}#> ';
    this.messageTemp = '           <span class="notice-info"><em class="js-total"><#=total#></em><i></i></span>           <div class="global-nav-sublist global-nav-sublist-notice js-list">             <ul class="global-nav-sublist-list">               <li>                 <a href="/<#=screenName#>/home/mention" tracker="{ method:\'click\',keyfrom:\'opNav.attl\'}">                   <em class="global-nav-num"><#=atCount#></em>@\u63d0\u5230\u6211\u7684                 </a>               </li>               <li>                 <a  href="/<#=screenName#>/home/replied" tracker="{ method:\'click\',keyfrom:\'opNav.replied\'}">                   <em class="global-nav-num"><#=replyCount#></em>\u6211\u7684\u8bc4\u8bba                 </a>               </li>               <li>                 <a  href="/<#=screenName#>/session" tracker="{ method:\'click\',keyfrom:\'opNav.inBox\'}">                   <em class="global-nav-num"><#=directCount#></em>\u6211\u7684\u79c1\u4fe1                 </a>               </li>               <li>                 <a  href="/<#=screenName#>/feed" tracker="{ method:\'click\',keyfrom:\'opNav.feed\'}">                   <em class="global-nav-num"></em>\u4e2a\u6027\u63a8\u8350                 </a>               </li>               <li>                 <a  href="/<#=screenName#>/followers" tracker="{ method:\'click\',keyfrom:\'opNav.followed\'}">                   <em class="global-nav-num"><#=fcount#></em>\u88ab\u5173\u6ce8\u6570                 </a>               </li>             </ul>           </div> '
}
NavRender.prototype.init = function () {
    this.renderLoginState()
};
NavRender.prototype.bindHoverEvent = function () {
    this.navNode.$(".js-hover").each(function (e, f) {
        APP.mouseEnter(f, function () {
            $(f).addCss("hover")
        });
        APP.mouseLeave(f, function () {
            $(f).removeCss("hover")
        })
    });
    this.navNode.$(".js-list").each(function (e, f) {
        APP.mouseLeave(f, function () {
            $(f.parentNode).removeCss("hover")
        })
    })
};
NavRender.prototype.renderMessage = function (e) {
    var e = {total : this.filter(parseInt(e.fcount) + parseInt(e.replyCount) + parseInt(e.atCount) + parseInt(e.directCount) + parseInt(e.replyAtCount), !0), atCount : this.filter(parseInt(e.atCount) + parseInt(e.replyAtCount)), replyCount : this.filter(e.replyCount), directCount : this.filter(e.directCount), fcount : this.filter(e.fcount), screenName : WB.User.screenName}, f = WB.User.name;
    f.replace(/[^\u0000-\u007f]/g, "aa").length > 8 && (f = APP.cutString(f, 0, 4) + "...");
    var k = 0;
    window.location.href.indexOf("mobile") != -1 && (k = 1);
    e = {name : f, oname : WB.User.name, screenName : WB.User.screenName, oimage : WB.User.profile, message : $.util.parseTpl(this.messageTemp, e), isDaren : WB.User.darenType == "0", isMobile : k};
    this.userNode.innerHTML = $.util.parseTpl(this.loginTemp, e);
    this.controller.buildMailList(WB.User.email);
    this.bindHoverEvent()
};
NavRender.prototype.filter = function (e, f) {
    e = parseInt(e);
    if (e == 0 && !f)return"";
    if (e > 99)return"99+";
    return e.toString()
};
NavRender.prototype.renderLoginState = function () {
    if (WB.User.logined) {
        if (this.controller.buildMessage(WB.User.email), this.pageWraper)this.pageWraper.addCss("margin-top: 33px;"), this.topBanner.style.display = "none"
    } else this.userNode.innerHTML = this.unloginTemp, $("#navLogin").addEvent("click", function () {
        WB.User.checkUserIsLogin()
    }), this.pageWraper && new TopLogin({keyfrom : "opLoginGuide"});
    this.controller.buildApps();
    this.controller.buildQunList();
    this.bindHoverEvent()
};
NavRender.prototype.renderApps = function (e) {
    var f = e.count, e = e.apps, k = [], g = [];
    if (f != 0) {
        f > 6 && $(this.leftApp.parentNode.parentNode).addCss("global-nav-alllist");
        f = "method=click&keyfrom=opNav.app.mine";
        WB.User.logined || (f = "method=click&keyfrom=opNav.app.rec");
        for (var h = 0; h < e.length; h++)h < 6 ? k.push($.util.parseTpl(this.appTemp, {key : e[h].key, icon : WB.oimage({url : e[h].icon, width : 17, height : 17}), log : f, name : this.cutAppString(e[h].name), oname : e[h].name})) : g.push($.util.parseTpl(this.appTemp, {key : e[h].key, icon : WB.oimage({url : e[h].icon,
            width : 17, height : 17}), log : f, name : this.cutAppString(e[h].name), oname : e[h].name}));
        this.leftApp.innerHTML = k.join("");
        this.rightApp.innerHTML = g.join("");
        this.rightApp.style.display = g.length == 0 ? "none" : ""
    }
};
NavRender.prototype.renderMailList = function (e) {
    e = {mailAddress : e, username : WB.User.email.split("@")[0]};
    $("#navProduct").innerHTML = $.util.parseTpl(this.mailListTemp, e)
};
NavRender.prototype.renderQunList = function (e) {
    var f = e.myquns, e = e.myCreateQuns, k = [], g = f.length, h = e.length;
    if (g == 0 && h == 0)$(".global-nav-sublist-qun").addCss("hidden"); else {
        for (var m = 0; m < h; m++)m < 2 && k.push($.util.parseTpl(this.myqunTemp, {key : e[m].qunNO, name : this.cutAppString(e[m].qunName, 11), oname : e[m].qunName, count : this.filter(e[m].newTLCount), r : e[m].newTLCount}));
        for (m = 0; m < g; m++)m < 3 && k.push($.util.parseTpl(this.qunTemp, {key : f[m].qunNO, name : this.cutAppString(f[m].qunName, 13), oname : f[m].qunName, count : this.filter(f[m].newTLCount),
            r : f[m].newTLCount}));
        this.qunNode.innerHTML = k.join("")
    }
};
NavRender.prototype.cutAppString = function (e, f) {
    f = f || 8;
    if (e.replace(/[^\u0000-\u007f]/g, "aa").length > f)return APP.cutString(e, 0, f / 2) + "...";
    return e
};
function TopLogin(e) {
    this.email = WB.User.email;
    this.wraper = $("#globalTopBanner");
    this.pageWraper = $("#pageWraper");
    this.userNameNode = $("#topBannerLoginEmail");
    this.passwordNode = $("#topBannerLoginPassword");
    this.btnNode = $("#topBannerLoginBtn");
    this.saveLoginNode = $("#topBannerSaveLogin");
    this.regBtn = $("#topBannerRegBtn");
    this.savaWraper = $("#topBanerSaveLoginWraper");
    this.closeNode = $("#topBannerClose");
    this.errorNode = $("#topBannerError");
    this.autologin_tiparea = $("#topBanerTip");
    this.hint = $("#topBannerHint");
    this.refer = e || {keyfrom : "no"};
    var f = this;
    f.savaWraper.addEvent("mouseover", function () {
        f.autologin_tiparea.addCss("display:block")
    }).addEvent("mouseout", function () {
        f.autologin_tiparea.addCss("display:none")
    });
    f.email == "" ? f.hint.style.display = "block" : APP.selectText(f.userNameNode, 0, f.userNameNode.value.length);
    f.hint.addEvent("click", function () {
        this.style.display = "none";
        f.userNameNode.focus()
    });
    f.userNameNode.addEvent("blur", function () {
        if (f.userNameNode.value.trim() == "")f.hint.style.display = "block"
    }).addEvent("focus", function () {
        f.recover()
    });
    f.passwordNode.addEvent("focus", function () {
        f.recover()
    });
    f.closeNode.addEvent("click", function () {
        f.hide();
        WB.log({method : "close", keyfrom : f.refer.keyfrom});
        return!1
    });
    APP.bindEnterEvent(f.userNameNode, function () {
        f.userNameNode.value.trim() != "" && f.passwordNode.focus()
    });
    APP.bindEnterEvent(f.passwordNode, function () {
        f.send()
    });
    new Passport(f.userNameNode, function () {
        f.passwordNode.focus()
    });
    f.regBtn.addEvent("click", function () {
        WB.log({method : "register", keyfrom : f.refer.keyfrom})
    });
    this.init()
}
TopLogin.prototype.show = function () {
    this.wraper.style.display = "block";
    this.pageWraper && this.pageWraper.addCss("margin-top: 153px;")
};
TopLogin.prototype.hide = function () {
    this.wraper.style.display = "none";
    this.pageWraper && this.pageWraper.addCss("margin-top: 33px;")
};
TopLogin.prototype.showMessage = function (e) {
    this.errorNode.addCss("global-top-banner-error").$("span")[0].innerHTML = e;
    this.btnNode.innerHTML = "\u767b\u5f55"
};
TopLogin.prototype.recover = function () {
    this.errorNode.removeCss("global-top-banner-error").$("span")[0].innerHTML = "\u7f51\u6613\u90ae\u7bb1/\u901a\u884c\u8bc1\u7528\u6237\u53ef\u76f4\u63a5\u767b\u5f55"
};
TopLogin.prototype.showProccessing = function () {
    this.btnNode.innerHTML = "\u767b\u5f55\u4e2d..."
};
TopLogin.prototype.send = function () {
    var e = this, f = e.userNameNode.attr("value").trim(), k = e.passwordNode.attr("value").trim();
    WB.login({userNameVal : f, password : k, saveLogin : e.saveLoginNode.checked ? 1 : 0, showProccessing : function () {
        e.showProccessing()
    }, showMessage : function (f) {
        e.showMessage(f)
    }, afterLogin : function () {
        setTimeout(function () {
            e.hide()
        }, 1E3);
        setTimeout(function () {
            WB.User.init(null, function () {
                $("#userInfo") && WB.UserInfoZt($("#userInfo"), e.refer);
                WB.NaviBar()
            })
        }, 1E3);
        WB.log({method : "login", keyfrom : e.refer.keyfrom})
    },
        afterOpenLogin : function () {
            setTimeout(function () {
                e.hide()
            }, 100);
            setTimeout(function () {
                WB.User.checkUserIsLogin()
            }, 200)
        }});
    return!1
};
TopLogin.prototype.init = function () {
    var e = this;
    e.btnNode.addEvent("click", function () {
        e.send();
        return!1
    });
    e.show()
};
WB.NaviBar = function () {
    $("#globalNav") && new MCR(NavController, NavModel, NavRender)
};
WB.PagerView = Class.extend({init : function (e) {
    this.options = {size : 15, maxButtons : 9, itemCount : 0, index : 1, pageCount : 1, pagerClass : "", text : "\u6362\u4e00\u6279"};
    this.container = null;
    this._end = this._start = 1;
    this.options.pageCount = Math.ceil(this.options.itemCount / this.options.size);
    for (var f in e)this.options[f] = e[f];
    this.staticDataCollection = []
}, onclick : function () {
    return!0
}, _onclick : function (e) {
    var f = this.options.index;
    this.options.index = e;
    this.onclick(e) !== !1 ? this.render(this.wraperId) : this.options.index = f
},
    _calculate : function () {
        this.options.pageCount = parseInt(Math.ceil(this.options.itemCount / this.options.size));
        this.options.index = parseInt(this.options.index);
        if (this.options.index > this.options.pageCount)this.options.index = this.options.pageCount;
        if (this.options.index < 1)this.options.index = 1;
        this._start = Math.max(1, this.options.index - parseInt(this.options.maxButtons / 2));
        this._end = Math.min(this.options.pageCount, this._start + this.options.maxButtons - 1);
        this._start = Math.max(1, this._end - this.options.maxButtons + 1)
    }, page : function (e) {
        this._calculate();
        return e.slice((this.index - 1) * this.options.size, this.index * this.options.size)
    }, render : function () {
        return!0
    }, bind : function () {
        for (var e = this.container.getElementsByTagName("a"), f = this, k = 0; k < e.length; k++)e[k].onclick = function () {
            var e = this.getAttribute("href");
            e != void 0 && e != "" && (e = parseInt(e.replace("javascript://", "")), f._onclick(e));
            return!1
        }
    }, getStaticData : function (e) {
        var f = [];
        if (this.options.size > this.staticDataCollection.length)return this.staticDataCollection; else if (e > this.options.pageCount)return[]; else if (e <= this.options.pageCount) {
            for (var k = 0; k < this.staticDataCollection.length; k++)for (var g = 0; g < this.options.size; g++)k == (e - 1) * this.options.size + g && f.push(this.staticDataCollection[k]);
            return f
        }
    }});
WB.Pager = WB.PagerView.extend({render : function (e) {
    this.container = this.wraperId = e;
    this._calculate();
    e = "";
    this.options.pageCount > 1 && (e += this.options.index != 1 ? '<a href="javascript://' + (this.options.index - 1) + '" class="link-lb">\u4e0a\u4e00\u9875</a>' : "");
    this._start > 1 && (e += ' <a href="javascript://1" class="link-lb">1</a>', this._start > 2 && (e += ' <span class="pageList-cur">...</span>'));
    for (var f = this._start; f <= this._end; f++)e += f == this.options.index ? f == 1 && this.options.pageCount == 1 ? " <span></span>" : ' <span class="pageList-cur">' + f + "</span>" : ' <a href="javascript://' + f + '" class="link-lb">' + f + "</a>";
    this._end < this.options.pageCount && (this._end < this.options.pageCount - 1 && (e += ' <span class="pageList-cur">...</span>'), e += ' <a href="javascript://' + this.options.pageCount + '" class="link-lb">' + this.options.pageCount + "</a>");
    this.options.pageCount > 1 && (e += this.options.index != this.options.pageCount ? '<a href="javascript://' + (this.options.index + 1) + '" class="link-lb">\u4e0b\u4e00\u9875</a>' : "");
    this.container.innerHTML = e;
    this.bind()
}});
WB.Change = WB.PagerView.extend({render : function (e) {
    this.container = this.wraperId = e;
    this._calculate();
    e = "";
    this.options.pageCount > 1 && (e += this.options.index != this.options.pageCount ? '<a  hideFocus="true" class="' + this.options.pagerClass + ' js-change" href="javascript://' + (this.options.index + 1) + '" target="_self">' + this.options.text + "</a>" : '<a  hideFocus="true" class="' + this.options.pagerClass + ' js-change" href="javascript://1" target="_self" >' + this.options.text + "</a>");
    this.container.innerHTML = e;
    this.bind()
}});
(function () {
    function e() {
        this.url = "/service/search/suggest.do"
    }

    function f() {
    }

    function k() {
    }

    e.prototype.getResult = function (e, f) {
        APP.ajaxSend({requestUrl : this.url, method : "GET", dataType : "json", param : {k : e}, success : function (e) {
            f(e)
        }})
    };
    e.prototype.searchUser = function (e) {
        window.location = "/search/user/" + e
    };
    e.prototype.searchTag = function (e) {
        window.location = "/search/tag/" + e
    };
    e.prototype.searchTweet = function (e) {
        window.location = "/tag/" + e
    };
    e.prototype.searchApp = function (e) {
        window.location = "/search/app/" + e
    };
    e.prototype.toUserPage = function (e) {
        window.location = "/" + e
    };
    f.prototype.getResult = function (e) {
        var f = this;
        f.model.getResult(e, function (e) {
            f.renderer.buildList(e)
        })
    };
    f.prototype.searchUser = function (e) {
        this.model.searchUser(e)
    };
    f.prototype.searchTag = function (e) {
        this.model.searchTag(e)
    };
    f.prototype.searchTweet = function (e) {
        this.model.searchTweet(e)
    };
    f.prototype.searchApp = function (e) {
        this.model.searchApp(e)
    };
    f.prototype.toUserPage = function (e) {
        this.model.toUserPage(e)
    };
    k.prototype.buildList = function (e) {
        this.nodeNum = 0;
        this.buildUsers(e.users);
        this.buildTweets(e.suggests);
        this.buildApps(e.consumers);
        this.buildTags(e.tags);
        this.collect()
    };
    k.prototype.buildUsers = function (e) {
        this.userstr = '<li class="nobg search-result-option" search-type="user" keyword="' + this.keyword + '"><a class="clearfix" href="/search/user/' + this.keyword + '">\u542b<em class="cDRed">' + this.cut(this.keyword) + "</em>\u7684\u7528\u6237</a></li>";
        for (var f = [], k = 0; k < e.length; k++)f.push($.util.parseTpl(this.usertemp, {keyword : e[k].screenName, avatar : e[k].avatar, nickName : e[k].nickName,
            location : e[k].location, realName : e[k].realName, isdaren : e[k].type == "daren" || e[k].type == "corp"}));
        this.userstr += f.join("")
    };
    k.prototype.buildTweets = function (e) {
        this.tweetstr = '<li class="nobg search-result-option" search-type="tweets" keyword="' + this.keyword + '"><a class="clearfix" href="/tag/' + this.keyword + '">\u542b<em class="cDRed">' + this.cut(this.keyword) + "</em>\u7684\u5fae\u535a</a></li>";
        for (var f = [], k = 0; k < e.length; k++)f.push($.util.parseTpl(this.tweetstemp, {keyword : e[k].text, richKeyWord : e[k].richText}));
        this.tweetstr += f.join("")
    };
    k.prototype.buildApps = function (e) {
        this.appstr = '<li class="nobg search-result-option" search-type="app" tracker="{ keyfrom:\'op.sGuess.sapp\'}" keyword="' + this.keyword + '"><a class="clearfix" href="/search/app/' + this.keyword + '">\u542b<em class="cDRed">' + this.cut(this.keyword) + "</em>\u7684\u5e94\u7528</a></li>";
        for (var f = [], k = 0; k < e.length; k++)f.push($.util.parseTpl(this.appstemp, {keyword : e[k].name, appAvatar : WB.oimage({width : 30, height : 30, url : e[k].icon}), consumerKey : e[k].consumerKey,
            userCount : e[k].userCount}));
        this.appstr += f.join("")
    };
    k.prototype.buildTags = function () {
        this.tagstr = $.util.parseTpl(this.tagtemp, {keyword : this.cut(this.keyword), okeyword : this.keyword})
    };
    k.prototype.collect = function () {
        this.list.innerHTML = this.tweetstr + this.userstr + this.appstr;
        this.nodeCollection = this.list.$("li");
        this.nodeNum = this.nodeCollection.length;
        this.proccessing = !1
    };
    k.prototype.cut = function (e) {
        if (Math.ceil(e.replace(/[^\u0000-\u007f]/g, "aa").length / 2) > 12)return APP.cutString(e, 0, 18) + "...";
        return e
    };
    k.prototype.init = function () {
        this.form = $("#searchForm");
        if (!this.form)throw Error("form id must be searchForm");
        this.inputelem = this.form.$(".js-input").$(0);
        this.btnelem = this.form.$(".js-btn").$(0);
        this.defaultVal = this.inputelem.getAttribute("val");
        this.inputelem.value = this.defaultVal;
        this.keyword = "";
        this.createHtml();
        this.bind();
        this.nodeCollection = [];
        this._index = -2;
        this.proccessing = !0;
        this.isIE = $.browser.msie;
        this.usertemp = '      <li class="search-result-data clearfix" keyword="<#=keyword#>" search-type="userpage">            <a class="clearfix" href="/<#=keyword#>">            <img class="thumb-search" src="<#=avatar#>">            <div class="search-data-word">                 <p class="name">                     <#=nickName#>                     <#if(isdaren==true){#>                        <em class="iTag"></em>                     <#}#>                 </p>                 <p class="site">                   <#=location#>                 </p>            </div>            </a>      </li>';
        this.tweetstemp = '      <li keyword="<#=keyword#>" search-type="tweets" class="search-result-word">          <a class="clearfix" href="/tag/<#=keyword#>">            <#=richKeyWord#>          </a>      </li>';
        this.tagtemp = '      <li class="nobg search-result-option clearfix" keyword="<#=keyword#>" search-type="tag">          <a class="clearfix" href="/search/tag/<#=okeyword#>">           \u542b<em class="cDRed"><#=keyword#></em>\u7684\u6807\u7b7e          </a>      </li>';
        this.appstemp = '      <li keyword="<#=consumerKey#>" search-type="app" class="search-result-data clearfix">          <a class="clearfix" href="/app/detail/<#=consumerKey#>" tracker="{ keyfrom:\'op.sGuess.app\'}">          <img class="thumb-search" src="<#=appAvatar#>">            <div class="search-data-word">                 <p class="name"><#=keyword#></p>                 <p class="site">                   <#=userCount#>\u4eba\u4f7f\u7528                 </p>            </div>          </a>      </li>'
    };
    k.prototype.createHtml = function () {
        this.resultnode = document.createElement("DIV");
        this.resultnode.id = "searchResult";
        this.resultnode.className = "head-search-result";
        this.resultnode.innerHTML = "<ul></ul>";
        document.body.appendChild(this.resultnode);
        $(this.resultnode).addCss("min-width:" + (this.inputelem.offsetWidth + 1) + "px");
        $.browser.msie && $.browser.version < 7 && $(this.resultnode).addCss("width:" + (this.inputelem.offsetWidth + 1) + "px");
        this.resultnode = $("#searchResult");
        this.list = this.resultnode.$("> ul").$(0);
        this.setPosition();
        $(window).addEvent("resize", this.setPosition.bind(this))
    };
    k.prototype.setPosition = function () {
        var e = APP.getAbsPosition(this.inputelem);
        this.resultnode.style.top = e.y + this.inputelem.offsetHeight - 1 + "px";
        this.resultnode.style.left = e.x - 1 + "px"
    };
    k.prototype.keyEvent = function (e) {
        var f = this;
        f.keyword = APP.encodeSpecialHtmlChar(f.inputelem.value.trim());
        if (e.keyCode == 40) {
            if (!f.proccessing) {
                f._index++;
                if (f._index + 1 > f.nodeNum)f._index = 0;
                f.down()
            }
        } else if (e.keyCode == 38) {
            if (!f.proccessing) {
                f._index--;
                if (f._index < 0)f._index = f.nodeNum - 1;
                f.up()
            }
        } else if (e.keyCode == 13)f.proccessing ? f.triggerDefault() : f.curerentNode ? f.triggerSearch(f.currentNode) : f.triggerDefault(); else if (e.keyCode != 37 && e.keyCode != 39)f.keyword == "" ? (f.timer && clearTimeout(f.timer), f.resultnode.style.display = "none", f.proccessing = !0) : f.delay(function () {
            f.loadding();
            f.controller.getResult(f.keyword)
        })
    };
    k.prototype.bind = function () {
        var e = this;
        e.inputelem.addEvent("click", function () {
            e.form.addCss("search-active");
            var f = e.inputelem.value.trim(), k = e.list.innerHTML;
            if (f == e.defaultVal)e.inputelem.value = ""; else if (f != "" && f != e.defaultVal)e.isIE && k == "" ? (e.keyword = f, e.delay(function () {
                e.loadding();
                e.controller.getResult(f)
            })) : (e.resultnode.style.display = "block", e.proccessing = !1)
        }).addEvent("blur", function () {
            if (e.inputelem.value == "")e.form.removeCss("search-active"), e.inputelem.value = e.defaultVal;
            e.timer && clearTimeout(e.timer);
            setTimeout(function () {
                e.resultnode.style.display = "none"
            }, 200);
            e.proccessing = !0
        });
        e.inputelem.addEvent("keyup", function (f) {
            e.keyEvent(f)
        });
        e.btnelem && e.btnelem.addEvent("click", function () {
            e.triggerDefault()
        })
    };
    k.prototype.triggerDefault = function () {
        this.keyword = this.inputelem.value.trim();
        this.keyword != "" && this.keyword != this.defaultVal && this.controller.searchTweet(this.keyword)
    };
    k.prototype.loadding = function () {
        this.setPosition();
        this.resultnode.style.display = "block";
        this.list.innerHTML = '<li class="search-result-loading"><em class="icon-loadingS"></em></li>';
        this.proccessing = !0;
        this._index = -2
    };
    k.prototype.delay = function (e) {
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(function () {
            e()
        }, 500)
    };
    k.prototype.down = function () {
        if (this.nodeNum != 0)if (this._index == -1) {
            var e = this.nodeCollection.$(0);
            e.addCss("search-result-current");
            this.currentNode = e;
            this._index = 0
        } else this.currentNode.removeCss("search-result-current"), e = this.nodeCollection.$(this._index), e.addCss("search-result-current"), this.currentNode = e
    };
    k.prototype.up = function () {
        if (this.nodeNum != 0)if (this._index == -1) {
            var e = this.nodeCollection.$(this.nodeNum - 1);
            e.addCss("search-result-current");
            this.currentNode = e;
            this._index = this.nodeNum - 1
        } else this.currentNode.removeCss("search-result-current"), e = this.nodeCollection.$(this._index), e.addCss("search-result-current"), this.currentNode = e
    };
    k.prototype.triggerSearch = function (e) {
        var f = e.getAttribute("keyword");
        switch (e.getAttribute("search-type")) {
            case "user":
                this.controller.searchUser(f);
                break;
            case "tweets":
                this.controller.searchTweet(f);
                break;
            case "tag":
                this.controller.searchTag(f);
                break;
            case "userpage":
                this.controller.toUserPage(f)
        }
    };
    WB.SearchBox = WB.searchForm = function () {
        new MCR(f, e, k)
    }
})();
$.ui.Shade = new function () {
    var e = $(document.body), f = document.documentElement, k = document.createElement("div"), g = !1;
    k.id = "shade";
    e.appendChild(k);
    if (typeof Settingpage != "undefined" && $.browser.msie && $.browser.version < 7)k.innerHTML = "<iframe style='position:absolute;width:100%;height:100%;_filter:alpha(opacity=0);opacity=0;border:1px solid #DDD;z-index:-1;top:100;left:0;'></iframe>";
    this.show = function () {
        var e = this;
        e._setposEvent = null;
        if (!g) {
            k.style.width = Math.max(f.scrollWidth, f.clientWidth) + "px";
            k.style.height = Math.max(f.scrollHeight, f.clientHeight) + "px";
            k.style.top = "0px";
            if ($.browser.msie && $.browser.version < 7) {
                var m = function () {
                    e.IE6Position()
                };
                e.IE6Position();
                e._setposEvent && window.removeEvent("scroll", m);
                e._setposEvent = window.addEvent("scroll", m)
            }
            k.style.display = "block";
            g = !0
        }
    };
    this.IE6Position = function () {
        var e = Math.max(f.scrollHeight, f.clientHeight);
        k.style.width = Math.max(f.scrollWidth, f.clientWidth) + "px";
        k.style.position = "absolute";
        k.style.height = Math.min(e, 3E3) + "px";
        k.style.top = Math.min(Math.max(e - 3E3, 0), Math.max(f.scrollTop - 3E3 + window.screen.availHeight, 0)) + "px"
    };
    this.hide = function () {
        if (g)k.style.display = "none", g = !1
    }
};
WB.Slide = function (e) {
    this.options = {wraper : document.body, speed : 10, width : 100, eventType : "click", currentCursor : "js-current"};
    for (var f in e)this.options[f] = e[f];
    var k = this;
    k.curentIndex = 1;
    var g = $(k.options.wraper).$(".js-container").$(0);
    k.c = g;
    e = g.parentNode;
    f = $(k.options.wraper).$(".js-panel");
    var h = $(k.options.wraper).$(".js-cursor"), m = $(k.options.wraper).$(".js-left").$(0), n = $(k.options.wraper).$(".js-right").$(0), r = k.options.width;
    k.count = f.length;
    var l = f[0], u = f[k.count - 1], t = document.createElement(l.tagName);
    t.className = l.className;
    t.innerHTML = l.innerHTML;
    var p = document.createElement(u.tagName);
    p.className = u.className;
    p.innerHTML = u.innerHTML;
    APP.insertBefore(p, l);
    APP.insertAfter(t, u);
    if (f.length != 0) {
        l = h.length > 0;
        k.l = Math.ceil(f[0].offsetWidth * f.length / r);
        if (k.isCursor = l)k.cursor = $(h[0]), k.cursor.addCss(k.options.currentCursor), k.cursors = h, k.cursors && k.cursors.each(function (e, f) {
            (function (e) {
                $(f).addEvent(k.options.eventType, function () {
                    k.pull(e + 1);
                    k.setCursor(this)
                })
            })(e)
        });
        k.panels = f;
        g.style.position = "relative";
        g.style.width = "20000px";
        g.style.left = -k.options.width + "px";
        e.style.width = r + "px";
        e.style.overflow = "hidden";
        e.style.position = "relative";
        k.move = new WB.Move({elem : g, interval : 5, speed : k.options.speed});
        m && m.addEvent(this.options.eventType, function () {
            k.curentIndex--;
            if (k.curentIndex == 0)k.curentIndex = k.l, g.style.left = -(k.l + 1) * k.options.width + "px";
            k.setIndex(k.isCursor);
            k.pull(k.curentIndex)
        });
        n && n.addEvent(this.options.eventType, function () {
            k.curentIndex++;
            if (k.curentIndex == k.l + 1)k.curentIndex = 1, g.style.left = 0;
            k.setIndex(k.isCursor);
            k.pull(k.curentIndex)
        })
    }
};
WB.Slide.prototype.setCursor = function (e) {
    this.cursor.removeCss(this.options.currentCursor);
    this.cursor = $(e);
    this.cursor.addCss(this.options.currentCursor)
};
WB.Slide.prototype.pull = function (e) {
    this.move.run(-e * this.options.width);
    this.curentIndex = e
};
WB.Slide.prototype.setIndex = function (e) {
    e && this.setCursor(this.cursors[this.curentIndex - 1])
};
WB.Tab = function (e) {
    this.options = {className : "", eventType : "click", tabCollection : [], func : function () {
    }, tabIndex : 1};
    for (var f in e)this.options[f] = e[f];
    this.current = {};
    var k = this;
    $.each(this.options.tabCollection, function (e, f) {
        if (e + 1 == k.options.tabIndex)$(f).addCss(k.options.className), k.current = f;
        $(f).addEvent(k.options.eventType, function () {
            k.trigger(f);
            k.options.tabIndex = e + 1;
            return!1
        })
    })
};
WB.Tab.prototype.trigger = function (e) {
    $(this.current).removeCss(this.options.className);
    $(e).addCss(this.options.className);
    this.current = e;
    this.options.func.apply(e)
};
(function () {
    function e(e, f) {
        var g = this;
        g.refer = f;
        g.loginNode = $("#userInfoLogin");
        g.wrapperElem = e;
        g.loginNode.addEvent("click", function () {
            WB.renderLoginPop({func : function () {
                WB.User.init(null, function () {
                    WB.UserInfo(g.wrapperElem, g.refer);
                    WB.NaviBar()
                })
            }, refer : g.refer})
        })
    }

    function f(e, f) {
        var g = this;
        this.proccessingNode = $("#user-proccessing");
        this.errorNode = $("#user-error");
        this.userNameNode = $("#info-nickname");
        this.btnNode = $("#user-loginBtn");
        this.changeAccountNode = $("#user-change");
        this.wrapperElem = e;
        this.refer = f;
        APP.bindEnterEvent(g.userNameNode, function () {
            g.send()
        });
        g.changeAccountNode.addEvent("click", function () {
            WB.renderLoginPop({func : function () {
                WB.User.init(null, function () {
                    WB.UserInfo(g.wrapperElem, g.refer);
                    WB.NaviBar()
                })
            }, refer : g.refer})
        });
        g.btnNode.addEvent("click", function () {
            g.send()
        })
    }

    var k = document.body.offsetHeight, g = document.body.offsetWidth < 520 || k < 300, h = $.cookie.get("P_INFO").split("|")[0];
    WB.User = {logined : !1, loginstate : "0", email : "", loginUser : null, name : "", screenName : "", profile : "",
        darenType : "-1", init : function (e, f) {
            var g = this, l = {url : "http://t.163.com/article/getUserProfileInfo", param : {rnd : (new Date).getTime()}, callBack : function () {
                if (typeof loginUserInfo != "undefined") {
                    g.loginstate = loginUserInfo.loginstate;
                    switch (loginUserInfo.loginstate) {
                        case "1":
                            g.loginUser = loginUserInfo.loginUser;
                            g.name = loginUserInfo.loginUser.name;
                            g.screenName = loginUserInfo.loginUser.screen_name;
                            g.profile = loginUserInfo.loginUser.profile_image_url;
                            g.email = h;
                            g.logined = !0;
                            g.darenType = loginUserInfo.loginUser.darenType;
                            break;
                        case "2":
                            g.email = loginUserInfo.email
                    }
                    f && f()
                }
            }};
            APP.crossDomainRequest(l)
        }, checkUserIsLogin : function (e, f) {
            var f = f || function () {
            }, h = {refer : {keyfrom : "op.other"}, func : function () {
                WB.User.init(null, function () {
                    var e = $("#userInfo");
                    e && WB.UserInfo(e, h.refer);
                    WB.NaviBar();
                    f()
                })
            }};
            if (e)for (var l in e)h.refer[l] = e[l];
            var k = h.func;
            l = function () {
                WB.renderLoginPop({func : k, refer : h.refer})
            };
            var t = function () {
                WB.renderOpenPop({func : k, refer : h.refer})
            };
            g && (l = t = function () {
                window.open("http://t.163.com/service/popLogin", "loginwindow", "height=500,width=550,top=" + (screen.height - 280) / 2 + ",left=" + (screen.width - 550) / 2 + ", toolbar=no, menubar=no, scrollbars=no,resizable=yes,location=no, status=no")
            });
            switch (WB.User.loginstate) {
                case "0":
                    return l(), !0;
                case "2":
                    return t(), !0
            }
            return!1
        }};
    f.prototype.showMessage = function (e) {
        var f = this;
        f.errorNode.addCss("userInfo-icon").$("span")[0].innerHTML = e;
        setTimeout(function () {
            f.errorNode.removeCss("userInfo-icon").$("span")[0].innerHTML = "\u53d6\u4e2a\u552f\u4e00\u7684\u540d\u5b57\uff0c\u4ee5\u540e\u53ef\u4ee5\u4fee\u6539"
        }, 1E3);
        f.proccessingNode.innerHTML = ""
    };
    f.prototype.showProccessing = function () {
        this.proccessingNode.innerHTML = "\u5f00\u901a\u4e2d\uff0c\u8bf7\u7a0d\u540e..."
    };
    f.prototype.send = function () {
        var e = this;
        WB.register({userNameVal : e.userNameNode.value.trim(), showMessage : function (f) {
            e.showMessage(f)
        }, showProccessing : function () {
            e.showProccessing()
        }, afterOpen : function () {
            WB.User.init(null, function () {
                WB.UserInfo(e.wrapperElem, {keyfrom : e.refer.keyfrom, method : "op.reg.nickname"})
            });
            WB.log({keyfrom : e.refer.keyfrom, method : "op.reg.nickname"})
        }})
    };
    WB.UserInfo = function (g, h) {
        h = h || {keyfrom : "op.other", special : "op"};
        switch (WB.User.loginstate) {
            case "0":
                g.attr("innerHTML", '           <div class="user-info-wraper">                  <div class="userInfo-desc clearfix">                        <a  target="_self" id="userInfoLogin" href="javascript:;"><em>\u5df2\u7ecf\u6709\u5fae\u535a\u5e10\u53f7\uff01\u73b0\u5728\u767b\u5f55</em></a>                  </div>                 <p class="userInfo-note">\u8fd8\u6ca1\u6709\u5fae\u535a\u5e10\u53f7\uff1f<a class="rect-btn-icon r-silver-btn" id="user-info-login" target="_blank" href="http://t.163.com/signup/login?keyfrom=reg.login"><em>\u5feb\u901f\u6ce8\u518c</em></a></p>           </div>      ');
                new e(g, h);
                break;
            case "1":
                g.style.display = "block";
                WB.User.loginUser.keyfrom = h.special;
                g.attr("innerHTML", $.util.simpleParse('           <div class="user-info-wraper">               <a href="/<#=screen_name#>?f=<#=keyfrom#>.user.pic" target="_blank" title="<#=name#>">                   <img src="<#=profile_image_url#>" alt="<#=name#>" class="thumb"/></a>               <h3 class="fS14">                   <a href="/<#=screen_name#>?f=<#=keyfrom#>.user.name" target="_blank"><#=name#></a></h3>               <p class="userInfo-info">                   <a href="/<#=screen_name#>?f=<#=keyfrom#>.user.button" target="_blank" class="userInfo-viewlink">\u53bb\u6211\u7684\u7f51\u6613\u5fae\u535a\u770b\u770b <em><#=newStatus#></em></em></a>               </p>          </div>       ', WB.User.loginUser));
                break;
            case "2":
                g.attr("innerHTML", $.util.simpleParse('           <div class="user-info-wraper">               <div>                   \u5df2\u7ecf\u767b\u5f55\u7f51\u6613\u901a\u884c\u8bc1\uff1a</div>               <div>                   <em class="user-email"><#=email#></em> <a href="javascript:;" class="cBlue" id="user-change">\u6362\u4e2a\u8d26\u53f7\uff1f</a></div>               <div class="user-nickname">                   <label>\u6635\u79f0\uff1a</label> <input id="info-nickname" type="text"/>               </div>               <div class="message" id="user-error">                  <em class="icon-forbidS"></em><span> \u53d6\u4e00\u4e2a\u552f\u4e00\u7684\u540d\u5b57\uff0c\u4ee5\u540e\u53ef\u4ee5\u6539</span></div>               <div class="btn-wraper">                   <a href="javascript:;"  class="red-btn" id="user-loginBtn">\u5f00\u901a\u5fae\u535a</a><span id="user-proccessing"></span>               </div>           </div>     ', {email : APP.cutString(WB.User.email, 0, 14)})), new f(g, h)
        }
    };
    WB.UserInfoZt = function (e, g) {
        g = g || {keyfrom : "op.other", special : "op"};
        switch (WB.User.loginstate) {
            case "0":
                e.style.display = "none";
                break;
            case "1":
                e.style.display = "block";
                WB.User.loginUser.keyfrom = g.special;
                e.attr("innerHTML", $.util.simpleParse('           <div class="user-info-wraper">               <a href="/<#=screen_name#>?f=<#=keyfrom#>.user.pic" target="_blank" title="<#=name#>">                   <img src="<#=profile_image_url#>" alt="<#=name#>" class="thumb"/></a>               <h3 class="fS14">                   <a href="/<#=screen_name#>?f=<#=keyfrom#>.user.name" target="_blank"><#=name#></a></h3>               <p class="userInfo-info">                   <a href="/<#=screen_name#>?f=<#=keyfrom#>.user.button" target="_blank" class="userInfo-viewlink">\u53bb\u6211\u7684\u7f51\u6613\u5fae\u535a\u770b\u770b <em><#=newStatus#></em></em></a>               </p>          </div>       ', WB.User.loginUser));
                break;
            case "2":
                e.style.display = "block", e.attr("innerHTML", $.util.simpleParse('           <div class="user-info-wraper">               <div>                   \u5df2\u7ecf\u767b\u5f55\u7f51\u6613\u901a\u884c\u8bc1\uff1a</div>               <div>                   <em class="user-email"><#=email#></em> <a href="javascript:;" class="cBlue" id="user-change">\u6362\u4e2a\u8d26\u53f7\uff1f</a></div>               <div class="user-nickname">                   <label>\u6635\u79f0\uff1a</label> <input id="info-nickname" type="text"/>               </div>               <div class="message" id="user-error">                    <em class="icon-forbidS"></em><span> \u53d6\u4e00\u4e2a\u552f\u4e00\u7684\u540d\u5b57\uff0c\u4ee5\u540e\u53ef\u4ee5\u6539</span></div>               <div class="btn-wraper">                   <a href="javascript:;"  class="btn-icon green-btn" id="user-loginBtn"><em>\u5f00\u901a\u5fae\u535a</em></a><span id="user-proccessing"></span>               </div>           </div>     ', {email : APP.cutString(WB.User.email, 0, 12)})), new f(e, g)
        }
    }
})();
WB.Verify = function (e, f) {
    if ($(e)) {
        this.commonCollection = [];
        this.ajaxCollection = [];
        this.func = f || function () {
        };
        var k = this;
        $(e).addEvent("submit", function () {
            return k.commitCheck() == !0 ? (k.func(), !0) : !1
        })
    }
};
WB.Verify.prototype.add = function (e) {
    this.commonCollection.push(e)
};
WB.Verify.prototype.addAjax = function (e) {
    this.ajaxCollection.push(e)
};
WB.Verify.prototype.commitCheck = function () {
    for (var e = [], f = 0; f < this.commonCollection.length; f++)if (!this.commonCollection[f].check()) {
        e.push(this.commonCollection[f]);
        break
    }
    for (f = 0; f < this.ajaxCollection.length; f++)if (!this.ajaxCollection[f].isVerified) {
        e.push(this.ajaxCollection[f]);
        break
    }
    return e.length == 0
};
WB.verifyItem = function (e, f, k) {
    var g = this;
    g.node = $(e);
    g.check = f;
    g.isVerified = !1;
    k && g.node.addEvent(k, function () {
        g.check.apply(g)
    })
};
WB.verifyItemPlus = function (e) {
    var f = this;
    f.options = {node : document.body, clear : function () {
    }, isAutoCheck : !0, isAutoClear : !0, check : function () {
    }, isVerified : !1};
    for (var k in e)f.options[k] = e[k];
    f.isVerified = f.options.isVerified;
    f.node = f.options.node;
    f.check = f.options.check;
    f.options.isAutoCheck == !0 && f.options.node.addEvent("blur", function () {
        f.options.check.apply(f)
    });
    f.options.isAutoClear == !0 && f.options.node.addEvent("focus", function () {
        f.options.clear.apply(f)
    })
};
(function (e) {
    function f(e, f) {
        this._imgUrl = "";
        this.isfirstDel = this.isfirstImg = !0;
        this.sendBoxObj = f;
        this.elem = e;
        this.uploadImgTpl = '      <form class="uploadImgForm" enctype="multipart/form-data" method="post" target="imageUploadIframe<#=num#>" action="http://upload.buzz.163.com/upload">          <input class="uploadFile" type="file" title="\u652f\u6301jpg\u3001jpeg\u3001gif\u3001png\u683c\u5f0f" name="pic" />          <input type="hidden" name="callback" value="uploadObjHash[\'<#=num#>\'].uploadComplete" />          <input type="hidden" value="t.163.com/" name="watermark">      </form>      <iframe style="display:none" src="about:blank" name="imageUploadIframe<#=num#>" id="imageUploadIframe<#=num#>"></iframe>      <div class="uploadPic-stat hidden">          <table class="winlayer-table">            <tbody>              <tr>                <td class="winlayer-top-left">                </td>                <td class="winlayer-top-center">                   <em class="winlayer-arrow"></em>                </td>                <td class="winlayer-top-right">                </td>              </tr>              <tr>                <td class="winlayer-middle-left">                </td>                <td class="winlayer-middle-center">                   <span class="uploadPic-loadingImg hidden">                      <span class="icon-loading"></span>\u6b63\u5728\u4e0a\u4f20                   </span>                   <span class="uploadPic-successImg hidden">                      <span class="uploadPic-imgName"></span>                      <a class="uploadPic-deleteImg"  title="\u5220\u9664\u8fd9\u5f20\u56fe\u7247" href="javascript:void(0)">\u5220\u9664</a>                      <span class="uploadPic-uploadedImg hidden"></span>                   </span>                </td>                <td class="winlayer-middle-right">                </td>              </tr>              <tr>                <td class="winlayer-bottom-left">                </td>                <td class="winlayer-bottom-center">                </td>                <td class="winlayer-bottom-right">                </td>              </tr>           </tbody>         </table>       </div>';
        this.init()
    }

    function k() {
        this.url = "/service/getNewEmotion.do"
    }

    function g() {
    }

    function h() {
        this.sendBoxObj = null;
        this.isRender = this.isMutiSelect = !1;
        this.emotionTemp = '                 <table class="winlayer-table">                  <tbody>                    <tr>                      <td class="winlayer-top-left">                      </td>                      <td class="winlayer-top-center">                        <em class="winlayer-arrow-default" id="emotionArrow"></em>                      </td>                      <td class="winlayer-top-right">                      </td>                   </tr>                   <tr>                      <td class="winlayer-middle-left">                      </td>                      <td class="winlayer-middle-center">                        <div class="winlayer-con clearfix">                            <div class="winlayer-titleBar">                                <ul class="insertFace-title" id="emotionTab"><li class="current first"><strong type="common">\u5e38\u7528</strong></li><li><strong type="cartoon">\u5361\u901a</strong></li></ul>                                <a href="javascript:;" class="dialogLayer-close js-close" id="emotionClose" title="\u5173\u95ed"></a>                            </div>                            <p class="insertFace-tip">                                \u63d0\u793a\uff1a\u6309\u4f4fctrl\u952e\u5373\u53ef\u4e00\u6b21\u9009\u4e2d\u591a\u4e2a\u8868\u60c5</p>                               <div id="tempWraper">                                  <div id="commonTemp">                                  </div>                                  <div id="cartoonTemp" style="display:none;">                                  </div>                               </div>                            <div class="insertFace-ft" style="display: none;" id="emotionPager">                                <div class="emotion-pager-wraper">                                    <ul class="pages clearfix">                                    </ul>                                </div>                            </div>                            <p class="data-loading" id="emotionLoadding">\u6b63\u5728\u52a0\u8f7d\u8868\u60c5\uff0c\u8bf7\u7a0d\u7b49...</p>                         </div>                     </td>                     <td class="winlayer-middle-right">                     </td>                 </tr>                 <tr>                    <td class="winlayer-bottom-left">                    </td>                    <td class="winlayer-bottom-center">                    </td>                    <td class="winlayer-bottom-right">                    </td>                 </tr>               </tbody>             </table>';
        this.commonTemp = '               <div class="insertFace-content" style="display: block;">                 <ul class="insertFace-item insertFace-item-hot">                    <li class="insertFace-item-full insertFace-item-r">                           <ul class="emotion-con">                              <#=hotfaceTemp#>                           </ul>                    </li>                 </ul>                 <ul class="insertFace-item">                    <li class="insertFace-item-full insertFace-item-r">                            <ul class="emotion-con">                               <#=commonfaceTemp#>                            </ul>                    </li>                 </ul>               </div>';
        this.cartoonTemp = '               <div class="insertFace-content insertFace-content-cartooon" style="display: block;">                         <#=singleCartoonTemp#>                </div>';
        this.singleCartoonTemp = '                 <ul class="insertFace-item insertFace-item-cartoon">                     <li class="insertFace-item-l"><#=catName#></li>                     <li class="insertFace-item-r">                           <ul class="emotion-con">                               <#=faceTemp#>                           </ul>                     </li>                 </ul>';
        this.faceTemp = '<li title="<#=faceName#>"><img alt="<#=faceName#>"  src="<#=faceSrc#>"></li>'
    }

    function m(e, f, g) {
        this.constructor = arguments.callee;
        this.$textAreaElem = e;
        this._autoHeight = typeof f !== "undefined" ? !0 : !1;
        this._miniHeight = e.height();
        this._maxHeight = g || 0;
        this.init()
    }

    function n(e) {
        this.areaNode = $(e);
        this.nodeCollection = [];
        this.isShow = !1;
        this.ul = document.createElement("ul");
        this.ul.className = "atSuggest-list";
        document.body.appendChild(this.ul);
        n.probe ? this.probeElem = n.probe : (this.probeElem = document.createElement("div"), this.probeElem.innerHTML = '<pre style="display:inline;word-wrap:break-word;"></pre><span>@</span>', document.body.appendChild(this.probeElem), n.probe = this.probeElem);
        if (!n.instance)$(document.body).addEvent("mousedown", function (e) {
            (e.target || e.srcElement).className != "atSuggest-list" && n.current && setTimeout(function () {
                n.current.hide()
            }, 500)
        }), n.instance = !0;
        this.lineHeight = Math.max(parseInt($(this.areaNode).css("lineHeight")), 12);
        var e = $(this.probeElem).$("pre").$(0), f = $(this.probeElem).$("span").$(0);
        $(this.probeElem).addCss({"text-align" : "left", position : "absolute", visibility : "hidden", top : "0", left : "0", width : $(this.areaNode).width() + "px", "line-height" : this.lineHeight + "px", "padding-top" : $(this.areaNode).css("paddingTop"), "padding-right" : $(this.areaNode).css("paddingRight"), "padding-left" : $(this.areaNode).css("paddingLeft"), "padding-bottom" : $(this.areaNode).css("paddingBottom")});
        e.addCss({"font-size" : $(this.areaNode).css("fontSize"), "font-family" : $(this.areaNode).css("fontFamily"), "font-weight" : $(this.areaNode).css("fontWeight"),
            "white-wrap" : $(this.areaNode).css("word-wrap"), "word-break" : $(this.areaNode).css("word-break"), "white-space" : $(this.areaNode).css("white-space")});
        f.addCss({"font-size" : $(this.areaNode).css("fontSize"), "font-family" : $(this.areaNode).css("fontFamily"), "font-weight" : $(this.areaNode).css("fontWeight")});
        this.bindEvent()
    }

    f.prototype.init = function () {
        var e = this, f = document.createElement("div"), g = (new Date).getTime().toString();
        f.innerHTML = $.util.parseTpl(e.uploadImgTpl, {num : g});
        e.elem.appendChild(f);
        uploadObjHash[g] = e;
        e.uploadFormElem = $(f).$(".uploadImgForm").$(0);
        e.uploadPicStat = $(f).$(".uploadPic-stat").$(0);
        e.uploadBtnElem = $(f).$("input").$(0);
        e.waterMarkElem = $(f).$("input").$(2);
        e.loadingImgElem = $(f).$(".uploadPic-loadingImg").$(0);
        e.successImgElem = $(f).$(".uploadPic-successImg").$(0);
        e.deleteImgElem = $(f).$(".uploadPic-deleteImg").$(0);
        e.imgNameElem = $(f).$(".uploadPic-imgName").$(0);
        e.uploadedImgElem = $(f).$(".uploadPic-uploadedImg").$(0);
        e.uploadBtnElem.addEvent("change", function () {
            e.upload()
        });
        e.deleteImgElem.addEvent("click", function () {
            e.isfirstDel == !1 ? e.sendBoxObj.deleteUrl(e._imgUrl) : (e.sendBoxObj._imageUrl = "", e.isfirstImg = !0);
            e.hideUploadStat()
        });
        document.domain = "163.com"
    };
    f.prototype.upload = function () {
        var e = this.uploadBtnElem.value;
        if (!"jpg,jpeg,gif,png".hasString(e.substring(e.lastIndexOf(".") + 1, e.length).toLowerCase()))return alert("\u4ec5\u652f\u6301jpg\u3001jpeg\u3001gif\u3001png\u683c\u5f0f"), !1;
        this.showUploadStat();
        this.waterMarkElem.value = "t.163.com/" + WB.User.screenName;
        this.uploadFormElem.submit()
    };
    f.prototype.showUploadStat = function () {
        this.uploadPicStat.removeCss("hidden");
        this.loadingImgElem.removeCss("hidden");
        this.successImgElem.addCss("hidden")
    };
    f.prototype.uploadComplete = function (e) {
        var f = this.uploadBtnElem.value, g = parseInt(e.status);
        g == 1 ? (this.hideUploadStat(), alert("\u5bf9\u4e0d\u8d77\uff0c\u4e0a\u4f20\u7684\u6587\u4ef6\u4e0d\u80fd\u5c0f\u4e8e1k")) : g == 2 ? (this.hideUploadStat(), alert("\u5bf9\u4e0d\u8d77\uff0c\u4e0a\u4f20\u7684\u6587\u4ef6\u4e0d\u80fd\u5927\u4e8e20M")) : g == 3 ? (this.hideUploadStat(), alert("\u670d\u52a1\u5668\u7e41\u5fd9\uff0c\u8bf7\u7a0d\u540e\u518d\u91cd\u65b0\u4e0a\u4f20")) : (this._imgUrl = e.originalURL, this.isfirstImg == !1 ? (this.sendBoxObj.gotoTextPos(this.sendBoxObj.$textAreaElem, " " + this._imgUrl + " "), this.isfirstDel = !1) : (this.sendBoxObj._imageUrl = this._imgUrl, this.sendBoxObj.$textAreaElem.value.trim() == "" && this.sendBoxObj.gotoTextPos(this.sendBoxObj.$textAreaElem, "\u5206\u4eab\u56fe\u7247")), this.imgNameElem.innerHTML = f.replace(/(?:.*?)([^\/|\\]*?)(\.jpg|\.jpeg|\.gif|\.bmp|\.png)$/i, function (e, f, g) {
            return APP.countCharacters(f, 20) + g
        }), this.uploadedImgElem.removeCss("hidden").innerHTML = "<img src='" + WB.oimage({width : 120, height : 120, url : encodeURIComponent(this._imgUrl)}) + "'/>", this.loadingImgElem.addCss("hidden"), this.successImgElem.removeCss("hidden"), this.isfirstImg = !1)
    };
    f.prototype.hideUploadStat = function () {
        this.uploadFormElem.reset();
        this.uploadPicStat.addCss("hidden");
        this.successImgElem.addCss("hidden")
    };
    e.uploadObjHash = {};
    WB.widget.sendBox.UploadImg = f;
    k.prototype.getEmotion = function (e, f) {
        APP.ajaxSend({requestUrl : this.url, dataType : "json", success : function (f) {
            e(f)
        }, error : function () {
            f("\u5f88\u62b1\u6b49\uff0c\u670d\u52a1\u5668\u51fa\u9519!!!")
        }})
    };
    g.prototype.getEmotion = function () {
        var e = this;
        e.model.getEmotion(function (f) {
            e.renderer.renderEmotion(f)
        }, function (f) {
            e.renderer.showError(f)
        })
    };
    h.prototype.init = function () {
        var e = document.createElement("div");
        e.className = "winlayer insertFaceWin";
        e.innerHTML = this.emotionTemp;
        this.facePanel = e;
        document.body.appendChild(this.facePanel);
        this.commonTempNode = $("#commonTemp");
        this.cartoonTempNode = $("#cartoonTemp");
        this.emotionPager = $("#emotionPager");
        this.tempWraper = $("#tempWraper");
        this.emotionClose = $("#emotionClose");
        this.emotionPager = $("#emotionPager");
        this.pager = this.emotionPager.$("ul").$(0);
        this.emotionArrow = $("#emotionArrow");
        this.emotionLoadding = $("#emotionLoadding");
        this.controller.getEmotion()
    };
    h.prototype.renderEmotion = function (e) {
        this.emotionLoadding.style.display = "none";
        this.emotionData = e;
        this.bind();
        this.renderCommon()
    };
    h.prototype.showError = function (e) {
        this.emotionLoadding.style.display = "none";
        this.commonTempNode.innerHTML = e;
        this.controller.getEmotion()
    };
    h.prototype.bind = function () {
        var e = this;
        new WB.Tab({className : "current",
            tabCollection : $("#emotionTab").$("li"), func : function () {
                if ($(this).$("strong")[0].getAttribute("type") == "common")e.cartoonTempNode.style.display = "none", e.commonTempNode.style.display = "block", e.emotionPager.style.display = "none"; else {
                    e.cartoonTempNode.style.display = "block";
                    e.commonTempNode.style.display = "none";
                    if (e.emotionData.cartoon.length > 3)e.emotionPager.style.display = "block";
                    if (!e.isRender)e.renderCartoon(), e.isRender = !0
                }
            }});
        e.tempWraper.addEvent("click", function (f) {
            f = f.target || f.srcElement;
            switch (f.tagName.toLowerCase()) {
                case "img":
                    e.setEmotion(f.parentNode.title);
                    break;
                case "li":
                    var g = $(f).$("img"), h = $(f).$("ul");
                    g.length > 0 && h.length == 0 && e.setEmotion(f.title)
            }
        });
        $(document.body).addEvent("mousedown", function (f) {
            APP.bubbleNodeNe(f.target || f.srcElement, function (e) {
                if (APP.isHasClassName(e, "js-face") || APP.isHasClassName(e, "insertFaceWin"))return!0;
                return!1
            }, function () {
                e.facePanel.style.display = "none"
            })
        });
        $(document.body).addEvent("keydown", function (f) {
            if (f.keyCode == 17)e.isMutiSelect = !0
        }).addEvent("keyup", function (f) {
            if (f.keyCode == 17)e.isMutiSelect = !1
        });
        e.emotionClose.addEvent("click", function () {
            e.facePanel.style.display = "none"
        })
    };
    h.prototype.renderCommon = function () {
        for (var e = [], f = [], g = this.emotionData.common, h = this.emotionData.hot, k = 0; k < g.length; k++)f.push($.util.parseTpl(this.faceTemp, {faceName : g[k][0], faceSrc : g[k][1]}));
        for (k = 0; k < h.length; k++)e.push($.util.parseTpl(this.faceTemp, {faceName : h[k][0], faceSrc : h[k][1]}));
        this.commonTempNode.innerHTML = $.util.parseTpl(this.commonTemp, {hotfaceTemp : e.join(""), commonfaceTemp : f.join("")})
    };
    h.prototype.setEmotion = function (e) {
        var f = APP.getSelectPos(this.sendBoxObj.$textAreaElem);
        this.sendBoxObj.textAreaObj.replaceSelectedText("");
        this.sendBoxObj.textAreaObj.appendTextOnCursor("[" + e + "]", f);
        if (!this.isMutiSelect)this.facePanel.style.display = "none"
    };
    h.prototype.renderCartoon = function () {
        var e = this, f = e.emotionData.cartoon, g = new e.Pager({itemCount : f.length, size : 3, maxButtons : 3});
        g.staticDataCollection = f;
        g.onclick = function (f) {
            for (var f = this.getStaticData(f), g = [], h = 0; h < f.length; h++) {
                var k = [];
                for (j = 0; j < f[h].emotions.length; j++)k.push($.util.parseTpl(e.faceTemp, {faceName : f[h].emotions[j][0],
                    faceSrc : f[h].emotions[j][1]}));
                g.push($.util.parseTpl(e.singleCartoonTemp, {catName : f[h].catName, faceTemp : k.join("")}))
            }
            e.cartoonTempNode.innerHTML = $.util.parseTpl(e.cartoonTemp, {singleCartoonTemp : g.join("")})
        };
        g.render(e.pager);
        g.onclick(1)
    };
    h.prototype.resetPos = function (e, f) {
        if (e) {
            var g = this.getWidth(document.body), h = APP.getAbsPosition(f);
            g - h.x + 70 - 461 < 0 ? (this.facePanel.style.left = h.x - 391 + "px", this.emotionArrow.style.left = "391px") : (this.facePanel.style.left = h.x - 70 + "px", this.emotionArrow.style.left = "70px");
            this.facePanel.style.top = h.y + 22 + "px"
        } else this.facePanel.style.left = "-70px", this.emotionArrow.style.left = "70px", this.facePanel.style.top = "22px"
    };
    h.prototype.getWidth = function (e) {
        return e.offsetWidth
    };
    h.prototype.Pager = WB.PagerView.extend({render : function (e) {
        this.container = this.wraperId = e;
        this._calculate();
        for (var e = "", f = this._start; f <= this._end; f++)e += f == this.options.index ? f == 1 && this.options.pageCount == 1 ? "" : '<li class="page-number pgCurrent"><a href="javascript://' + f + '">' + f + "</a></li>" : '<li class="page-number"><a href="javascript://' + f + '">' + f + "</a></li>";
        this.container.innerHTML = e;
        this.bind()
    }});
    var r = null;
    APP.showFace = function (e, f, m, n) {
        r || (r = new MCR(g, k, h));
        m = m.target || m.srcElement;
        n = n || !1;
        APP.bubbleNodeNe(m, function (e) {
            if (APP.isHasClassName(e, "insertFaceWin"))return!0;
            return!1
        }, function () {
            n ? document.body.appendChild(r.render.facePanel) : e.appendChild(r.render.facePanel);
            r.render.facePanel.style.display = "block";
            r.render.sendBoxObj = f;
            r.render.resetPos(n, e)
        })
    };
    m.prototype = {_isSelected : !1, _selectedTxt : null, _autoHeightTimer : null,
        _timer : null, init : function () {
            this.bindEvent()
        }, bindEvent : function () {
            var e = this, f = function () {
                e._timer && clearTimeout(e._timer);
                e._timer = setTimeout(function () {
                    e.triggerEvent()
                }, 50)
            };
            e.$textAreaElem.addEvent("keyup", f);
            e.$textAreaElem.addEvent("keydown", f);
            e.$textAreaElem.addEvent("mouseup", f);
            e.$textAreaElem.addEvent("mousemove", f);
            e.$textAreaElem.addEvent("mousedown", f);
            e._autoHeight && e.$textAreaElem.addEvent("keyup", e.setHeight.bind(e))
        }, triggerEvent : function () {
            try {
                var e = APP.selectedText(this.$textAreaElem), f = APP.getCursorSelection(this.$textAreaElem);
                this._startCursorPos = f.start;
                e === "" ? this._isSelected = !1 : (this._isSelected = !0, this._endCursorPos = f.end)
            } catch (g) {
            }
        }, appendTextOnCursor : function (e, f) {
            var g = this._startCursorPos, g = f || g;
            this.$textAreaElem.focus();
            APP.setCursorTo(this.$textAreaElem, g);
            APP.insertText(this.$textAreaElem, e, g);
            this.triggerEvent()
        }, appendText : function (e) {
            this.appendTextOnCursor(e, this.$textAreaElem.value.length)
        }, replaceSelectedText : function (e) {
            var f = this.$textAreaElem, e = e || "";
            this._isSelected ? (APP.selectText(f, this._startCursorPos, this._endCursorPos), APP.replaceSelectedText(f, e, this._startCursorPos, this._endCursorPos)) : APP.insertText(f, e, this._startCursorPos)
        }, setHeight : function () {
            var e = this;
            e.$temptextAreaElem || e.createTempTextArea();
            e.$temptextAreaElem.value = e.$textAreaElem.value;
            var f = parseFloat(e.$temptextAreaElem.scrollHeight);
            f > e._miniHeight ? f > e._maxHeight ? (e.$textAreaElem.style.height = e._maxHeight + "px", e.$textAreaElem.style.overflowY = "auto") : (e._autoHeightTimer && clearTimeout(e._autoHeightTimer), e._autoHeightTimer = setTimeout(function () {
                if (f < e._miniHeight)f = e._miniHeight;
                e.$textAreaElem.style.height = f + "px";
                e.$textAreaElem.style.overflowY = "hidden"
            }, 20)) : (e.$textAreaElem.style.height = e._miniHeight + "px", e.$textAreaElem.style.overflowY = "hidden")
        }, createTempTextArea : function () {
            var e = this.$textAreaElem.scrollWidth;
            if ($("#textarea_" + e))this.$temptextAreaElem = $("#textarea_" + e); else {
                var f = $(document.createElement("TEXTAREA"));
                f.id = "textarea_" + e;
                f.style.width = e + "px";
                f.style.height = "0px";
                f.style.position = "absolute";
                f.style.top = "-10000px";
                f.style.height = "0px";
                f.style.overflow = "hidden";
                this.$temptextAreaElem = f;
                document.body.appendChild(f)
            }
        }};
    WB.widget.sendBox.TextArea = m;
    n.reg = /([@\uff20])([\u4e00-\u9fa5a-zA-Z0-9]{0,24}$)/g;
    n.data = {};
    n.instance = !1;
    n.prototype.bindEvent = function () {
        var e = this;
        e.areaNode.addEvent("blur", function () {
            e.stimer = setTimeout(function () {
                e.hide()
            }, 500)
        }).addEvent("click", function (f) {
            e.search(f)
        }).addEvent("keyup", function (f) {
            f.keyCode !== 16 && (e.isShow && e.dirEvent(f), e.search(f))
        }).addEvent("keydown", function (f) {
            if ((f.keyCode == 40 || f.keyCode == 38 || f.keyCode == 13) && e.isShow)return!1
        });
        $(e.ul).addEvent("click", function (f) {
            f = f.target || f.srcElement;
            switch (f.tagName.toLowerCase()) {
                case "a":
                    f = f.getAttribute("key");
                    e.select(f);
                    break;
                case "b":
                    f = f.parentNode.getAttribute("key"), e.select(f)
            }
        });
        $(e.ul).addEvent("mousedown", function () {
            setTimeout(function () {
                e.stimer && clearTimeout(e.stimer)
            }, 300)
        })
    };
    n.prototype.dirEvent = function (e) {
        if (e.keyCode == 40) {
            this._index++;
            if (this._index + 1 > this.nodeNum)this._index = 0;
            this.down()
        } else if (e.keyCode == 38) {
            this._index--;
            if (this._index < 0)this._index = this.nodeNum - 1;
            this.up()
        } else e.keyCode == 13 && this.select(this.currentNode.getAttribute("key"))
    };
    n.prototype.down = function () {
        if (this.nodeNum != 0) {
            if (this._index == -1) {
                var e = this.nodeCollection.$(0);
                e.addCss("current");
                this.currentNode = e;
                this._index = 0
            } else this.currentNode.removeCss("current"), e = this.nodeCollection.$(this._index), e.addCss("current"), this.currentNode = e;
            this.ul.scrollTop = this.calcu()
        }
    };
    n.prototype.up = function () {
        if (this.nodeNum != 0) {
            if (this._index == -1) {
                var e = this.nodeCollection.$(this.nodeNum - 1);
                e.addCss("current");
                this.currentNode = e;
                this._index = this.nodeNum - 1
            } else this.currentNode.removeCss("current"), e = this.nodeCollection.$(this._index), e.addCss("current"), this.currentNode = e;
            this.ul.scrollTop = this.calcu()
        }
    };
    n.prototype.calcu = function () {
        var e = 0;
        this.h > 210 && (e = Math.max(1, this._index + 1) / this.nodeNum * this.h - 210);
        return Math.max(0, e)
    };
    n.prototype.select = function (e) {
        var f = this.areaNode.value, g = f.slice(0, this.insertPosition), f = f.slice(this.insertPosition), h = g.lastIndexOf("@") + 1;
        this.areaNode.value = g.slice(0, h) + e + " " + f;
        APP.focus(this.areaNode);
        APP.setCursorTo(this.areaNode, h + e.length + 1);
        this.hide()
    };
    n.prototype.search = function (e) {
        if (WB.User.logined) {
            var f = this;
            if (!(e.keyCode == 40 || e.keyCode == 38 || e.keyCode == 13 || e.keyCode == 9)) {
                f.timer && clearTimeout(f.timer);
                f.insertPosition = APP.getSelectPos(f.areaNode);
                var g = f.areaNode.value.slice(0, f.insertPosition), e = g.match(n.reg);
                if (e !== null) {
                    var h = e[0].substr(1);
                    f.delay(function () {
                        n.data[h] ? f.render(n.data[h], g, h) : APP.ajaxSend({requestUrl : "/service/at.do", method : "GET", param : {key : h}, dataType : "json", success : function (e) {
                            f.render(e, g, h)
                        }})
                    }, 500)
                } else f.hide()
            }
        }
    };
    n.prototype.getPos = function (e, f) {
        var g = e.length, h = $(this.probeElem).$("span").$(0);
        $(this.probeElem).$("pre").$(0).innerHTML = e.slice(0, g - 1 - f.length) + "@";
        g = APP.getAbsPosition(h);
        h = APP.getAbsPosition(this.areaNode);
        return{x : h.x + g.x, y : h.y + g.y + this.lineHeight}
    };
    n.prototype.render = function (e, f, g) {
        for (var h = e.atResults, k = h.length, m = [], r = 0; r < k; r++)m.push("<li><a key='" + h[r].nickName + "' href='javascript:;'>" + h[r].matchedName + "</a></li>");
        this.ul.innerHTML = m.join("");
        f = this.getPos(f, g);
        this.ul.style.left = f.x + "px";
        this.ul.style.top = f.y + "px";
        if (k == 0)this.hide(); else {
            this.show();
            this.h = k = $(this.ul).height();
            if (k > 210)this.ul.style.height = "210px";
            this.nodeCollection = $(this.ul).$("a");
            this.nodeNum = this.nodeCollection.length;
            this.nodeCollection.$(0).addCss("current");
            this.currentNode = this.nodeCollection.$(0);
            this._index = 0
        }
        n.data[g] = e;
        n.current = this
    };
    n.prototype.delay = function (e, f) {
        this.timer = setTimeout(function () {
            e()
        }, f)
    };
    n.prototype.show = function () {
        this.ul.style.height = "auto";
        this.ul.style.display = "block";
        this.isShow = !0;
        this.ul.scrollTop = 0
    };
    n.prototype.hide = function () {
        this.ul.style.display = "none";
        this.isShow = !1
    };
    WB.widget.sendBox.At = n
})(window);
(function () {
    WB.widget.sendBox.SendBox = WB.widget.sendBox.BasicSendBox.extend({init : function (e, f, k, g) {
        var h = !0;
        arguments.length == 3 && (h = k);
        this._super(e, f, h);
        this.$uploadPicElem = $(e.$(".js-pic")[0]);
        this.$uploadPicInsertFlashElem = $(e.$(".flashContainer")[0]);
        this.$uploadFaceElem = $(e.$(".js-face")[0]);
        this.$insertTopicElem = $(e.$(".js-topic")[0]);
        this.$lbsBoxElem = $(e.$(".js-position")[0]);
        this.statusListObj = g
    }, _defaultTopic : "#\u5728\u8fd9\u91cc\u8f93\u5165\u4f60\u8c08\u8bba\u7684\u8bdd\u9898\u540d\u79f0#",
        renderHandler : function () {
            var e = this;
            e._super();
            e.$uploadPicElem && e.initUploadPic();
            e.$uploadFaceElem && e.$uploadFaceElem.addEvent("click", function (f) {
                APP.showFace(e.$uploadFaceElem, e, f)
            });
            e.$insertTopicElem && e.initInsertTopic()
        }, initUploadPic : function () {
            var e = new WB.widget.sendBox.UploadImg(this.$uploadPicElem, this);
            this.uploadPicObj = e;
            this.$uploadPicStatElem = e.uploadPicStat
        }, initInsertTopic : function () {
            var e = this;
            e.$insertTopicElem.addEvent("click", function () {
                e.insertTopic()
            })
        }, insertTopic : function () {
            var e = this._defaultTopic, f = APP.selectedText(this.$textAreaElem), k = f !== "" ? "#" + f + "#" : "";
            end = start = 0;
            this.$textAreaElem.focus();
            f !== "" && this._defaultTopic !== k && (this.textAreaObj.replaceSelectedText(k), e = k);
            f = this.$textAreaElem.value.indexOf(e);
            f === -1 && this.textAreaObj.appendTextOnCursor(e);
            f = this.$textAreaElem.value.replace(/\r/g, "").indexOf(e);
            e = e.length;
            f === -1 ? (start = cursorX + 1, end = cursorX + e - 1) : (start = f + 1, end = f + e - 1);
            APP.selectText(this.$textAreaElem, start, end);
            this.textAreaObj.triggerEvent()
        }, deleteUrl : function (e) {
            this.$textAreaElem.value = this.$textAreaElem.value.trim().replace(RegExp(e, "gi"), function () {
                return""
            });
            this.countTips()
        }, successAction : function (e) {
            var f = this;
            f.$textAreaElem.value = "";
            f.$sendInfoTipElem.attr("innerHTML", '<em class="cDRed">\u53d1\u5e03\u6210\u529f</em>').addCss("opacity:0");
            f.$sendInfoTipElem.animate({opacity : 1}, 0.7, "linear", function () {
                APP.removeOpacity(f.$sendInfoTipElem);
                f.countTips()
            });
            f.statusListObj && f.statusListObj.addNewStatus(e)
        }});
    WB.widget.sendBox.Popup_SendBox = WB.widget.sendBox.SendBox.extend({init : function (e, f, k, g) {
        this._super(e, f);
        this.winObj = k;
        this.options = {source : "\u7f51\u6613\u5fae\u535a", url : "", audit : {method : "no", keyfrom : "no"}, imageUrl : "", linkUrl : "", success : function () {
        }};
        for (var h in g)this.options[h] = g[h];
        if (this.options.linkUrl != "")this._maxLen = this._urlInclude - 24
    }, sendInfo : function () {
        var e = this, f = e.$textAreaElem.value.trim();
        if (e.checkAction() && e._isRequest != !0) {
            var f = {status : f + " " + e.options.linkUrl, source : encodeURIComponent(e.options.source), imageUrl : e.options.imageUrl}, k;
            for (k in e.options.audit)f[k] = e.options.audit[k];
            APP.ajaxSend({requestUrl : e.options.url, method : "post", param : f, dataType : "json", success : function (f) {
                f.state != "2" ? (e.showTip('<span class="cDRed">\u53d1\u5e03\u6210\u529f\uff01</span>'), setTimeout(function () {
                    e.successAction(f)
                }, 500), WB.log(e.options.audit)) : e.showTip('<em class="cDRed">\u53d1\u5e03\u76f8\u4f3c\u5185\u5bb9\u8fc7\u591a\u3002</em>');
                setTimeout(function () {
                    e._isRequest = !1
                }, 100)
            }});
            return!1
        }
    }, successAction : function (e) {
        var f = this;
        f.$textAreaElem.value = "";
        setTimeout(function () {
            f.winObj && (f.winObj.hide(), f.options.success(e))
        }, 250)
    }});
    WB.widget.sendBox.PopupR_SendBox = WB.widget.sendBox.SendBox.extend({init : function (e, f, k, g) {
        this._super(e, f);
        this.winObj = k;
        this.options = {url : "", param : {keyfrom : "no"}, success : function () {
        }, isRetweet : 2, _id : ""};
        for (var h in g)this.options[h] = g[h]
    }, sendInfo : function () {
        var e = this, e = this, f = e.$textAreaElem.value.trim();
        if (e.options.isRetweet == 2) {
            if (f != "" && !e.checkAction())return
        } else if (!e.checkAction())return;
        if (!e._isRequest) {
            e._isRequest = !0;
            var f = {requestUrl : e.options.url,
                method : "POST", dataType : "json", param : {content : f, targetId : e.options._id, isRetweet : e.options.isRetweet, isReplyToIt : 0, isReplyToRoot : 0, flag : 1, method : "retweet"}, success : function (f) {
                    e.successAction(f);
                    setTimeout(function () {
                        e._isRequest = !1
                    }, 100)
                }, error : function () {
                    e.showTip('<span class="cDRed">\u53d1\u9001\u5931\u8d25\uff01</span>');
                    setTimeout(function () {
                        e._isRequest = !1
                    }, 100)
                }}, k;
            for (k in e.options.param)f.param[k] = e.options.param[k];
            APP.ajaxSend(f)
        }
    }, successAction : function (e) {
        var f = this;
        f.$textAreaElem.value = "";
        f.showTip('<span class="cDRed">\u53d1\u9001\u6210\u529f\uff01</span>');
        setTimeout(function () {
            f.winObj && (f.winObj.hide(), f.options.success(e))
        }, 1E3)
    }});
    WB.widget.sendBox.Popup_SendMessageBox = WB.widget.sendBox.SendBox.extend({init : function (e, f, k) {
        this._super(e);
        this.winObj = f;
        this.userName = k
    }, sendInfo : function () {
        var e = this.$textAreaElem.value.trim();
        this.checkAction() && this._isRequest != !0 && APP.ajaxSend({requestUrl : "/direct_messages/new.json", success : this.success, error : this.error, method : "POST", param : {text : e,
            user : this.userName}})
    }, success : function () {
        var e = this;
        e.clear();
        e.showTip = "\u53d1\u9001\u6210\u529f\uff01";
        e._isRequest = !1;
        setTimeout(function () {
            e.winObj.hide()
        }, 1E3)
    }, error : function () {
        var e = this;
        setTimeout(function () {
            e._isRequest = !1
        }, 100)
    }})
})(window);
(function () {
    WB.widget.sendBox.ReplySendBox = WB.widget.sendBox.BasicSendBox.extend({init : function (e, f, k, g) {
        this.statusObj = e;
        this.talkBoxObj = e.talkBoxObj;
        e = this.talkBoxObj.sendAreaObj.$wrapperElem;
        this.$uploadFaceElem = e.$(".js-face").$(0);
        this.$isRetweetElem = e.$("input[name=isRetweet]").$(0);
        this.$isReplyRootElem = e.$("input[name=replyRoot]").$(0);
        this._replyId = k || 0;
        this.param = g;
        this._super(e, f, !0);
        this.screenName = this.quoteText = ""
    }, _actionTitle : "\u8bc4\u8bba", _autoHeight : !0, _maxHeight : 116, renderHandler : function () {
        var e = this;
        e._super();
        e.$uploadFaceElem && e.$uploadFaceElem.addEvent("click", function (f) {
            APP.showFace(e.$uploadFaceElem, e, f, !0)
        })
    }, sendInfo : function () {
        var e = this;
        e.countTips();
        if (e.checkAction()) {
            var f = {requestUrl : e.param.url, param : {content : e.$textAreaElem.value.trim(), enableEmotions : 1, targetId : e.statusObj._id, isReplyToIt : 1, isReplyToRoot : e.$isReplyRootElem && e.$isReplyRootElem.checked ? "1" : "0", isRetweet : e.$isRetweetElem.checked ? "1" : "0", replyOriginContent : e.quoteText, screenName : e.screenName, flag : 2, keyfrom : "no",
                method : "reply", special_site : "no", sitechannel : "no", ztsite : "no"}, callBack : function (f) {
                e.successAction(f)
            }}, k;
            for (k in e.param.extra)f.param[k] = e.param.extra[k];
            k = e.statusObj.statusListObj;
            if (k.log && k.log._reply)f.requestUrl = f.requestUrl + "?" + k.log._reply;
            e.sendAction(f)
        }
    }, successAction : function (e) {
        this._super();
        if (this.statusObj._replyNum == 0)this.talkBoxObj.replyStatusListObj.$bodyElem.addCss("display:block"), this.talkBoxObj.$shrinkElem.style.display = "";
        this.statusObj.setNewNum(++this.statusObj._replyNum, "reply");
        this.statusObj.setArrowPos(this.statusObj.$replyElem, this.statusObj.talkBoxObj.$arrowElem);
        this.talkBoxObj.replyStatusListObj.addNewStatus(e);
        this.quoteText = "";
        this.statusObj._id = this._replyId;
        this.param.callBack()
    }});
    WB.widget.sendBox.RetweetSendBox = WB.widget.sendBox.BasicSendBox.extend({init : function (e, f, k, g) {
        this.statusObj = e;
        this.talkBoxObj = e.talkBoxObj;
        e = this.talkBoxObj.sendAreaObj.$wrapperElem;
        this.$uploadFaceElem = e.$(".js-face").$(0);
        this.$isReplyElem = e.$("input[name=isReply]").$(0);
        this.$isReplyRootElem = e.$("input[name=replyRoot]").$(0);
        this._replyId = k || 0;
        this.param = g;
        this._super(e, f, !0)
    }, _actionTitle : "\u8f6c\u53d1", _autoHeight : !0, _maxHeight : 116, renderHandler : function () {
        var e = this;
        e._super();
        e.$uploadFaceElem && e.$uploadFaceElem.addEvent("click", function (f) {
            APP.showFace(e.$uploadFaceElem, e, f, !0)
        })
    }, sendInfo : function () {
        var e = this;
        e.countTips();
        if (e.checkAction()) {
            var f = {requestUrl : e.param.url, param : {content : e.$textAreaElem.value.trim(), targetId : e._replyId, isReplyToIt : e.$isReplyElem.checked ? "1" : "0", isReplyToRoot : e.$isReplyRootElem && e.$isReplyRootElem.checked ? "1" : "0", isRetweet : 2, flag : 1, keyfrom : "no", method : "retweet", special_site : "no", sitechannel : "no", ztsite : "no"}, callBack : function (f) {
                e.successAction(f)
            }}, k;
            for (k in e.param.extra)f.param[k] = e.param.extra[k];
            k = e.statusObj.statusListObj;
            if (k.log && k.log._retweet)f.requestUrl = f.requestUrl + "?" + k.log._retweet;
            e.sendAction(f)
        }
    }, checkAction : function () {
        this.$textAreaElem.value.trim();
        if (this._isMoreLimit)return this.textError(), !1;
        return!0
    }, successAction : function () {
        var e = this;
        e.talkBoxObj.$talkBoxElem.innerHTML = '<span class="arrowUp-icon js-arrow" style="left: 451.5px;"></span><div style="padding: 15px 0 20px"><p style="padding-left:42px;margin-left:10px;_height:25px" class="icon-correctB fS14">\u8f6c\u53d1\u6210\u529f !</p></div>';
        e.statusObj.setNewNum(++e.statusObj._retweetNum, "retweet");
        e.statusObj.closeTalkTimer = setTimeout(function () {
            e.statusObj.closeTalkBox()
        }, 2E3);
        e.param.callBack()
    }})
})(window);
(function (e) {
    function f(e, f) {
        var g = e.$(".js-pic").$(0), h = e.$(".js-viewPic").$(0);
        if (h)h.style.display = "none", g.$(".js-picloadding").$(0).style.display = "none";
        f ? g && (g.style.display = "inline") : g && (g.style.display = "none")
    }

    function k(e, f) {
        var g = e.$(".js-video-pre").$(0), h = e.$(".js-viewVideo").$(0);
        if (h)h.style.display = "none", h.$(".js-content").$(0).innerHTML = "";
        f ? g && (g.style.display = "inline") : g && (g.style.display = "none")
    }

    function g(e) {
        if (e = e.$(".js-news").$(0))e.style.display = "none", e.$(".js-newsloadding").$(0).style.display = "none", e.$(".js-newsfail").$(0).style.display = "none", e.$(".js-content").$(0).innerHTML = ""
    }

    function h(e, f) {
        var g = e.$(".js-vote").$(0), h = e.$(".js-viewVote").$(0);
        if (h)h.style.display = "none", h.$(".js-voteloadding").$(0).style.display = "none", h.$(".js-votecontent").$(0).innerHTML = "";
        f ? g && (g.style.display = "block") : g && (g.style.display = "none")
    }

    function m(e, f) {
        var g = e.$(".js-music-pre").$(0), h = e.$(".js-viewMusic").$(0);
        if (h)h.style.display = "none", h.$(".js-music-player").$(0).innerHTML = "";
        f ? g && (g.style.display = "block") : g && (g.style.display = "none")
    }

    function n(e, l, s) {
        switch (e) {
            case "pic":
                g(l);
                k(l, s);
                h(l, s);
                break;
            case "video":
                g(l);
                f(l, s);
                h(l, s);
                break;
            case "news":
                f(l, s);
                k(l, s);
                h(l, s);
                m(l, s);
                break;
            case "vote":
                f(l, s);
                k(l, s);
                g(l);
                m(l, s);
                break;
            case "music":
                f(l, s), k(l, s), g(l), h(l, s)
        }
    }

    function r(e, f) {
        this.statusListObj = f.statusListObj;
        this.$wraper = $(e.parentNode);
        this.$previewElems = $(e);
        this.viewPicElem = this.$wraper.$(".js-viewPic").$(0);
        this.loaddingElem = this.$wraper.$(".js-picloadding").$(0);
        this.$content = this.viewPicElem.$(".js-content").$(0);
        this.init()
    }

    function l(e, f) {
        this.statusListObj = f.statusListObj;
        this.$wrapperElem = $(e.parentNode);
        this.$previewElems = $(e);
        this.viewVideoElem = this.$wrapperElem.$(".js-viewVideo").$(0);
        this.$content = this.viewVideoElem.$(".js-content").$(0);
        this.init()
    }

    function u(e, f) {
        this.statusListObj = f.statusListObj;
        this.$wrapperElem = $(e.parentNode);
        this.$previewElems = $(e);
        this.viewVideoElem = this.$wrapperElem.$(".js-viewMusic");
        this.$content = this.viewVideoElem.$(".js-music-player");
        this.$musicCover = this.viewVideoElem.$(".js-music-cover");
        this.init()
    }

    function t(e, f) {
        var g = this;
        g.statusListObj = f.statusListObj;
        this.wraper = $(e.parentNode.parentNode.parentNode).$(".js-news").$(0);
        this.content = g.wraper.$(".js-content").$(0);
        this.loadding = g.wraper.$(".js-newsloadding").$(0);
        this.fail = g.wraper.$(".js-newsfail").$(0);
        $(e).addEvent("click", function () {
            g.showPreview(this)
        })
    }

    function p(e, f, g, h) {
        this.voteNode = e;
        this.voteWraper = this.voteNode.parentNode;
        this.voteViewNode = $(this.voteWraper).$(".js-viewVote").$(0);
        this.voteContent = this.voteViewNode.$(".js-votecontent").$(0);
        this.loadding = $(this.voteWraper).$(".js-voteloadding").$(0);
        this.close = this.voteViewNode.$(".js-voteclose").$(0);
        this.voteUrl = this.voteInfoUrl = "/service/vote.do";
        this.param = f;
        this._id = g;
        this.flag = h;
        this.init()
    }

    r.viewPicTpl = '   <div class="status-media-control">      <a class="js-close" title="\u6536\u8d77" hidefocus="true" href="javascript:;">         <em class="icon-control control-close"></em><span>\u6536\u8d77</span>      </a>      <a class="js-left" title="\u5411\u5de6\u8f6c" hidefocus="true" href="javascript:;">         <em class="icon-control control-left"></em><span>\u5411\u5de6\u8f6c</span>      </a>      <a class="js-right" title="\u5411\u53f3\u8f6c" hidefocus="true" href="javascript:;">         <em class="icon-control control-right"></em><span>\u5411\u53f3\u8f6c</span>      </a>      <a target="_blank" title="\u67e5\u770b\u539f\u56fe" hidefocus="true" href="<#=url#>">         <em class="icon-control control-big"></em>         <span>\u67e5\u770b\u539f\u56fe</span>      </a>   </div>   <div class="status-media-content js-inner">   </div>';
    r.prototype = {init : function () {
        var e = this;
        if (e.$previewElems)e._picLoaded = !1, e._picUrl = e.$previewElems.getAttribute("realurl"), e.$previewElems.addEvent("click", function () {
            e.viewPic()
        })
    }, viewPic : function () {
        this._picLoaded ? (n("pic", this.$wraper, !1, this), this.showPic()) : this.renderPic()
    }, renderPic : function () {
        var e = this;
        e.loaddingElem.style.display = "inline";
        e.$content.style.display = "none";
        e.$content.innerHTML = $.util.simpleParse(r.viewPicTpl, {url : e._picUrl});
        e.$picNode = e.$content.$(".js-inner").$(0);
        e.bigPicElem = new Image;
        e.$picNode.appendChild(e.bigPicElem);
        e.bigPicElem.onload = function () {
            if (!$.browser.msie || this.fileSize || !this.load)this.load = !0, e.picLoaded(), this.onload = null
        };
        e.bigPicElem.src = WB.oimage({width : 440, url : e._picUrl})
    }, picLoaded : function () {
        n("pic", this.$wraper, !1, this);
        this._picLoaded = !0;
        this.hidePreview();
        this.viewPicElem.style.display = "block";
        if (this.bigPicElem.width > 440)this.bigPicElem.height *= 440 / this.bigPicElem.width, this.bigPicElem.width = 440;
        this._picWidth = this.bigPicElem.width;
        this._picHeight = this.bigPicElem.height;
        this.whirl = 0;
        this.renderPicHandler();
        this.showPic()
    }, renderPicHandler : function () {
        this.$content.$(".js-close").addEvent("click", this.hideContent.bind(this));
        this.$picNode.addEvent("click", this.hideContent.bind(this));
        this.$content.$(".js-left").addEvent("click", this.rotatePic.bind(this, "left"));
        this.$content.$(".js-right").addEvent("click", this.rotatePic.bind(this, "right"))
    }, rotatePic : function (e) {
        var f = this, g = function (e) {
            if (!f.canvasElem)f.canvasElem = document.createElement("canvas"), f.canvasContext = f.canvasElem.getContext("2d"), f.$picNode.appendChild(f.canvasElem);
            var g = f.bigPicElem;
            switch (e) {
                case 0:
                    f.canvasElem.width = g.width;
                    f.canvasElem.height = g.height;
                    f.canvasContext.drawImage(g, 0, 0);
                    break;
                case 1:
                    f.canvasElem.width = g.height;
                    f.canvasElem.height = g.width;
                    f.canvasContext.rotate(90 * Math.PI / 180);
                    f.canvasContext.drawImage(g, 0, -g.height, g.width, g.height);
                    break;
                case 2:
                    f.canvasElem.width = g.width;
                    f.canvasElem.height = g.height;
                    f.canvasContext.rotate(180 * Math.PI / 180);
                    f.canvasContext.drawImage(g, -g.width, -g.height);
                    break;
                case 3:
                    f.canvasElem.width = g.height, f.canvasElem.height = g.width, f.canvasContext.rotate(270 * Math.PI / 180), f.canvasContext.drawImage(g, -g.width, 0, g.width, g.height)
            }
            g.style.cssText = "display:none;"
        };
        e == "left" ? f.whirl-- : f.whirl++;
        if (f.whirl < 0)f.whirl = 4 + f.whirl;
        if (f.whirl > 3)f.whirl = 0;
        if (f.whirl % 2 != 0) {
            if (f._picHeight > 440)f.bigPicElem.width *= 440 / f._picHeight, f.bigPicElem.height = 440
        } else f.bigPicElem.width = f._picWidth, f.bigPicElem.height = f._picHeight;
        $.browser.msie ? function (e) {
            var g = e * 90 * (Math.PI / 180), e = Math.cos(g), h = -1 * Math.sin(g), g = Math.sin(g);
            $(f.bigPicElem).addCss("position:absolute;left:50%;");
            f.bigPicElem.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=" + e + ",M12=" + h + ",M21=" + g + ",M22=" + e + ",SizingMethod='auto expand');";
            f.$picNode.addCss("position:relative;height:" + f.bigPicElem.height + "px;");
            $(f.bigPicElem).addCss("margin-left:-" + f.bigPicElem.width / 2 + "px;")
        }(f.whirl) : g(f.whirl)
    }, showPic : function () {
        this.hidePreview();
        this.viewPicElem.addCss("display:block;");
        this.$content.style.display = "block"
    }, hidePreview : function () {
        this.$previewElems.addCss("display:none;");
        this.loaddingElem.style.display = "none"
    }, hideContent : function () {
        this.viewPicElem.addCss("display:none;");
        this.$previewElems.addCss("display:inline;");
        n("pic", this.$wraper, !0, this)
    }};
    l.viewVideoTpl = '   <div class="status-media-control">      <a class="js-close" title="\u6536\u8d77" hidefocus="true" href="javascript:;">         <em class="icon-control control-close"></em><span>\u6536\u8d77</span>      </a>      <a title="<#=title#>" href="<#=link#>" target="_blank"><em class="icon-control control-link"></em><span><#=title#></span></a>   </div>   <div class="status-media-content js-video-content">      <object width="460" height="375" codebase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab#version=10,0,0,0" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">         <param name="movie" value="<#=src#>">         <param name="quality" value="high">         <param name="bgcolor" value="#000000">         <param name="scaleMode" value="showAll">         <param name="allowFullScreen" value="true">         <param name="allowScriptAccess" value="sameDomain">         <param name="flashvars" value="isAutoPlay=false">         <param name="flashvars" value="playMovie=true">         <param name="wmode" value="Opaque">         <embed width="460" height="375" pluginspage="http://www.adobe.com/go/getflashplayer" flashvars="playMovie=true" type="application/x-shockwave-flash" allowscriptaccess="sameDomain" play="true" bgcolor="#000000" quality="high" scalemode="showAll" allowfullscreen="true" wmode="Opaque" src="<#=src#>">      </object>   </div>';
    l.prototype = {init : function () {
        var e = this;
        e.$previewElems.addEvent("click", function () {
            e.renderVideo.call(e, this)
        });
        var f = $(APP.getPreviousNode(e.$wrapperElem)).$(".js-video");
        f && f.addEvent("click", function () {
            e.renderVideo.call(e, this)
        })
    }, renderVideo : function (e) {
        var f = e.getAttribute("title"), g = e.getAttribute("realurl"), e = e.getAttribute("flashsrc");
        if (this.$wrapperElem.$(".js-video-content").$(0))this.hideFlash(); else {
            if (this.statusListObj.currentPlayVideo) {
                this.statusListObj.closeCurrentVideo();
                try {
                    delete this.statusListObj.currentPlayVideo
                } catch (h) {
                    this.statusListObj.currentPlayVideo = null
                }
            }
            this.viewVideoElem.style.display = "block";
            this.hidePreview();
            this.$content.innerHTML = $.util.simpleParse(l.viewVideoTpl, {title : f, link : g, src : e});
            this.renderVideoHandler();
            this.statusListObj.currentPlayVideo = this;
            n("video", this.$wrapperElem, !1, this)
        }
    }, renderVideoHandler : function () {
        this.$content.$(".js-close").addEvent("click", this.hideFlash.bind(this))
    }, hideFlash : function () {
        this.hideContent()
    }, hidePreview : function () {
        this.$previewElems.addCss("display:none;")
    }, hideContent : function () {
        this.$wrapperElem.$(".js-viewVideo").addCss("display:none;");
        this.$previewElems.addCss("display:inline;");
        this.viewVideoElem.$(".js-content").$(0).innerHTML = "";
        n("video", this.$wrapperElem, !0, this)
    }};
    u.viewMusicTpl = '      <div class="js-music-content">        <object width="257" height="33" id="tweetXmmp" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">           <param value="http://img.xiami.com/widget/0_<#=playKey#>_/singlePlayer.swf" name="movie">           <param value="high" name="quality">           <param value="opaque" name="wmode">           <param value="false" name="menu">           <param value="#f3f3f3" name="bgcolor">           <param value="always" name="allowscriptaccess">           <embed width="257" height="33" name="tweetXmmp" bgcolor="#f3f3f3" allowscriptaccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"menu="false" wmode="opaque" quality="high" src="http://img.xiami.com/widget/0_<#=playKey#>_/singlePlayer.swf">        </object>       </div>';
    u.onLoad = function (f) {
        var g = e.getComputedStyle ? e.getComputedStyle($(f), null).width : $(f).width, h = e.getComputedStyle ? e.getComputedStyle($(f), null).height : $(f).height, g = parseInt(g), h = parseInt(h);
        if (g >= h && g > 130)$(f).style.width = "130px"; else if (g <= h && h > 130)$(f).style.height = "130px"
    };
    u.isIE6 = $.browser.msie && $.browser.version < 7;
    u.prototype = {init : function () {
        var e = this;
        e.$previewElems.addEvent("click", function () {
            e.renderMusic(this, 0)
        });
        $(APP.getPreviousNode(e.$wrapperElem)).$(".music-trigger").each(function (f, g) {
            $(g).addEvent("click", function () {
                e.renderMusic(this, f)
            })
        });
        u.isIE6 && e.$musicCover.each(function (e, f) {
            f.src = f.getAttribute("data-src")
        });
        e.$musicCover.each(function (e, f) {
            f.onload = function () {
                setTimeout(function () {
                    u.onLoad(f);
                    $(f).addCss("visibility:visible")
                }, 10)
            }
        })
    }, renderMusic : function (e, f) {
        var g = e.getAttribute("playKey"), h = 0;
        this.$content.each(function (e, f) {
            $(f).$(".js-music-content").$(0) && (h = e)
        });
        if (this.$wrapperElem.$(".js-music-content").$(0) && f == h)this.hideFlash(); else {
            if (this.statusListObj.currentPlayVideo) {
                this.statusListObj.closeCurrentVideo();
                try {
                    delete this.statusListObj.currentPlayVideo
                } catch (k) {
                    this.statusListObj.currentPlayVideo = null
                }
            }
            this.viewVideoElem[f].style.display = "block";
            this.$musicCover[f].src = this.$musicCover[f].getAttribute("data-src");
            this.hidePreview();
            this.$content[f].innerHTML = $.util.simpleParse(u.viewMusicTpl, {playKey : g});
            this.renderVideoHandler(f);
            this.statusListObj.currentPlayVideo = this;
            n("music", this.$wrapperElem, !1)
        }
    }, renderVideoHandler : function (e) {
        var f = this;
        f.viewVideoElem.$(e).$(".js-close").addEvent("click", function () {
            f.hideFlash()
        })
    }, hideFlash : function () {
        this.hideContent()
    }, hidePreview : function () {
        this.$previewElems.addCss("display:none;")
    }, hideContent : function () {
        this.$wrapperElem.$(".js-viewMusic").addCss("display:none;");
        this.$previewElems.addCss("display:block;");
        this.$content.each(function (e, f) {
            f.innerHTML = ""
        });
        n("music", this.$wrapperElem, !0)
    }};
    t.viewNewsTpl = '   <div class="status-media-control">         <a href="javascript:;" hidefocus="true" title="\u6536\u8d77" class="js-close">            <em class="icon-control control-close"></em><span>\u6536\u8d77</span>         </a>         <a href="<#=link#>" hidefocus="true" title="<#=title#>" target="_blank">            <em class="icon-control status-control-icon-link"></em><span>\u67e5\u770b\u539f\u6587</span>         </a>    </div>    <div class="status-bNews-title">            <#=title#>    </div>    <#if(summary!=""){#>    <div class="status-bNews-summary">            <#=summary#>    </div>    <#}#>    <div class="status-bNews-content js-news-content" shortlink="<#=shortLink#>">            <#=content#>    </div>    <div class="status-media-control clearfix">           <a href="javascript:;" class="link-la js-stretch" title="\u5c55\u5f00\u5168\u90e8">               <em class="icon-control status-control-icon-open"></em><span>\u5c55\u5f00\u5168\u90e8</span>           </a>           <a href="javascript:;" class="link-la js-zoom" title="\u6536\u8d77">               <em class="icon-control status-control-icon-close"></em><span>\u6536\u8d77</span>           </a>     </div>';
    t.prototype.clear = function () {
        this.wraper.style.display = "none";
        this.loadding.style.display = "none";
        this.fail.style.display = "none";
        this.content.innerHTML = "";
        n("news", $(this.wraper.parentNode), !0, this)
    };
    t.prototype.parse = function (f) {
        var g = this;
        g.content.innerHTML = f;
        var h = g.content.$("img").length > 20 ? 40 : 55, k = [], l = g.content.$(".js-news-content").$(0), f = l.$(">*"), m = g.content.$(".js-stretch").$(0), n = g.content.$(".js-zoom").$(0), p = document.createElement("p"), r = document.createElement("p");
        p.innerHTML = "...";
        r.innerHTML = "<a href='" + l.getAttribute("shortlink") + "'>\u4f59\u4e0b\u5168\u6587...</a>";
        g.content.$(".js-close").$(0).addEvent("click", function () {
            g.clear()
        });
        l.$("form").each(function (e, f) {
            APP.removeNode(f)
        });
        l.addEvent("click", function (f) {
            for (f = f.target || f.srcElement; f != l && f != null;)if (f.tagName.toLowerCase() == "a")if (f.href.indexOf("http") != -1) {
                e.open(f.href);
                break
            } else f = f.parentNode; else f = f.parentNode;
            return!1
        });
        m.addEvent("click", function () {
            for (var e = 0; e < k.length; e++)k[e].style.display = "block";
            this.style.display = "none";
            p.style.display = "none";
            n.style.display = "block";
            k.length + 3 > h && l.appendChild(r)
        });
        n.addEvent("click", function () {
            g.clear()
        });
        f.each(function (e, f) {
            if (e > 2)f.style.display = "none", k.push(f);
            e > h - 1 && APP.removeNode(f)
        });
        f.length <= 3 ? (m.style.display = "none", n.style.display = "block") : (l.appendChild(p), n.style.display = "none");
        g.content.style.display = "block"
    };
    t.prototype.showPreview = function (e) {
        var f = this;
        n("news", $(f.wraper.parentNode), !1, f);
        var g = f.content.$(".js-news-content").$(0), h = e.getAttribute("shorturl");
        if (g && (g = g.getAttribute("shortlink"), h == g)) {
            f.clear();
            return
        }
        f.wraper.style.display = "block";
        f.loadding.style.display = "block";
        f.fail.style.display = "none";
        t.hash[h] ? (e = t.buildFloors(t.hash[h]), f.parse(e), f.loadding.style.display = "none") : APP.ajaxSend({requestUrl : "/service/newsReview.do", method : "GET", dataType : "json", param : {url : e.getAttribute("shorturl")}, success : function (e) {
            var e = e.previewInfo, g = t.buildFloors(e);
            f.parse(g);
            f.loadding.style.display = "none";
            t.hash[e.shortLink] = e
        }, error : function () {
            f.loadding.style.display = "none";
            f.fail.style.display = "block";
            f.fail.href = h
        }})
    };
    t.buildFloors = function (e) {
        return $.util.parseTpl(t.viewNewsTpl, {title : e.title, summary : e.summary, content : e.content, link : e.link, shortLink : e.shortLink})
    };
    t.hash = {};
    p.voteTemp = '      <div class="status-bVote-content js-bVoteContent">         <div class="status-bVote-tit js-voteTitle">            <#=title#>         </div>         <#if(cover){#>         <p class="status-bVote-img">            <img src="<#=WB.oimage({ width: 442, height: 535, url: cover})#>">         </p>         <#}#>         <div class="status-bVote-intro js-voteIntro <#if(description==""){#>hidden<#}#>">            <#=description#>         </div>         <div class="status-bVote-tip clearfix js-voteTip">            <span class="status-bVote-tip-r">\u5df2\u6709<em class="cDRed js-voteNumber"><#=voteNumber#></em>\u4eba\u53c2\u4e0e</span>            <span class="status-bVote-tip-l">            <#if(state==0){#>               <em class="icon-inquireS"></em>\u6295\u7968\u5df2\u7ed3\u675f            <#}else if(state==1){#>               <em class="icon-correctS"></em>\u5df2\u6295\u7968            <#}else if(state==2){#>               <em class="icon-inquireS"></em>\u6295\u7968\u540e\u770b\u7ed3\u679c            <#}else if(state==3){#>               <em class="icon-correctS"></em>\u6211\u53d1\u8d77\u7684\u6295\u7968            <#}else if(state==4){#>               <em class="icon-inquireS"></em>\u767b\u5f55\u540e\u624d\u80fd\u6295\u7968\uff0c<a href="javascript:;" class="js-login">\u70b9\u6b64\u767b\u5f55</a>            <#}#>            </span>         </div>         <div class="status-bVote-list js-voteOptionList">            <ul>               <#=options#>            </ul>         </div>         <div class="status-bVote-ft clearfix">            <#if(endTime!="-1"){#>            <div class="status-bVote-ft-l js-voteEndtime ">               <#=endTime#> \u7ed3\u675f            </div>            <#}#>            <div class="clearfix">               <span class="status-bVote-ft-btn">               <#if(state==0){#>                  <a href="javascript:;" class="grayBtn grayBtn-disabled vote-submit"> \u5df2\u7ed3\u675f</a>               <#}else if(state==1){#>                  <a href="javascript:;" class="grayBtn grayBtn-disabled vote-submit"> \u5df2\u6295\u7968</a>               <#}else if(state==2|| state==3||state==4){#>                  <a href="javascript:;" class="grayBtn vote-submit js-voteBtn hidden"> \u6295\u7968</a>                  <a href="javascript:;" class="grayBtn grayBtn-disabled js-unvoteBtn"> \u6295\u7968</a>               <#}#>               </span>            </div>            <#if(voteTop){#>               <div style="display: block;" class="status-bVote-guess js-vote-guess">                  <h3>\u4f60\u53ef\u80fd\u611f\u5174\u8da3\u7684\u6295\u7968\uff1a</h3>               <#for(var i = 0;i < 3;i++){#>                  <p>                     <em class="icon-vote"></em>                     <a class="link-la" href="/<#=voteTop[i].screenName#>/status/<#=voteTop[i].butterId#>" target="_blank"><#=voteTop[i].voteInfo.title#></a>                     <span class="tweet-vote-guess-num">\uff08<#=voteTop[i].voteInfo.voteNumber#>\u4eba\u53c2\u4e0e\uff09</span>                  </p>               <#}#>               </div>            <#}#>         </div>      </div>';
    p.optionTemp = '      <li class="clearfix" style="cursor: auto;">         <a href="javascript:;" <#if(select==true){#>class="status-bVote-list-hover"<#}#> title="<#=content#>">            <label class="status-bVote-list-con js-voteOptionCon clearfix" for="<#=id#>">               <div class="status-bVote-list-l js-optionInputCon">                  <input id="<#=id#>" value="<#=value#>" text="<#=content#>" type="<#if(voteType=="1"){#>checkbox<#}else{#>radio<#}#>" name="vote-option" <#if(select==true){#>checked="checked"<#}#> <#if(state==1||state==0){#>disabled="disabled"<#}#>  <#if(state==0){#>class="hidden"<#}#> ><#=content#>               </div>            <#if(state==0||state==1||state==3||state==4){#>               <div class="status-bVote-list-r">                  <div class="status-bVote-numBg">                     <span class="optionBg <#if(voteNumber!=0){#>status-bVote-Cbg<#=colorType#><#}#> js-option" w="<#=percent#>"></span>                  </div>                  <div class="status-bVote-num">                     <span><#=voteNumber#></span>(<#=percent#>)                  </div>               </div>            <#}#>           </label>         </a>      </li>';
    p.talkBoxTemp = '   <div class="status-talk-hd status-bVote-talk js-publishbox">         <label class="status-talk-inputTip js-tip"></label>         <textarea class="status-talk-textarea inputtextTag js-textarea"></textarea>         <div class="status-talk-operate">            <div class="status-talk-operate-left">               <label><input name="isRetweet" checked="checked" type="checkbox" />\u540c\u65f6\u8f6c\u53d1\u5230\u6211\u7684\u5fae\u535a</label>            </div>            <div class="status-talk-operate-right">               <a class="sbtn-icon js-sendBtn" onclick="this.blur();" href="javascript:;">\u6295\u7968</a>               <span class="sendinfoTip js-sendInfo">\u8fd8\u53ef\u8f93<em class="char-constantia">163</em>\u4e2a\u5b57</span>               <i></i>               <span class="insertFace js-face">                  <em class="icon-face"></em>               </span>            </div>         </div>      </div>';
    p.prototype.caculateChart = function (e) {
        var f = this.param.voteWidth || 92;
        e.$(".js-option").each(function (e, g) {
            var h = Math.ceil(parseInt(g.getAttribute("w")) / 100 * f);
            $(g).animate({width : h}, 0.6, "linear")
        })
    };
    p.trace = function (e) {
        e += 1;
        if (e <= 5)return"0" + e.toString(); else if (e <= 10)return"0" + (e - 5).toString(); else if (e <= 15)return"0" + (e - 10).toString(); else if (e <= 20)return"0" + (e - 15).toString()
    };
    p.getSelectedValue = function (e) {
        var f = [], g = [];
        e.$("input").each(function (e, h) {
            h.checked && h.className != "js-voteRetweet-mark" && (f.push(h.value), g.push("\u201c" + h.getAttribute("text") + "\u201d"))
        });
        return{a : f, v : g}
    };
    p.prototype.showVote = function (e) {
        var f = this;
        f.voteNode.style.display = "none";
        f.voteViewNode.style.display = "block";
        f.loadding.style.display = "block";
        APP.ajaxSend({requestUrl : f.voteInfoUrl, method : "GET", dataType : "json", param : {method : "getvote", voteUrl : e}, success : function (g) {
            f.render(g, e)
        }, error : function () {
        }})
    };
    p.prototype.render = function (e, f) {
        var g = this;
        g.voteContent.innerHTML = p.buildFloor(e, g.flag);
        g.loadding.style.display = "none";
        g.voteList = g.voteContent.$(".js-voteOptionList").$(0);
        e.voteIntro.status == "voted" || e.voteIntro.status == "end" || e.voteIntro.status == "logout" ? (g.caculateChart(g.voteList), e.voteIntro.status == "logout" && g.voteViewNode.$(".js-login").$(0).addEvent("click", function () {
            if (WB.User.checkUserIsLogin({}, function () {
                g.showVote(g.voteNode.getAttribute("voteUrl"))
            }))return!1; else g.showVote(g.voteNode.getAttribute("voteUrl"))
        })) : (e.voteIntro.isCreator == "true" && g.caculateChart(g.voteList), g.vote = g.voteContent.$(".js-sendBtn").$(0) || "", g.disvote = g.voteContent.$(".js-unvoteBtn").$(0), g.tweetNode = g.voteContent.$("input[name=isRetweet]").$(0), g.vote && g.vote.addEvent("click", function () {
            g.dovote(f, isRetweet)
        }))
    };
    p.prototype.dovote = function (e) {
        var f = this, g = p.getSelectedValue(f.voteList).a;
        APP.ajaxSend({requestUrl : f.voteUrl, method : "POST", dataType : "json", param : {method : "vote", voteTarget : e, optId : g.join(",")}, success : function (g) {
            f.tweetNode.checked ? f.retweet(g.voteIntro, e) : f.render(g.voteIntro, e)
        }, error : function () {
        }})
    };
    p.prototype.retweet = function (e, f, g) {
        var h = this;
        p.getSelectedValue(h.voteList);
        var k = {requestUrl : h.param.url, param : {content : g, targetId : h._id, isRetweet : 2, flag : 1, keyfrom : "no", method : "retweet", special_site : "no", sitechannel : "no", ztsite : "no"}, callBack : function () {
            h.render(e, f)
        }}, l;
        for (l in h.param.extra)k.param[l] = h.param.extra[l];
        APP.ajaxSend({requestUrl : k.requestUrl, method : "POST", dataType : "json", param : k.param, success : function (e) {
            k.callBack && k.callBack(e)
        }, error : function () {
        }})
    };
    p.prototype.getVoteItem = function (e) {
        var f = this, e = e.target || e.srcElement;
        f.voteTalkBox = f.voteContent.$(".status-talk-hd").$(0);
        switch (e.tagName.toLowerCase()) {
            case "input":
                if (WB.User.checkUserIsLogin({}, function () {
                    f.showVote(f.voteNode.getAttribute("voteUrl"))
                }))return!1; else {
                    if (e.getAttribute("name") == "isRetweet")break;
                    e.type == "radio" ? (f.curOption && $(f.curOption.parentNode.parentNode.parentNode).removeCss("status-bVote-list-hover"), $(e.parentNode.parentNode.parentNode).addCss("status-bVote-list-hover"), f.curOption = e) : e.checked ? $(e.parentNode.parentNode.parentNode).addCss("status-bVote-list-hover") : $(e.parentNode.parentNode.parentNode).removeCss("status-bVote-list-hover")
                }
                var g = e = p.getSelectedValue(f.voteList).v, h = "", k = e.length;
                k == 0 ? f.removeVoteTalkBox() : (k > 7 && (g = e.slice(0, 7), h = "\u7b49" + e.length + "\u4e2a\u9009\u9879"), e = k ? "\u6295\u7968\u7ed9" + g.join("\u3001") + h : "", f.showVoteTalkBox(e))
        }
    };
    p.prototype.showVoteTalkBox = function (e) {
        var f = $(APP.appendHtmlNode(p.talkBoxTemp)[0]);
        this.voteTalkBox || (this.disvote.addCss("hidden"), this.voteContent.appendChild(f));
        (new p.voteSendBox(this.voteContent, e, this.voteList, this.voteUrl, this)).render()
    };
    p.prototype.removeVoteTalkBox = function () {
        this.disvote.removeCss("hidden");
        this.voteContent.removeChild(this.voteTalkBox)
    };
    p.voteSendBox = WB.widget.sendBox.SendBox.extend({init : function (e, f, g, h, k) {
        this._super(e, f);
        this.voteList = g;
        this.voteUrl = h;
        this.voteObj = k;
        this.isRetweetElem = e.$("input[name=isRetweet]").$(0)
    }, sendInfo : function () {
        if (WB.User.checkUserIsLogin())return!1;
        var e = this, f = e.$textAreaElem.value.trim(), g = e.voteList;
        if (e.checkAction() && !e._isRequest)return e._isRequest = !0, g = p.getSelectedValue(g).a, APP.ajaxSend({requestUrl : e.voteUrl, method : "POST", dataType : "json", param : {method : "vote", voteTarget : e.voteObj.voteNode.getAttribute("voteUrl"), optId : g.join(",")}, success : function (g) {
            e.isRetweetElem.checked ? e.voteObj.retweet(g, e.voteUrl, f) : e.voteObj.render(g, e.voteUrl)
        }, error : function () {
        }}), !1
    }});
    p.buildFloor = function (e, f) {
        var g;
        switch (e.voteIntro.status) {
            case "end":
                g = 0;
                break;
            case "voted":
                g = 1;
                break;
            case "canVote":
                g = 2;
                e.voteIntro.isCreator == "true" && (g = 3);
                break;
            case "logout":
                g = 4
        }
        for (var h = e.voteIntro.options, k = h.length, l = [], m = 0; m < k; m++) {
            var n = h[m].voteNumber;
            n > 99999 && (n = Math.floor(n / 1E4) + "\u4e07");
            n = {voteType : e.voteIntro.type, voteNumber : n, percent : h[m].percent, colorType : p.trace(m), select : h[m].select, id : h[m].id + f, value : h[m].id, state : g, content : APP.encodeSpecialHtmlChar(h[m].content)};
            l.push($.util.parseTpl(p.optionTemp, n))
        }
        n = {title : e.voteIntro.title, cover : e.voteIntro.cover, description : e.voteIntro.description, endTime : e.voteIntro.endTime, voteNumber : e.voteIntro.voteNumber, options : l.join(""),
            state : g, voteTop : e.voteTop, id : e.voteIntro.id + f};
        return $.util.parseTpl(p.voteTemp, n)
    };
    p.prototype.init = function () {
        var e = this;
        $(e.voteNode).addEvent("click", function () {
            n("vote", e.voteWraper, !1);
            e.showVote(this.getAttribute("voteUrl"))
        });
        e.close.addEvent("click", function () {
            e.voteNode.style.display = "block";
            e.voteViewNode.style.display = "none";
            e.loadding.style.display = "none";
            e.voteContent.innerHTML = "";
            e.curOption && delete e.curOption;
            n("vote", e.voteWraper, !0)
        });
        e.voteContent.addEvent("click", function (f) {
            e.getVoteItem(f)
        });
        e.param.showVote && (n("vote", e.voteWraper, !1), e.showVote(e.voteNode.getAttribute("voteUrl")))
    };
    templates.status_tpl = '<li class="liItem [=STATUS_TOP_CLASS=]" sid="<#=id#>">   [=STATUS_TOP_CODE=]   <div class="status">      [=STATUS_LEFT_CODE=]      <p class="status-text">         <a class="link-la js-username js-status-float"  nickname="<#=name#>" screenName="<#=screen_name#>" target="_blank" href="/<#=screen_name#>"><#=name#></a><# if (itag) { #>         <a class="<#if (isColumnUser){#>cTag js-ctag<#}else{#> iTag js-itag<#}#>" data-tags="<# for (var i = 0, len = itag.length; i < len; i++) {#><#=itag[i]#><# if (i != len - 1) { #>,<# } #><# } #>" href="/rank/daren" target="_blank"></a><# }else{ #>   <# if (isColumnUser){#>         <a class="icon-column"  href="http://t.163.com/column" title="\u5fae\u4e13\u680f" ></a>   <# } #><#}#><# if (activity) {      for (var i = 0, len = activity.length; i < len; i++) {#>         <a class="active_icon" target="_blank" title="<#=activity[i].title#>" href="<#=activity[i].href#>" style="background-image:url(\'<#=activity[i].src#>\')"></a><#    }   }#>[=STATUS_CENTER_CODE=]<span class="js-text" content="<#=content#>"><#=text#></span>      </p><# if (media) { #>      <div class="status-media"><#    if (pic) {#>         <div class="status-media-item js-pic" realurl="<#=pic.url#>">            <img class="status-media-item-pic" src="<#=pic.src#>" />            <span class="icon-loading js-picloadding" style="display:none;"></span>         </div>         <div class="status-media-view js-viewPic" style="display:none;">             <div class="js-content"></div>         </div><#    } #><#    if (video) {#>         <div class="status-media-item js-video-pre" title="<#=video.title#>" flashsrc="<#=video.src#>" realurl="<#=video.url#>">            <img src="<#=video.pic#>" />            <span class="video-play-icon"></span>         </div>         <div class="status-media-view js-viewVideo" style="display:none;">             <div class="js-content"></div>         </div><#    } #><#    if (linkInfos) {#>         <div class="status-bNews js-news">              <div class="js-content"></div>              <div class="status-bNews-loading js-newsloadding"><em class="icon-loadingB"></em>\u6b63\u5728\u6253\u5f00\u94fe\u63a5\u9884\u89c8...</div>              <div class="status-bNews-fail js-newsfail"><em class="caution-icon"></em>\u94fe\u63a5\u5931\u6548\u4e86\uff0c<a target="_blank" title="\u67e5\u770b\u539f\u6587" href="#">\u67e5\u770b\u539f\u6587&gt;&gt;</a></div>         </div><#    } #><#    if (voteInfo) {#>         <div class="status-media-item status-sVote js-vote" voteUrl="<#=voteInfo.originalUrl#>">            <div class="status-sVote-img">               <img src="<#if (voteInfo.smallCoverurl){#><#=voteInfo.smallCoverurl#><#}else{#>http://img1.cache.netease.com/t/image/common/vote.gif<#}#>" >               <span></span>               <em>\u5fae\u6295\u7968</em>            </div>            <h3><#=voteInfo.title#></h3>         <#if(voteInfo.options){#>            <#for(var i=0;i < 2;i++){#>               <p><span class="dot"></span><#=APP.encodeSpecialHtmlChar(voteInfo.options[i])#></p>            <#}#>            <#if(voteInfo.options.length > 2 ){#>               <p>...</p>            <#}#>         <#}#>            <span class="status-sVote-btn">\u53c2\u4e0e\u6295\u7968</span>         </div>         <div style="display: none;" class="status-bVote js-viewVote">            <div class="status-media-control">               <a href="javascript:;" hidefocus="true" title="\u6536\u8d77" class="js-voteclose">               <em class="icon-control control-close"></em><span>\u6536\u8d77</span> </a>            </div>            <div class="js-votecontent">            </div>            <div class="status-bNews-loading js-voteloadding"><em class="icon-loadingB"></em>\u6b63\u5728\u6253\u5f00\u6295\u7968...</div>         </div><#    } #><#    if (music) {#>         <div class="clear"></div>         <div class="status-sMusic js-music-pre" title="<#=music[0].songName#>"  playKey="<#=music[0].playKey#>" >                     <a href="javascript:;">                           <em class="icon-img-play"></em><#=music[0].songName#>-<#=music[0].singer#>                     </a>         </div>         <#for(var i=0;i<music.length;i++){#>         <div class="js-viewMusic" style="display:none">                  <div class="status-bMusic">                     <div class="status-media-control">                          <a href="javascript:;" hidefocus="true" title="\u6536\u8d77" class="js-close">                             <em class="icon-control control-close"></em><span>\u6536\u8d77</span>                           </a>                          <a target="_blank" href="<#=music[i].songUrl#>" title="<#=music[i].songName#>">                             <em class="icon-control control-link"></em><span><#=music[i].songName#></span>                          </a>                      </div>                      <div class="status-bMusic-content clearfix">                          <div class="status-bMusic-cover" style="width: 130px;">                              <img data-src="<#=music[i].photoUrl#>" style="visibility:hidden" class="js-music-cover">                          </div>                          <div class="status-bMusic-player js-music-player">                          </div>                      </div>                 </div>         </div>        <#}#><#    } #>      </div><# } #><# if (root) { #>      <div class="status-cite">         <p class="status-text">            <a class="link-la js-username js-status-float" nickname="<#=root.name#>" target="_blank" href="/<#=root.screen_name#>"><#=root.name#></a><#    if (root.itag) { #>         <a class="<#if (root.isColumnUser){#>cTag js-ctag<#}else{#> iTag js-itag<#}#>" data-tags="<# for (var i = 0, len = root.itag.length; i < len; i++) {#><#=root.itag[i]#><# if (i != len - 1) { #>,<# } #><# } #>" href="/rank/daren" target="_blank"></a><#    }else{#>     <# if (root.isColumnUser){#>         <a class="icon-column"  href="http://t.163.com/column" title="\u5fae\u4e13\u680f" ></a>    <# } #>    <#}#><#    if (root.activity) {         for (var i = 0, len = root.activity.length; i < len; i++) { #>            <a class="active_icon" target="_blank" title="<#=root.activity[i].title#>" href="<#=root.activity[i].href#>" style="background-image:url(\'<#=root.activity[i].src#>\')"></a><#       }      }#>            \uff1a<span class="js-text" content="<#=root.content#>"><#=root.text#></span>         </p><#    if (root.media) { #>         <div class="status-media"><#       if (root.pic) { #>            <div class="status-media-item js-pic" realurl="<#=root.pic.url#>">               <img class="status-media-item-pic" src="<#=root.pic.src#>" />               <span class="icon-loading js-picloadding" style="display:none;"></span>            </div>            <div class="status-media-view js-viewPic" style="display:none;">               <div class="js-content"></div>            </div><#       } #><#       if (root.video) { #>            <div class="status-media-item js-video-pre" title="<#=root.video.title#>" flashsrc="<#=root.video.src#>" realurl="<#=root.video.url#>">               <img src="<#=root.video.pic#>" />               <span class="video-play-icon"></span>            </div>             <div class="status-media-view js-viewVideo" style="display:none;">                <div class="js-content"></div>             </div><#       } #><#    if (root.linkInfos) {#>         <div class="status-bNews js-news">              <div class="js-content"></div>              <div class="status-bNews-loading js-newsloadding"><em class="icon-loadingB"></em>\u6b63\u5728\u6253\u5f00\u94fe\u63a5\u9884\u89c8...</div>              <div class="status-bNews-fail js-newsfail"><em class="caution-icon"></em>\u94fe\u63a5\u5931\u6548\u4e86\uff0c<a target="_blank" title="\u67e5\u770b\u539f\u6587" href="#">\u67e5\u770b\u539f\u6587&gt;&gt;</a></div>         </div> <#    } #><#    if (root.voteInfo) {#>         <div class="status-media-item status-sVote js-vote" voteUrl="<#=root.voteInfo.originalUrl#>">            <div class="status-sVote-img">               <img src="<#if (root.voteInfo.smallCoverurl){#><#=root.voteInfo.smallCoverurl#><#}else{#>http://img1.cache.netease.com/t/image/common/vote.gif<#}#>" >               <span></span>               <em>\u5fae\u6295\u7968</em>            </div>            <h3><#=root.voteInfo.title#></h3>         <#if(root.voteInfo.options){#>            <#for(var i=0;i < 2;i++){#>               <p><span class="dot"></span><#=APP.encodeSpecialHtmlChar(root.voteInfo.options[i])#></p>            <#}#>            <#if(root.voteInfo.options.length > 2 ){#>               <p>...</p>            <#}#>         <#}#>            <span class="status-sVote-btn">\u53c2\u4e0e\u6295\u7968</span>         </div>         <div style="display: none;" class="status-bVote js-viewVote">            <div class="status-media-control">               <a href="javascript:;" hidefocus="true" title="\u6536\u8d77" class="js-voteclose">               <em class="icon-control control-close"></em><span>\u6536\u8d77</span> </a>            </div>            <div class="js-votecontent">            </div>            <div class="status-bNews-loading js-voteloadding"><em class="icon-loadingB"></em>\u6b63\u5728\u6253\u5f00\u6295\u7968...</div>         </div>      <#    } #> <#    if (root.music) {#>         <div class="clear"></div>         <div class="status-sMusic js-music-pre" title="<#=root.music[0].songName#>"  playKey="<#=root.music[0].playKey#>" >                     <a href="javascript:;">                           <em class="icon-img-play"></em><#=root.music[0].songName#>-<#=root.music[0].singer#>                     </a>         </div>         <#for(var i=0;i<root.music.length;i++){#>         <div class="js-viewMusic" style="display:none">                     <div class="status-bMusic">                        <div class="status-media-control">                          <a href="javascript:;" hidefocus="true" title="\u6536\u8d77" class="js-close">                             <em class="icon-control control-close"></em><span>\u6536\u8d77</span>                           </a>                          <a target="_blank" href="<#=root.music[i].songUrl#>" title="<#=root.music[i].songName#>">                             <em class="icon-control control-link"></em><span><#=root.music[i].songName#></span>                          </a>                        </div>                        <div class="status-bMusic-content clearfix">                          <div class="status-bMusic-cover" style="width: 130px;">                              <img  data-src="<#=root.music[i].photoUrl#>" style="visibility:hidden" class="js-music-cover">                          </div>                          <div class="status-bMusic-player js-music-player">                          </div>                        </div>                     </div>         </div>         <#}#><#    } #>         </div><#    } #>         <div class="status-foot">            <span class="status-info">               <a href="/<#=root.screen_name#>/status/<#=root.id#>" target="_blank"><#=root.createTime#></a>&nbsp;&nbsp;<em>\u6765\u81ea<#=root.source#></em>            </span>&nbsp;&nbsp;              <a class="link-lb" href="/<#=root.screen_name#>/status/<#=root.id#>/retweet" target="_blank">\u539f\u6587\u8f6c\u53d1<# if (root.retweetCount > 0) { #>(<#=root.retweetCount#>)<# } #></a>            <span>|</span>            <a class="link-lb" href="/<#=root.screen_name#>/status/<#=root.id#>/reply" target="_blank">\u539f\u6587\u8bc4\u8bba<# if (root.replyCount > 0) { #>(<#=root.replyCount#>)<# } #></a>        </div>      </div><# } #>      <div class="status-foot">         <span class="status-info">            <a href="/<#=screen_name#>/status/<#=id#>" target="_blank"><#=createTime#></a>&nbsp;&nbsp;<em>\u6765\u81ea<#=source#></em>         </span>         <span class="status-actions link-lb">[=STATUS_BOTTOM_CODE=]</span>      </div>   </div></li>';
    templates.status = templates.status_tpl.replace("[=STATUS_LEFT_CODE=]", '   <span class="status-author">      <a title="<#=name#>" href="/<#=screen_name#>" target="_blank"><img class="thumb js-status-float" nickname="<#=name#>" alt="<#=name#>" src="<#=profile_image#>" /></a>   </span>').replace("[=STATUS_TOP_CODE=]", "").replace("[=STATUS_CENTER_CODE=]", "\uff1a").replace("[=STATUS_TOP_CLASS=]", "").replace("[=STATUS_BOTTOM_CODE=]", '<# if (isSelf) { #><# } #>            <a class="js-retweet" title="\u8f6c\u53d1\u8fd9\u6761\u5fae\u535a" hidefocus="true" href="javascript:;">\u8f6c\u53d1<em><# if (retweetCount != 0) { #>(<#=retweetCount#>)<# } #></em></a>            <i>|</i><# if (!fav) { #>            <a class="js-fav" data-fav="0" title="\u6536\u85cf\u8fd9\u6761\u5fae\u535a" hidefocus="true" href="javascript:;">\u6536\u85cf</a><# } else { #>            <a class="js-fav" data-fav="1" title="\u53d6\u6d88\u6536\u85cf\u8fd9\u6761\u5fae\u535a" hidefocus="true" href="javascript:;">\u53d6\u6d88\u6536\u85cf</a><# } #>            <i>|</i>            <a class="js-reply" title="\u8bc4\u8bba\u8fd9\u6761\u5fae\u535a" href="javascript:;" hidefocus="true">\u8bc4\u8bba<em><# if (replyCount != 0) { #>(<#=replyCount#>)<# } #></em></a>');
    templates.talkBox = '<div class="status-talk">   <span class="arrowUp-icon js-arrow"></span>   <a class="icon-close js-close" title="\u5173\u95ed" hidefocus="true" href="javascript:;"></a>   <div class="status-talk-hd js-publishbox">      <h3 class="status-talk-title"><#=title#></h3>      <label class="status-talk-inputTip js-tip" for="<#=statusId#>_textArea"><#=defaultTip#></label>      <textarea id="<#=statusId#>_textArea" class="status-talk-textarea inputtextTag js-textarea"></textarea>      <div class="status-talk-operate">         <div class="status-talk-operate-left">         <# if (type == "reply") { #>            <label><input name="isRetweet" type="checkbox" />\u540c\u65f6\u8f6c\u53d1\u5230\u6211\u7684\u5fae\u535a</label>         <# } #>         <# if (type == "retweet") { #>             <label><input name="isReply" type="checkbox" />\u540c\u65f6\u8bc4\u8bba\u7ed9<#=username#></label>         <# } #>         <# if (rootUsername !== "") { #>            <label <#if(username==rootUsername){#>style="display:none;"<#}#>><input name="replyRoot" <#if(username!=rootUsername&&type == "reply"){#>checked="checked"<#}#> type="checkbox" />\u540c\u65f6\u8bc4\u8bba\u7ed9\u539f\u6587\u4f5c\u8005<#=rootUsername#></label>         <# } #>         </div>         <div class="status-talk-operate-right">            <a class="sbtn-icon js-sendBtn" onclick="this.blur();" href="javascript:;"><#=btnTxt#></a>            <span class="sendinfoTip js-sendInfo">\u8fd8\u53ef\u8f93<em class="char-constantia">163</em>\u4e2a\u5b57</span>            <i <#if(!showEmotion){#>style="display:none;"<#}#>></i>            <span class="insertFace js-face" <#if(!showEmotion){#>style="display:none;"<#}#>>               <em class="icon-face"></em>            </span>         </div>      </div>   </div>   <# if (type == "reply") { #>   <div class="status-talk-bd js-body">      <p class="data-loading">\u52a0\u8f7d\u4e2d...</p>      <div class="status-talk-list js-list">         <ul>         </ul>      </div>      <div class="status-talk-pageBox">         <span class="fl js-viewAll" style="display:none;">            <a href="/<#=screenName#>/status/<#=statusId#>" target="_blank" class="link-lb">\u67e5\u770b\u5168\u90e8 <em class="js-count"></em> \u6761\u8bc4\u8bba&gt;&gt;</a>         </span>         <div class="status-talk-page link-lb">            <div class="pager">               <ul class="js-page"></ul>            </div>         </div>      </div>   </div>   <div class="status-talk-ft">      <a class="icon-shrink js-shrink" title="\u6536\u8d77" hidefocus="true" href="javascript:;"></a>   </div>   <# } #>   <# if (type == "retweet") { #>   <div class="status-talk-bd js-body">      <p class="data-loading">\u52a0\u8f7d\u4e2d...</p>      <div class="status-talk-list js-list">         <ul>         </ul>      </div>      <div class="status-talk-pageBox">         <span class="fl js-viewAll" style="display:none;">            <a href="/<#=screenName#>/status/<#=statusId#>/retweet" target="_blank" class="link-lb">\u67e5\u770b\u5168\u90e8 <em class="js-count"></em> \u6761\u8f6c\u53d1&gt;&gt;</a>         </span>         <div class="status-talk-page link-lb">            <div class="pager">               <ul class="js-page"></ul>            </div>         </div>      </div>   </div>   <div class="status-talk-ft">      <a class="icon-shrink js-shrink" title="\u6536\u8d77" hidefocus="true" href="javascript:;"></a>   </div>   <# } #></div>';
    var z = Class.extend({init : function (e) {
        e && typeof e.nodeType !== "undefined" ? (this.$itemElem = e, this.initProto(), this.renderHandler()) : this.render(e)
    }, initProto : function () {
        this._id = this.$itemElem.getAttribute("sid");
        this._username = this.$itemElem.$(".js-username").$(0).innerHTML;
        this._screenName = this.$itemElem.$(".js-username").$(0).getAttribute("screenName");
        this._text = this.$itemElem.$(".js-text")[0].getAttribute("content");
        this.$replyElem = this.$itemElem.$(".js-reply").$(0);
        this.$retweetElem = this.$itemElem.$(".js-retweet").$(0)
    },
        render : function () {
            this.initProto();
            this.renderHandler();
            return this
        }, renderHandler : function () {
        }, tranmitHandler : function () {
        }, favHandler : function () {
        }, commentHandler : function () {
        }}), A = null;
    WB.widget.status.NormalStatus = z.extend({init : function (e, f, g, h) {
        this.statusListObj = f;
        this.$statusListElem = f.$listElem;
        this.temp = h || templates.status;
        this.param = {extra : {param : "no"}, showEmotion : !0, showVote : !1, url : "/rank/tweetV2.do", isPop : !1, callBack : function () {
        }, scrollNode : null, isNewCreate : !1};
        if (g)for (var k in g)this.param[k] = g[k];
        this._super(e)
    }, initProto : function () {
        this._super();
        this._orgText = this._text;
        this.$statusElem = this.$itemElem.$(".status").$(0);
        this.$retweetElem = this.$itemElem.$(".js-retweet").$(0);
        this.$favElem = this.$itemElem.$(".js-fav").$(0);
        this.$replyNumElem = this.$itemElem.$(".js-reply em").$(0);
        this.$followNode = this.$itemElem.$(".js-follow").$(0);
        this._replyNum = this.$replyNumElem.innerHTML.trim() !== "" ? this.$replyNumElem.innerHTML.replace(/\(([0-9]+)\)/, "$1") : 0;
        this.$retweetNumElem = this.$itemElem.$(".js-retweet em").$(0);
        this._retweetNum = this.$retweetNumElem.innerHTML.trim() !== "" ? this.$retweetNumElem.innerHTML.replace(/\(([0-9]+)\)/, "$1") : 0;
        this.$statusFtElem = this.$statusElem.$("> .status-foot").$(0);
        this.$picElems = this.$statusElem.$(".js-pic");
        this.$videoElems = this.$statusElem.$(".js-video-pre");
        this.$musicElems = this.$statusElem.$(".js-music-pre");
        this.$shortUrlElems = this.$statusElem.$(".js-shorturl");
        this.$citeElem = this.$statusElem.$(".status-cite").$(0);
        this.$itagElems = this.$statusElem.$(".js-itag");
        this.$ctagElems = this.$statusElem.$(".js-ctag");
        this.$newsPreview = this.$statusElem.$(".js-preview");
        this.$voteElems = this.$statusElem.$(".js-vote");
        this._isHasRoot = this.$citeElem ? !0 : !1;
        this._favLimit = this._deleteLimit = !1;
        if (this._isHasRoot)this._rootUsername = this.$citeElem.$(".js-username").$(0).innerHTML
    }, render : function (e) {
        this.$itemElem = $(APP.appendHtmlNode($.util.parseTpl(this.temp, WB.parseStatusObj(e)))[0]);
        this.$statusListElem.$("li")[0] ? APP.insertBefore(this.$itemElem, this.$statusListElem.$("li")[0]) : this.$statusListElem.appendChild(this.$itemElem);
        this._super();
        return this
    }, renderHandler : function () {
        var e = this;
        e.$itemElem.addEvent("mouseover", function () {
            e.$itemElem.addCss("li-hover")
        }).addEvent("mouseout", function () {
            e.$itemElem.removeCss("li-hover")
        });
        e.$replyElem.addEvent("click", function () {
            WB.User.checkUserIsLogin(e.param.extra) || (e.param.isPop ? WB.showReTweetBox({titleText : "\u8bc4\u8bba\u5fae\u535a", defaultValue : "", param : e.param.extra, url : e.param.url, _id : e._id, isRetweet : 1}) : e.replyHandler.call(e))
        });
        e.$retweetElem.addEvent("click", function () {
            WB.User.checkUserIsLogin(e.param.extra) || (e.param.isPop ? WB.showReTweetBox({titleText : "\u8f6c\u53d1\u5fae\u535a", defaultValue : e._isHasRoot ? " ||@" + e._username + "\uff1a" + e._orgText : "", param : e.param.extra, url : e.param.url, _id : e._id, isRetweet : 2}) : e.retweetHandler.call(e))
        });
        e.$favElem && e.$favElem.addEvent("click", function () {
            WB.User.checkUserIsLogin(e.param.extra) || e.favHandler.call(e)
        });
        e.$followNode && e.$followNode.addEvent("click", function () {
            var f = {method : "follow", followfrom : "no"}, g;
            for (g in e.param.extra)f[g] = e.param.extra[g];
            WB.follow({screenName : e._screenName,
                node : this, audit : f})
        });
        e.$picElems.each(function () {
            new r(this, e)
        });
        e.$videoElems.each(function () {
            new l(this, e)
        });
        e.$musicElems.each(function () {
            new u(this, e)
        });
        e.$newsPreview.each(function () {
            new t(this, e)
        });
        e.$voteElems.each(function () {
            new p(this, e.param, e._id, e._id)
        });
        if (e.param.isNewCreate) {
            var f = new WB.Float({scrollNode : e.param.scrollNode});
            e.$statusElem.$(".js-status-float").each(function (e, g) {
                f.bind(g, g.getAttribute("nickname"))
            })
        }
        e.$shortUrlElems.each(function () {
            $(this).addEvent("mouseover", function () {
                this.title || WB.getLongUrl.call(this)
            })
        });
        e.$itagElems.each(function () {
            $(this).addEvent("mouseover", function () {
                A && clearTimeout(A);
                e.showTag(this, "i")
            }).addEvent("mouseout", function () {
                A = setTimeout(function () {
                    e.hideTag("i")
                }, 200)
            })
        });
        e.$ctagElems.each(function () {
            $(this).addEvent("mouseover", function () {
                A && clearTimeout(A);
                e.showTag(this, "c")
            }).addEvent("mouseout", function () {
                A = setTimeout(function () {
                    e.hideTag("c")
                }, 200)
            })
        })
    }, favHandler : function () {
        var e = this, f = e.$favElem.getAttribute("data-fav") === "0" ? !0 : !1, g = "", g = $.util.simpleParse(f ? "/favorites/create/<#=statusId#>.json" : "/favorites/destroy/<#=statusId#>.json", {statusId : e._id}), h = e.statusListObj;
        h.log && h.log._fav && (g = g + "?" + h.log._fav);
        if (!e._favLimit) {
            e._favLimit = !0;
            var h = {method : f ? "favorites" : "no", keyfrom : "no"}, k;
            for (k in e.param.extra)h[k] = e.param.extra[k];
            APP.ajaxSend({requestUrl : g, dataType : "json", method : "POST", param : h, success : function () {
                e._favLimit = !1;
                f ? (e.$favElem.setAttribute("data-fav", "1"), e.$favElem.attr("innerHTML", "\u53d6\u6d88\u6536\u85cf"), e.$favElem.attr("title", "\u53d6\u6d88\u6536\u85cf\u8fd9\u6761\u5fae\u535a")) : (e.$favElem.setAttribute("data-fav", "0"), e.$favElem.attr("innerHTML", "\u6536\u85cf"), e.$favElem.attr("title", "\u6536\u85cf\u8fd9\u6761\u5fae\u535a"))
            }, error : function () {
                e._favLimit = !1
            }, timeout : function () {
                e._favLimit = !1
            }})
        }
    }, showTag : function (e, f) {
        var g = this, h = $("#" + f + "tagView"), k = e.getAttribute("data-tags").split(",");
        h || (h = $(APP.appendHtmlNode('<div id="' + f + 'tagView" class="' + f + 'tag-tip"><em></em></div>')[0]), document.body.appendChild(h), h.addEvent("mouseover", function () {
            A && clearTimeout(A)
        }).addEvent("mouseout", function () {
            A = setTimeout(function () {
                g.hideTag(f)
            }, 200)
        }));
        for (var l = [], m = 0, n = k.length; m < n; m++)l.push('<a target="_blank" href="/search/itag/' + k[m] + '">' + k[m] + "</a>");
        h.$("em").$(0).attr("innerHTML", l.join(""));
        k = APP.getAbsPosition(e);
        h.addCss({top : k.y - 27 + "px", left : k.x - 20 + "px", display : "block"})
    }, hideTag : function (e) {
        $("#" + e + "tagView").addCss({display : "none"})
    }, retweetHandler : function () {
        this.talkBoxObj && this.talkType == "retweet" ? this.closeTalkBox() : (this.talkBoxObj && this.closeTalkBox(), this.$retweetElem.addCss("current-action"), this.talkType = "retweet", this.renderTalkBox({type : "retweet", statusId : this._id, username : this._username, screenName : this._screenName, rootUsername : this._isHasRoot ? this._rootUsername : "", title : "\u8f6c\u53d1\u5fae\u535a", defaultTip : "\u8f6c\u53d1\u5fae\u535a", btnTxt : "\u8f6c\u53d1", showEmotion : this.param.showEmotion}))
    }, replyHandler : function () {
        this.talkBoxObj && this.talkType == "reply" ? this.closeTalkBox() : (this.talkBoxObj && this.closeTalkBox(), this.$replyElem.addCss("current-action"), this.talkType = "reply", this.renderTalkBox({type : "reply", statusId : this._id, username : this._username, screenName : this._screenName, rootUsername : this._isHasRoot ? this._rootUsername : "", title : "\u8bc4\u8bba\u5fae\u535a", defaultTip : "\u70b9\u51fb\u6dfb\u52a0\u8bc4\u8bba", btnTxt : "\u8bc4\u8bba", showEmotion : this.param.showEmotion}))
    }, renderTalkBox : function (e) {
        this.closeTalkTimer && clearTimeout(this.closeTalkTimer);
        this.statusListObj.closeCurrentTalk();
        this.statusListObj.currentTalkStatus = this;
        e = $(APP.appendHtmlNode($.util.parseTpl(templates.talkBox, e))[0]);
        this.$statusElem.appendChild(e);
        this.talkBoxObj = {};
        this.talkBoxObj.$talkBoxElem = e;
        this.talkBoxObj.$arrowElem = e.$(".js-arrow").$(0);
        this.talkBoxObj.$closeElems = e.$(".js-close, .js-shrink");
        this.talkBoxObj.$shrinkElem = e.$(".js-shrink").$(0);
        this.talkBoxObj.sendAreaObj = {};
        this.talkBoxObj.sendAreaObj.$wrapperElem = e.$(".js-publishbox").$(0);
        this.talkBoxObj.sendAreaObj.$textAreaElem = e.$(".js-textarea").$(0);
        this.talkBoxObj.sendAreaObj.$defalutTipElem = e.$(".js-tip").$(0);
        this.talkBoxObj.$closeElems.addEvent("click", this.closeTalkBox.bind(this));
        this.talkType == "reply" ? (this.setArrowPos(this.$replyElem, this.talkBoxObj.$arrowElem), this.renderReplyBoxHandler(), this.talkBoxObj.replyStatusListObj = new G(this, this.talkType)) : (this.setArrowPos(this.$retweetElem, this.talkBoxObj.$arrowElem), this.renderRetweetBoxHandler(), this.talkBoxObj.retweetStatusListObj = new G(this, this.talkType))
    }, renderReplyBoxHandler : function () {
        var e = this.talkBoxObj.sendAreaObj;
        e.sendBoxObj = (new WB.widget.sendBox.ReplySendBox(this, "", this._id, this.param)).render();
        APP.toggleLabel(e.$defalutTipElem, e.$textAreaElem);
        APP.fireEvent(e.$textAreaElem, "focus")
    }, renderRetweetBoxHandler : function () {
        var e = this.talkBoxObj.sendAreaObj;
        e.sendBoxObj = (new WB.widget.sendBox.RetweetSendBox(this, this._isHasRoot ? " ||@" + this._username + "\uff1a" + this._orgText : "", this._id, this.param)).render();
        APP.toggleLabel(e.$defalutTipElem, e.$textAreaElem);
        APP.fireEvent(e.$textAreaElem, "focus");
        APP.fireEvent(e.$textAreaElem, "mousedown");
        APP.setCursorTo(e.$textAreaElem, 0)
    }, setArrowPos : function (e, f) {
        var g = APP.getAbsPosition(e).x - APP.getAbsPosition(this.$statusFtElem).x + e.width() / 2 - 9, g = $.browser.msie && $.browser.version < 7 ? g + 2 : g;
        f.addCss({left : g + "px"})
    }, setNewNum : function (e, f) {
        var g = e == 0 ? "" : "(" + e + ")";
        f === "reply" ? this.$replyNumElem.innerHTML = g : this.$retweetNumElem.innerHTML = g
    }, closeTalkBox : function () {
        if (this.talkBoxObj) {
            APP.removeNode(this.talkBoxObj.$talkBoxElem);
            this.talkType == "reply" ? this.$replyElem.removeCss("current-action") : this.$retweetElem.removeCss("current-action");
            try {
                delete this.talkBoxObj, delete this.statusListObj.currentTalkStatus
            } catch (e) {
                this.talkBoxObj = null, this.statusListObj.currentTalkStatus = null
            }
        }
    }});
    templates.dataLoading = '<div><p class="data-loading">\u6570\u636e\u52a0\u8f7d\u4e2d...</p></div>';
    var F = Class.extend({init : function (e) {
        this.$wrapperElem = e;
        this.$listElem = e.$("> ul").$(0);
        this.statusArray = []
    }, render : function () {
        this.$itemElems = this.$listElem.$("li");
        this.renderHandler()
    }, renderHandler : function () {
        this.$itemElems.each(function () {
            (new z($(this))).renderHandler()
        })
    }, addStatus : function () {
    },
        showMore : function () {
        }, deleteStatus : function () {
        }});
    WB.widget.statusList.StatusList = F.extend({init : function (e, f, g, h) {
        this._super(e);
        this.param = {extra : {param : "no"}, showEmotion : !0, showVote : !1, isPop : !1, url : "/rank/tweetV2.do", callBack : function () {
        }, scrollNode : null};
        if (h)for (var k in h)this.param[k] = h[k];
        if (g)this.callbackFuc = g;
        typeof f == "string" ? this.getStatusList(f) : typeof f == "object" ? this.render(f) : F.prototype.render.call(this)
    }, getStatusList : function (e) {
        var f = this;
        f.$listElem.attr("innerHTML", templates.dataLoading);
        APP.ajaxSend({requestUrl : e, dataType : "json", success : function (e) {
            f.render(e.status || e, e)
        }, error : function () {
            f.showTips("\u5bf9\u4e0d\u8d77\uff0c\u8bf7\u6c42\u51fa\u9519....")
        }, timeout : function () {
            f.showTips("\u5bf9\u4e0d\u8d77\uff0c\u8bf7\u6c42\u8d85\u65f6....")
        }})
    }, showTips : function (e) {
        e && e !== "" && this.$listElem.attr("innerHTML", '<div style="padding:23px 0 0 33px; height:100px;">            <div class="contentbox-cautionbox">               <em class="caution-icon"></em>               <p class="caution-tip">                  <em class="caution-arrow"></em>                  ' + e + "               <p>            </div>         </div>")
    }, render : function (e, f) {
        e && e.length == 0 ? this.showTips("\u6682\u65f6\u65e0\u6570\u636e....") : (this.$listElem.innerHTML = this.buildFloor(e), this._super());
        this.callbackFuc && this.callbackFuc(e, f);
        var g = new WB.Float({scrollNode : this.param.scrollNode});
        this.$wrapperElem.$(".js-status-float").each(function (e, f) {
            g.bind(f, f.getAttribute("nickname"))
        })
    }, buildFloor : function (e) {
        for (var f = [], g, h = 0; g = e[h]; h++)g && (f[h] = $.util.parseTpl(templates.status, WB.parseStatusObj(g)));
        return f.join("")
    }, renderHandler : function () {
        var e = this;
        e.$itemElems.each(function () {
            e.statusArray.push(new WB.widget.status.NormalStatus($(this), e, e.param))
        });
        e.initLog()
    }, initLog : function () {
        var e = this.$listElem.getAttribute("data-log-reply"), f = this.$listElem.getAttribute("data-log-retweet"), g = this.$listElem.getAttribute("data-log-fav");
        if (e || f || g)this.log = {}, this.log._reply = e || null, this.log._retweet = f || null, this.log._fav = g || null
    }, addNewStatus : function (e) {
        e = new WB.widget.status.NormalStatus(e, this, this.param);
        e.$itemElem.addCss({opacity : 0});
        e.$itemElem.animate({opacity : 1}, 0.5, "linear");
        this.statusArray.push(e)
    }, closeCurrentTalk : function () {
        this.currentTalkStatus && this.currentTalkStatus.closeTalkBox()
    }, closeCurrentVideo : function () {
        this.currentPlayVideo && this.currentPlayVideo.hideFlash()
    }, closeAllActive : function () {
        this.closeCurrentTalk();
        this.closeCurrentVideo()
    }, currentActiveStatus : function () {
        if (this.currentPlayVideo || this.currentTalkStatus)return!0;
        return!1
    }});
    var D = WB.PagerView.extend({render : function (e) {
        this.container = this.wraperId = e;
        this._calculate();
        e = "";
        this.options.pageCount > 1 && (e += this.options.index != 1 ? '<li><a  href="javascript://1">\u9996\u9875</a></li><li><a href="javascript://' + (this.options.index - 1) + '">\u4e0a\u4e00\u9875</a></li>' : "");
        this.options.pageCount > 1 && (e += this.options.index != this.options.pageCount ? '<li><a href="javascript://' + (this.options.index + 1) + '" >\u4e0b\u4e00\u9875</a></li><li><a  href="javascript://' + this.options.pageCount + '">\u5c3e\u9875</a></li>' : "");
        this.container.innerHTML = e;
        this.bind()
    }}), B = z.extend({init : function (e, f) {
        this.statusObj = f.statusObj;
        this.$textAreaElem = f.$textAreaElem;
        this.$statusListElem = f.$listElem;
        this.talkBox = f.sendBoxObj;
        this.param = f.param;
        this._super(e)
    }, render : function (e) {
        var e = e.status || e, f = this, g = username = text = publishTime = "", g = e.user.screen_name;
        username = e.user.name;
        publishTime = e.created_at;
        text = e.text;
        f._id = e.id;
        f.$itemElem = $(APP.appendHtmlNode("<li sid=" + e.id + '>            <span class="link-la"><a class="js-username js-status-float" href="/' + g + '" screenName=' + g + " nickname=" + username + ">" + username + '</a>\uff1a<span class="js-text" content="' + text + '">' + e.richText + '</span></span>            <span class="status-talk-time">' + publishTime + '</span>            <p><a title="\u56de\u590d\u8fd9\u6761\u8bc4\u8bba" class="link-lb js-reply" hidefocus="true" href="javascript:;">\u56de\u590d</a></p>         </li>')[0]);
        (e = f.$statusListElem.$("> li")[0]) ? APP.insertBefore(f.$itemElem, e) : (f.$itemElem.className = "noBg", f.$statusListElem.appendChild(f.$itemElem));
        f.$itemElem.addCss("opacity:0;");
        f.$itemElem.animate({opacity : 1}, 0.5, "linear", function () {
            f.$itemElem.style.opacity = ""
        });
        var h = new WB.Float({scrollNode : f.param.scrollNode});
        f.$itemElem.$(".js-status-float").each(function (e, f) {
            h.bind(f, f.getAttribute("nickname"))
        });
        f._super();
        return this
    }, renderHandler : function () {
        var e = this;
        e.$replyElem ? e.$replyElem.addEvent("click", function () {
            e.replyHandler()
        }) : e.$retweetElem.addEvent("click", function () {
            e.retweetHandler()
        })
    }, replyHandler : function () {
        var e = "\u56de\u590d@" + this._username;
        this.talkBox.quoteText = "||@" + this._username + "\uff1a" + this._text;
        this.talkBox.screenName = this._screenName;
        this.$textAreaElem.value.hasString(e) ? APP.focus(this.$textAreaElem) : (this.$textAreaElem.value = e + "\uff1a", APP.focus(this.$textAreaElem), APP.fireEvent(this.$textAreaElem, "mousemove"), this.statusObj._id = this._id)
    }, retweetHandler : function () {
        var e = " ||@" + this._username + "\uff1a" + this._text;
        this.talkBox.screenName = this._screenName;
        this.$textAreaElem.value.hasString(e) ? (this.$textAreaElem.focus(), APP.setCursorTo(this.$textAreaElem, 0)) : (this.$textAreaElem.value = e, this.$textAreaElem.focus(), APP.setCursorTo(this.$textAreaElem, 0), APP.fireEvent(this.$textAreaElem, "mousemove"))
    }}), G = F.extend({init : function (e, f) {
        this._id = e._id;
        this.param = e.param;
        this._talkType = f;
        this._flag = !0;
        this.statusObj = e;
        this.talkBoxObj = this.statusObj.talkBoxObj;
        this.sendBoxObj = this.talkBoxObj.sendAreaObj.sendBoxObj;
        this.$textAreaElem = this.talkBoxObj.sendAreaObj.$textAreaElem;
        this.$bodyElem = this.talkBoxObj.$talkBoxElem.$(".js-body").$(0);
        this.$wrapperElem = this.$bodyElem.$(".js-list").$(0);
        this.$viewAllElem = this.$bodyElem.$(".js-viewAll").$(0);
        this.$countElem = this.$bodyElem.$(".js-count").$(0);
        this.$pagerElem = this.$bodyElem.$(".js-page").$(0);
        this.$shrinkElem = this.talkBoxObj.$shrinkElem;
        this._super(this.$wrapperElem);
        this.getStatusList(1)
    }, getStatusList : function (e) {
        var f = this, g = "";
        f.$shrinkElem.addCss("display:none;");
        f.$bodyElem.addCss("status-talk-loading");
        g = f._talkType == "reply" ? $.util.simpleParse("/rank/allReplies/<#=statusId#>.json", {statusId : f._id}) : $.util.simpleParse("/rank/allRetweets.do?statusid=<#=statusid#>", {statusid : f._id});
        APP.ajaxSend({requestUrl : g, dataType : "json", param : {page : e, rnd : APP.getRandomNum()}, success : function (e) {
            f.$bodyElem.removeCss("status-talk-loading");
            f.render(e)
        }, error : function () {
        }, timeout : function () {
        }})
    }, render : function (e) {
        var f = this, g = e.result;
        f._totalCount = e.count;
        f.statusObj.setNewNum(f._totalCount, f._talkType);
        f.statusObj._replyNum = f._totalCount;
        if (f._totalCount == 0)f.$bodyElem.addCss("display:none;"); else {
            for (var e = [], h = username = text = publishTime = classname = "", k = "", l = 0, m = g.length; l < m; l++)l == m - 1 && (classname = ' class="noBg"'), h = g[l].user.screen_name, username = g[l].user.name, text = g[l].text, k = g[l].richText, publishTime = g[l].created_at, tmpStr = f._talkType == "reply" ? "<li" + classname + " sid=" + g[l].id + '>                  <span class="link-la"><a class="js-username js-status-float" href="/' + h + '" screenName=' + h + " nickname=" + username + ">" + username + '</a>\uff1a<span class="js-text" content="' + text + '">' + k + '</span></span>                  <span class="status-talk-time">' + publishTime + '</span>                  <p><a title="\u56de\u590d\u8fd9\u6761\u8bc4\u8bba" class="link-lb js-reply" hidefocus="true" href="javascript:;">\u56de\u590d</a></p>               </li>' : "<li" + classname + " sid=" + g[l].id + '>                  <span class="link-la"><a class="js-username js-status-float" href="/' + h + '" screenName=' + h + " nickname=" + username + ">" + username + '</a>\uff1a<span class="js-text" content="' + text + '">' + k + '</span></span>                  <span class="status-talk-time">' + publishTime + '</span>                  <p><a title="\u8f6c\u53d1" class="link-lb js-retweet" hidefocus="true" href="javascript:;">\u8f6c\u53d1</a></p>               </li>', e.push(tmpStr);
            f.$listElem.attr("innerHTML", e.join(""));
            f._super();
            f.$countElem.attr("innerHTML", f._totalCount);
            f.$shrinkElem.style.display = "";
            var n = new WB.Float({scrollNode : f.param.scrollNode});
            f.$wrapperElem.$(".js-status-float").each(function (e, f) {
                n.bind(f, f.getAttribute("nickname"))
            });
            if (f._flag)f.$viewAllElem.style.display = "", g = new D({itemCount : f._totalCount, size : 10}), g.onclick = function (e) {
                f.getStatusList(e)
            }, g.render(f.$pagerElem), f._flag = !1
        }
    }, renderHandler : function () {
        var e = this;
        e.$itemElems.each(function (f, g) {
            new B($(g), e)
        })
    }, addNewStatus : function (e) {
        this._totalCount = this.statusObj._replyNum;
        this.$countElem.attr("innerHTML", this._totalCount);
        new B(e, this)
    }}), J = templates.status_tpl.replace("[=STATUS_LEFT_CODE=]", '   <span class="icon-transmit">      <span class="transmit-num"><#=retweetCount#></span>      <span class="transmit-title"><#=title#></span>   </span>').replace("[=STATUS_TOP_CLASS=]", "").replace("[=STATUS_CENTER_CLASS=]", "\uff1a").replace("[=STATUS_TOP_CODE=]", "").replace("[=STATUS_BOTTOM_CODE=]", '<# if (isSelf) { #><# } #>            <a class="js-retweet" title="\u8f6c\u53d1\u8fd9\u6761\u5fae\u535a" hidefocus="true" href="javascript:;">\u8f6c\u53d1<em><# if (retweetCount != 0) { #>(<#=retweetCount#>)<# } #></em></a>            <i>|</i><# if (!fav) { #>            <a class="js-fav" data-fav="0" title="\u6536\u85cf\u8fd9\u6761\u5fae\u535a" hidefocus="true" href="javascript:;">\u6536\u85cf</a><# } else { #>            <a class="js-fav" data-fav="1" title="\u53d6\u6d88\u6536\u85cf\u8fd9\u6761\u5fae\u535a" hidefocus="true" href="javascript:;">\u53d6\u6d88\u6536\u85cf</a><# } #>            <i>|</i>            <a class="js-reply" title="\u8bc4\u8bba\u8fd9\u6761\u5fae\u535a" href="javascript:;" hidefocus="true">\u8bc4\u8bba<em><# if (replyCount != 0) { #>(<#=replyCount#>)<# } #></em></a>');
    WB.widget.statusList.HotStatusList = WB.widget.statusList.StatusList.extend({init : function (e, f, g, h) {
        this._super(e, f, g, h);
        this._title = "\u8f6c\u53d1"
    }, buildFloor : function (e) {
        for (var f = [], g, h = 0; g = e[h]; h++)if (g)g = WB.parseStatusObj(g), g.title = this._title, f[h] = $.util.parseTpl(J, g);
        return f.join("")
    }});
    templates.opstatus = templates.status_tpl.replace("[=STATUS_LEFT_CODE=]", '   <span class="status-author">      <a title="<#=name#>" href="/<#=screen_name#>" target="_blank"><img class="thumb js-status-float" nickname="<#=name#>" alt="<#=name#>" src="<#=profile_image#>" /></a>     <span class="status-follow-wraper">     <#if(screen_name==WB.User.screenName){#>           <a  href="javascript:;" class="remove-focusS">\u4f60\u81ea\u5df1</a>     <#}else if(isFollowing==true){#>           <a  href="javascript:;" class="remove-focusS">\u5df2\u5173\u6ce8</a>     <#}else{#>      <a  href="javascript:;" class="add-focusS js-follow"><em class="add-signS">+</em>\u5173\u6ce8</a>      <#}#>   </span>   </span>   ').replace("[=STATUS_TOP_CLASS=]", "").replace("[=STATUS_TOP_CODE=]", "").replace("[=STATUS_CENTER_CODE=]", "\uff1a").replace("[=STATUS_BOTTOM_CODE=]", '<# if (isSelf) { #><# } #>            <a class="js-retweet" title="\u8f6c\u53d1\u8fd9\u6761\u5fae\u535a" hidefocus="true" href="javascript:;">\u8f6c\u53d1<em><# if (retweetCount != 0) { #>(<#=retweetCount#>)<# } #></em></a>            <i>|</i><# if (!fav) { #>            <a class="js-fav" data-fav="0" title="\u6536\u85cf\u8fd9\u6761\u5fae\u535a" hidefocus="true" href="javascript:;">\u6536\u85cf</a><# } else { #>            <a class="js-fav" data-fav="1" title="\u53d6\u6d88\u6536\u85cf\u8fd9\u6761\u5fae\u535a" hidefocus="true" href="javascript:;">\u53d6\u6d88\u6536\u85cf</a><# } #>            <i>|</i>            <a class="js-reply" title="\u8bc4\u8bba\u8fd9\u6761\u5fae\u535a" href="javascript:;" hidefocus="true">\u8bc4\u8bba<em><# if (replyCount != 0) { #>(<#=replyCount#>)<# } #></em></a>');
    var K = templates.opstatus;
    WB.widget.statusList.OpStatusList = WB.widget.statusList.StatusList.extend({init : function (e, f, g, h) {
        this._super(e, f, g, h);
        this._title = "\u8f6c\u53d1"
    }, buildFloor : function (e) {
        for (var f = [], g, h = 0; g = e[h]; h++)if (g)g.title = this._title, f[h] = $.util.parseTpl(K, WB.parseStatusObj(g));
        return f.join("")
    }})
})(window);
(function () {
    function e(e, f, k) {
        if (arguments.length)this._wrapperId = e, this._wrapperClass = f, this._wrapperTemplatesHtml = k, this.wrapperElem = $(document.createElement("DIV")), this.wrapperElem.id = this._wrapperId, this.wrapperElem.className = this._wrapperClass, this.wrapperElem.innerHTML = this._wrapperTemplatesHtml, $(document.body).appendChild(this.wrapperElem), this.popupWinLayer = new $.ui.WinLayer(this.wrapperElem, !0, "display", !0)
    }

    var f = {url : {actionUpdate : "/article/updatetweet"}}, k = {popupWin : '<table class="dialogLayer-table">      <tbody>         <tr>            <td class="dialogLayer-top-left"></td>            <td class="dialogLayer-top-center"></td>            <td class="dialogLayer-top-right"></td>         </tr>         <tr>            <td class="dialogLayer-middle-left"></td>            <td class="dialogLayer-middle-center">               <div class="dialogLayer-content">               <div class="dialogLayer-hd hd js-move">                  <h3><#=head#></h3>                  <a class="dialogLayer-close close-btn" href="javascript:;" title="\u5173\u95ed"></a>               </div>                  <div class="dialogLayer-bd">                     <#=content#>                  </div>               </div>            </td>            <td class="dialogLayer-middle-right"></td>         </tr>         <tr>            <td class="dialogLayer-bottom-left"></td>            <td class="dialogLayer-bottom-center"></td>            <td class="dialogLayer-bottom-right"></td>         </tr>      </tbody>     </table>',
        popupSendBox : '<div class="popup-textarea"><textarea class="js-textarea" id="popSendBox" autocomplete="off" tabindex="1"></textarea></div>       <div class="popup-sendbox-ft">       <#if(ispreview==true){#>       <div class="fl pop-pic-preview" id="pic-preview">                <em class="icon-uploadPic" id="pic-preview-icon"></em>                <span id="pic-preview-text">\u6d3b\u52a8\u5c01\u9762</span>                <a title="\u5173\u95ed" class="close-icon" href="javascript:;" id="pic-preview-del">\u5173\u95ed</a>                <div class="pop-pic-wrapper" id="pic-preview-wraper" style="display:none;">                        <table class="winlayer-table">                               <tbody>                                    <tr>                                          <td class="winlayer-top-left"></td>                                          <td class="winlayer-top-center">                                             <em class="winlayer-arrow-default"></em>                                          </td>                                          <td class="winlayer-top-right"></td>                                    </tr>                                    <tr>                                          <td class="winlayer-middle-left"></td>                                          <td class="winlayer-middle-center winlayer-content">                                             <div class="pop-pic-content">                                                <div class="pop-pic-show">                                                   <img src="<#=imageUrl#>">                                                </div>                                             </div>                                          </td>                                          <td class="winlayer-middle-right"></td>                                     </tr>                                     <tr>                                          <td class="winlayer-bottom-left"></td>                                          <td class="winlayer-bottom-center"></td>                                          <td class="winlayer-bottom-right"></td>                                     </tr>                             </tbody>                       </table>                 </div>          </div>          <#}#>          <span class="insertFace js-face"><em class="icon-face"></em></span>          <em class="popup-splite-line"></em>          <span class="popup-sendinfoTip js-sendInfo">\u8fd8\u53ef\u8f93<span class="char-constantia">163</span>\u5b57</span>          <a hidefocus="true" title="\u6309Ctrl+Enter\u952e\u53d1\u5fae\u535a" onclick="this.blur();" href="javascript:;" class="popup-btn js-sendBtn"><em>\u53d1\u9001</em></a>       </div>',
        popupMessageSendBox : '<div class="popup-textarea"><textarea class="js-textarea" id="popSendBox" tabindex="1"></textarea></div>       <div class="popup-sendbox-ft">          <span class="popup-sendinfoTip js-sendInfo">\u8fd8\u53ef\u8f93<span class="char-constantia">163</span>\u5b57</span>          <a hidefocus="true" title="\u6309Ctrl+Enter\u952e\u53d1\u5fae\u535a" onclick="this.blur();" href="javascript:;" class="popup-btn js-sendBtn"><em>\u53d1\u9001</em></a>       </div>', confirms : '<div class="popup-content"><#=message#></div>       <a class="popup-btn close-btn js-confirm" id="popConfirm" href="javascript:;" hidefocus="true"><em><#=confirmButtonText#></em></a>       <a class="popup-btn close-btn js-cancel" href="javascript:;" id="cancelBtn" hidefocus="true"><em><#=cancelButtonText#></em></a>',
        confirm : '<div class="popup-content"><#=message#></div>       <a class="popup-btn close-btn js-confirm" id="popConfirm"  href="javascript:;" hidefocus="true"><em><#=confirmButtonText#></em></a>'};
    e.prototype.show = function () {
        this.popupWinLayer.show()
    };
    e.prototype.hide = function () {
        this.popupWinLayer.hide()
    };
    WB.showTweetBox = function (g) {
        var h = {titleText : "\u8f6c\u53d1\u5230\u5fae\u535a", defaultValue : "", source : "\u7f51\u6613\u5fae\u535a", audit : {keyfrom : "no"}, url : f.url.actionUpdate, ispreview : !1, imageUrl : "",
            success : function () {
            }, linkUrl : ""}, m;
        for (m in g)h[m] = g[m];
        g = {ispreview : h.ispreview, imageUrl : WB.oimage({width : 120, height : 120, url : encodeURIComponent(h.imageUrl)})};
        m = {head : h.titleText, content : $.util.parseTpl(k.popupSendBox, g)};
        m = new e("PopsendBoxWin", "dialogLayer", $.util.parseTpl(k.popupWin, m));
        m.show();
        var n = new WB.widget.sendBox.Popup_SendBox($("#PopsendBoxWin"), h.defaultValue, m, {source : h.source, url : h.url, audit : h.audit, imageUrl : h.imageUrl, success : h.success, linkUrl : h.linkUrl});
        n.render();
        g.ispreview == !0 && ($("#pic-preview-del").addEvent("click", function () {
            $("#pic-preview").innerHTML = "";
            n.options.imageUrl = ""
        }), $("#pic-preview-icon").addEvent("mouseover", function () {
            $("#pic-preview-wraper").style.display = "block"
        }).addEvent("mouseout", function () {
            $("#pic-preview-wraper").style.display = "none"
        }), $("#pic-preview-text").addEvent("mouseover", function () {
            $("#pic-preview-wraper").style.display = "block"
        }).addEvent("mouseout", function () {
            $("#pic-preview-wraper").style.display = "none"
        }));
        return m
    };
    WB.showConfirmBox = function (f) {
        var h = {titleText : "\u786e\u5b9a", confirmButtonText : "\u786e\u5b9a", message : "\u786e\u5b9a\uff1f", confirmFun : function () {
        }}, m;
        for (m in f)h[m] = f[m];
        var f = {head : h.titleText, content : $.util.parseTpl(k.confirm, {message : h.message, confirmButtonText : h.confirmButtonText})}, n = new e("messageWin", "dialogLayer", $.util.parseTpl(k.popupWin, f));
        n.show();
        $("#popConfirm").addEvent("click", function () {
            h.confirmFun.apply(h);
            setTimeout(function () {
                n.hide()
            }, 1E3)
        });
        return n
    };
    WB.showConfirmsBox = function (f) {
        var h = {titleText : "\u786e\u5b9a\u53d6\u6d88",
            confirmButtonText : "\u786e\u5b9a", cancelButtonText : "\u53d6\u6d88", message : "\u786e\u5b9a\uff1f", confirmFun : function () {
            }, cancelFun : function () {
            }}, m;
        for (m in f)h[m] = f[m];
        var f = {head : h.titleText, content : $.util.parseTpl(k.confirms, {message : h.message, confirmButtonText : h.confirmButtonText, cancelButtonText : h.cancelButtonText})}, n = new e("messageWin", "dialogLayer", $.util.parseTpl(k.popupWin, f));
        n.show();
        $("#popConfirm").addEvent("click", function () {
            h.confirmFun.apply(h);
            setTimeout(function () {
                n.hide()
            }, 1E3)
        });
        $("#cancelBtn").addEvent("click", function () {
            h.cancelFun.apply(h)
        });
        return n
    };
    WB.showErrorBox = function (f) {
        var h = {titleText : "\u53d1\u751f\u9519\u8bef", confirmButtonText : "\u786e\u5b9a", message : "\u53d1\u751f\u9519\u8bef", confirmFun : function () {
        }}, m;
        for (m in f)h[m] = f[m];
        var f = {head : h.titleText, content : $.util.parseTpl(k.confirm, {message : '<span class="popup-type icon-forbidB"></span>' + h.message, confirmButtonText : h.confirmButtonText})}, n = new e("messageWin", "dialogLayer", $.util.parseTpl(k.popupWin, f));
        n.show();
        $("#popConfirm").addEvent("click", function () {
            h.confirmFun.apply(h);
            setTimeout(function () {
                n.hide()
            }, 1E3)
        });
        return n
    };
    WB.showSuccessBox = function (f) {
        var h = {titleText : "\u64cd\u4f5c\u6210\u529f", confirmButtonText : "\u786e\u5b9a", message : "\u64cd\u4f5c\u6210\u529f", confirmFun : function () {
        }}, m;
        for (m in f)h[m] = f[m];
        var f = {head : h.titleText, content : $.util.parseTpl(k.confirm, {message : '<span class="popup-type icon-correctB"></span>' + h.message, confirmButtonText : h.confirmButtonText})}, n = new e("messageWin", "dialogLayer", $.util.parseTpl(k.popupWin, f));
        n.show();
        $("#popConfirm").addEvent("click", function () {
            h.confirmFun.apply(h);
            setTimeout(function () {
                n.hide()
            }, 1E3)
        });
        return n
    };
    WB.showWarnningBox = function (f) {
        var h = {titleText : "\u8b66\u544a", confirmButtonText : "\u786e\u5b9a", message : "\u8b66\u544a", confirmFun : function () {
        }}, m;
        for (m in f)h[m] = f[m];
        var f = {head : h.titleText, content : $.util.parseTpl(k.confirm, {message : '<span class="popup-type icon-inquireB"></span>' + h.message, confirmButtonText : h.confirmButtonText})}, n = new e("messageWin", "dialogLayer", $.util.parseTpl(k.popupWin, f));
        n.show();
        $("#popConfirm").addEvent("click", function () {
            h.confirmFun.apply(h);
            setTimeout(function () {
                n.hide()
            }, 1E3)
        });
        return n
    };
    WB.showSendMesBox = function (f) {
        var h = {titleText : "\u53d1\u9001\u79c1\u4fe1", userName : "", audit : {keyfrom : "no"}}, m;
        for (m in f)h[m] = f[m];
        f = new e("PopsendBoxWin", "dialogLayer", $.util.parseTpl(k.popupWin, {head : h.titleText, content : k.popupMessageSendBox}));
        f.show();
        (new WB.widget.sendBox.Popup_SendMessageBox($("#PopsendBoxWin"), f, h.userName)).render();
        return f
    };
    WB.showCustomBox = function (f) {
        var h = {titleText : "\u6587\u672c", template : ""}, m;
        for (m in f)h[m] = f[m];
        f = new e("customWin", "dialogLayer", $.util.parseTpl(k.popupWin, {head : h.titleText, content : h.template}));
        f.show();
        return f
    };
    WB.showReTweetBox = function (f) {
        var h = {titleText : "\u8f6c\u53d1\u5230\u5fae\u535a", defaultValue : "", param : {keyfrom : "no"}, url : "", _id : "", isRetweet : 2, success : function () {
        }}, m;
        for (m in f)h[m] = f[m];
        f = {head : h.titleText, content : $.util.parseTpl(k.popupSendBox, {ispreview : !1})};
        f = new e("PopsendBoxWin", "dialogLayer", $.util.parseTpl(k.popupWin, f));
        f.show();
        (new WB.widget.sendBox.PopupR_SendBox($("#PopsendBoxWin"), h.defaultValue, f, {url : h.url, param : h.param, success : function () {
        }, isRetweet : h.isRetweet, _id : h._id})).render();
        return f
    }
})();
