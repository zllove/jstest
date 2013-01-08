var tnDropDown = function (options) {
    this.SetOptions(options);
    this.topNav = $('#' + this.options.topNav);
    this.ddButton = this.options.ddButton;
    this.ddList = this.options.ddList;
    this.Init()
};
tnDropDown.prototype = {SetOptions:function (options) {
    this.options = {topNav:'topNav', ddButton:['tnCommunity', 'tnHelp', 'tnLanguage'], ddList:['tnCommunityList', 'tnHelpList', 'tnLanguageList']};
    $.extend(this.options, options || {})
}, Init:function () {
    this.timer = {};
    this.but = {};
    this.list = {};
    for (var i = 0; i < this.ddButton.length; i++) {
        if (!document.getElementById(this.ddButton[i])) {
            continue
        }
        this.timer[i] = {};
        this.but[i] = $('#' + this.ddButton[i]);
        this.list[i] = $('#' + this.ddList[i])
    }
    this.Active()
}, Active:function () {
    var self = this;
    for (var i in this.but) {
        this.but[i][0].guid = i;
        this.list[i][0].guid = i;
        this.but[i].mouseenter(function () {
            var $this = $(this);
            if (self.timer[this.guid]) {
                clearTimeout(self.timer[this.guid])
            }
            $this.addClass('tn-active');
            self.list[this.guid].css({display:'block', left:$this.offset().left - self.topNav.offset().left, width:self.list[this.guid].width()});
            if (self.list[this.guid].attr('id') == 'tnLanguageList') {
                self.list[this.guid].css({left:'auto', right:0})
            }
        }).mouseleave(function () {
            var _this = this, $this = $(this);
            self.timer[this.guid] = setTimeout(function () {
                $this.removeClass('tn-active');
                self.list[_this.guid].css({display:'none'})
            }, 50)
        });
        this.list[i].mouseenter(function () {
            if (self.timer[this.guid]) {
                clearTimeout(self.timer[this.guid])
            }
        }).mouseleave(function () {
            var _this = this;
            self.timer[this.guid] = setTimeout(function () {
                self.but[_this.guid].removeClass('tn-active');
                self.list[_this.guid].css({display:'none'})
            }, 50)
        })
    }
}};
var searchSimulationSelect = function (options) {
    this.SetOptions(options);
    this.catalogBox = $('#' + this.options.catalogBox);
    this.catalogWarp = $('#' + this.options.catalogWarp);
    this.catalog = $('#' + this.options.catalog);
    this.catalogId = $('#' + this.options.catalogId);
    this.catalogListBox = $('#' + this.options.catalogListBox);
    this.catalogListLi = $('#' + this.options.catalogListBox + ' > ul > li').not('.sub-line');
    this.reverseCatalog = this.options.reverseCatalog;
    this.url = this.options.url;
    this.isIE6 = $.browser.version;
    this.Init()
};
searchSimulationSelect.prototype = {SetOptions:function (options) {
    this.options = {catalogBox:'catalogBox', catalogWarp:'catalogWarp', catalog:'catalog', catalogId:'catalogId', catalogListBox:'catalogListBox', catalogList:'catalogList', url:null, reverseCatalog:[]};
    $.extend(this.options, options || {})
}, Init:function () {
    this.OpenCatalogList()
}, OpenCatalogList:function () {
    var _this = this;
    this.__index = 0;
    this.catalogBox.click(function (event) {
        event.stopPropagation();
        if (_this.catalogListBox.css('display') == 'none') {
            _this.catalogListBox.css({display:'block'});
            _this.GetCatalogContent()
        } else {
            _this.catalogListBox.css({display:'none'});
            _this.HighlightDefaultStatus()
        }
    })
}, AddOtherCatalog:function () {
    if (this.reverseCatalog.length == 0)return;
    var __catalogContent = '';
    for (var i = 0; i < this.reverseCatalog.length; i++) {
        __catalogContent += '<li catalogId="' + this.reverseCatalog[i][1] + '">' + this.reverseCatalog[i][0] + '</li>'
    }
    this.catalogList.prepend(__catalogContent)
}, GetCatalogContent:function () {
    if (this.GetCatalogContent.__index == 1) {
        return
    }
    var _this = this;
    $.ajax({url:_this.url, type:'GET', dataType:'jsonp', cache:false, success:function (data) {
        _this.catalogListBox.append(data.cate);
        _this.catalogList = $('#' + _this.options.catalogList);
        _this.AddOtherCatalog();
        _this.catalogListLi = $('#' + _this.options.catalogListBox + ' > ul > li').not('.sub-line');
        $(_this.catalogListLi[0]).addClass('hover');
        _this.SelectCatalog();
        _this.ClickCatalogText();
        _this.Close()
    }});
    this.GetCatalogContent.__index = 1
}, SelectCatalog:function () {
    var _this = this;
    for (var i = 0; i < this.catalogListLi.length; i++) {
        this.catalogListLi[i].__index = i;
        $(_this.catalogListLi[i]).mouseover(function () {
            if (this.__index == _this.__index) {
                return
            }
            $(this).addClass('hover');
            $(_this.catalogListLi[_this.__index]).removeClass('hover');
            _this.__index = this.__index
        })
    }
}, ClickCatalogText:function () {
    if (this.isIE6 == '6.0') {
        this.IE6AddIframe()
    }
    var _this = this;
    $(this.catalogList).click(function (event) {
        var evt = event.target, evtJQ = $(evt);
        if (evt.nodeName == 'LI' && !evtJQ.hasClass('sub-line')) {
            _this.catalogWarp.css({width:'auto'});
            _this.catalog.text(evtJQ.text());
            _this.catalogBox.css({width:_this.catalog.outerWidth(true)});
            _this.catalogId.val(evtJQ.attr('catalogId'))
        }
    })
}, IE6AddIframe:function () {
    if (this.catalogListBox.children("iframe")[0])return;
    var oHeight, oWidth, oIframe;
    oHeight = this.catalogList.height() + 2;
    oWidth = this.catalogList.width() + 2;
    this.catalogListBox.append("<iframe></iframe>");
    oIframe = this.catalogListBox.children("iframe");
    oIframe.css({position:"absolute", top:0, left:0, opacity:0, "z-index":-1, height:oHeight, width:oWidth, border:0})
}, HighlightDefaultStatus:function () {
    $(this.catalogListLi[0]).addClass('hover');
    if (!!this.__index) {
        $(this.catalogListLi[this.__index]).removeClass('hover');
        this.__index = 0
    }
}, Close:function () {
    var _this = this;
    $(document).click(function () {
        if (_this.catalogListBox.css('display') == 'block') {
            _this.catalogListBox.css({display:'none'});
            _this.HighlightDefaultStatus()
        }
    })
}};