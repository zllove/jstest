/**
 * Created by jikey.
 * Link: jikeytang@gmail.com
 * Date: 12-4-18
 * Time: 上午10:22
 * Info:
 */
Ice.DomHelper = function(){
    var tempTableEl = null,
        emptyTags = /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i,
        tableRe = /^table|tbody|tr|td$/i,
        confRe = /tag|children|cn|html$/i,
        tableElRe = /td|tr|tbody/i,
        cssRe = /([a-z0-9-]+)\s*:\s*([^;\s]+(?:\s*[^;\s]+)*);?/gi,
        endRe = /end/i,
        pub,
        afterbegin = 'afterbegin',
        afterend = 'afterend',
        beforebegin = 'beforebegin',
        beforeend = 'beforeend',
        ts = '<table>',
        te = '</table>',
        tbs = ts+'<tbody>',
        tbe = '</tbody>'+te,
        trs = tbs + '<tr>',
        tre = '</tr>'+tbe;
    // 私有
    /**
     * 插入私有方法
     * @param el dom元素
     * @param o 插入的html
     * @param returnElement boolean 返回元素 如果为true，返回 ice 元素
     * @param pos 插入位置
     * @param sibling
     * @param append
     */
    function doInsert(el, o, returnElement, pos, sibling, append){
        var newNode = pub.insertHtml(pos, Ice.getDom(el), createHtml(o));
        return returnElement ? Ice.get(newNode, true) :newNode;
    }

    /**
     * 创建html
     * @param o
     * {tag:string,　　　　　　　　　　    // 元素的标记名，如果没有，默认为div
         children|cn:string|Array|json,　// 子结点对应的json数组或字节点的html或单个json
         html:string,　　　　　　　　　　  // 对应的html，如果有cn或children属性就忽略
         style:function|string|json,　　 // 元素的样式，可以是函数，字符串，json对象
         cls:string,　　　　　　　　　　　 // 元素的class属性的值
         htmlFor:string　　　　　　　　　  // 元素的For属性，
         x:y　　　　　　　　　　　　　　    // x表示其他名字，y表示非函数、非空内容
       }
         var spec = {
             id: 'my-ul',
             tag: 'ul',
             cls: 'my-list',
             style : {width:'20px',height:'30px'},
             // append children after creating
             children: [     // may also specify 'cn' instead of 'children'
                 {tag: 'li', id: 'item0', html: 'List Item 0'},
                 {tag: 'li', id: 'item1', html: 'List Item 1'},
                 {tag: 'li', id: 'item2', html: 'List Item 2'}
             ]
         };
     */
    function createHtml(o){
        var b = '',
            cn,
            attr,
            val,
            key;
        if(typeof o == 'string'){ // 若是 string 类型，直接返回
            b = o;
        } else if(Ice.isArray(o)){ // 若是 array 类型, 如: [{ tag: 'li', id: 'item0' }]
            for(var i=0,len=o.length; i<len; i++){
                if(o[i]){
                    b += createHtml(o[i]);
                }
            }
        } else { // 若是 object 类型
            b += '<' + (o.tag = o.tag || 'div'); // 若没有 o.tag 属性，则默认为 div,　如: <div
            for (attr in o) {
                val = o[attr];
                if(!confRe.test(attr)){ // 忽略 tag|children|cn|html，这四个是需自定义属性
                    if(typeof val == 'object'){ // 若是对象类型, 如: style : {width:'20px',height:'30px'}
                        b += ' ' + attr + '="'; // 如: style = "
                        for (key in val) {
                            b += key + ':' + val[key] + ';'; // 如: width=20px;height:30px
                        }
                        b += '"';
                    } else { // 若不是对象类型， 如: id: 'my-ul'
                        b += ' ' + ({cls: 'class', htmlFor: 'for'}[attr] || attr) + '="' + val + '"'; // class,for对象处理
                    }
                }
            }
            if(emptyTags.test(o.tag)){ // 根据xhtml规定，忽略单标签，如：　<hr />, <br />等
                b += '/>';
            } else {
                b += '>'; // 如: <div sytle="width=20px;height:30px">
                if(cn = o.children || o.cn){
                    b += createHtml(cn); // 如: <li id="item0">List Item 0</li><li id="item1">List Item 1</li>
                }
                b += '</' + o.tag + '>'; // 如: </div>
            }
        }
        return b; //　如: <ol style="width:20px;height:80px;"><li id="item0"></li></ol>
    } 
    /**
     * 插入table
     * @param depth 深度
     * @param s el
     * @param h where
     * @param e html
     */
    function ieTable(depth, s, h, e){
        tempTableEl.innerHTML = [s, h, e].join('');
        var i = -1,
            el = tempTableEl,
            ns;
        while(++i < depth){
            el = el.firstChild;
        }
        if(ns = el.nextSibling){
            var df = document.createDocumentFragment();
            while(el){
                ns = el.nextSibling;
                df.appendChild(el);
                el = ns;
            }
            el = df;
        }
        return el;
    }
    /**
     * 插入表格，因为表格的innerHTML是可读，所以特别处理
     * @param tag 插入的表格标签
     * @param el 内容元素
     * @param where 插入的html与el的位置关系
     * @param html HTML片段
     */
    function insertIntoTable(tag, el, where, html){
        var node, before;
        tempTableEl = tempTableEl || document.createElement('div');
        if(tag == 'td' && (where == afterbegin || where == beforeend) || !tableElRe.test(tag) && (where == beforebegin || where == afterend)) {
            return;
        }
        before = where == beforebegin ? el : where == afterend ? el.nextSibling : where == afterbegin ? el.firstChild : null;
        if(where == beforebegin || where == afterend){
            el = el.parentNode;
        }
        if(tag == 'td' || (tag == 'tr' && (where == beforeend || where == afterbegin))){
            node = ieTable(4, trs, html, tre);
        } else if((tag == 'tbody' && (where == beforeend || where == afterbegin)) || (tag == 'tr' && (where == beforebegin || where == afterend))) {
            node = ieTable(3, tbs, html, tbe);
        } else {
            node = ieTable(2, ts, html, te);
        }
        el.insertBefore(node, before);
        return node;
    }
    pub = {
        // createHtml 的公有方法
        makeup: function(o){
            return createHtml(o);
        },
        /**
         * 把指定的样式应用到元素
         * @param el String/HTMLElement 样式所应用的元素
         * @param styles String/Object/Function 表示样式的特定格式字符串，如“width:100px”，或是对象的形式如{width:"100px"}，或是能返回这些格式的函数
         */
        applyStyles: function(el, styles){
            if(styles){
                var matches;
                el = Ice.fly(el);
                if(typeof styles == 'function'){
                    styles.call();
                }
                if(typeof styles == 'string'){
                    cssRe.lastIndex = 0;
                    while((matches = cssRe.exec(styles))){
                        el.setStyle(matches[1], matches[2]);
                    }
                } else if(typeof styles == 'object'){
                    el.setStyle(styles);
                }
            }
        },
        /**
         * 向DOM中插入一个HTML片段
         * @param where 插入的html与el的位置关系--- beforeBegin, afterBegin, beforeEnd, afterEnd.
         * @param el 内容元素
         * @param html HTML片段
         */
        insertHtml: function(where, el, html){
            // innerHTML是只读的：col、 colgroup、frameset、html、 head、style、table、tbody、 tfoot、 thead、title 与 tr
            // http://www.cnblogs.com/rubylouvre/archive/2009/12/14/1622631.html
            var hash = {},
                hashVal,
                rs,
                range,
                setStart,
                frag,
                rangeEl;
            where = where.toLowerCase();
            hash[beforebegin] = ['beforeBegin', 'previousSibling'];
            hash[afterend] = ['afterEnd', 'nextSibling'];
            // 为了使后面的代码更易实现，这地方成两部分实现，
            // 1.　在当前节点的外边插入，就是if外边
            // 2. 在当前节点的里边插入，在if里边做判断
            if(el.insertAdjacentHTML){ // ie
                // 对ie的table进行单独处理
                if(tableRe.test(el.tagName) && (rs = insertIntoTable(el.tagName.toLowerCase(), where, el, html))){
                    return rs;
                }
                hash[afterbegin] = ['AfterBegin', 'firstChild'];
                hash[beforeend] = ['BeforeEnd', 'lastChild'];
                if((hashVal = hash[where])){
                    el.insertAdjacentHTML(hashVal[0], html);
                    return el[hashVal[1]];
                }
            } else { // 旧版 firefox, firefox 11 支持 insertAdjacentHTML
                range = el.ownerDocument.createRange();
                setStart = 'setStart' + (endRe.test(where) ? 'After' : 'Before');
                if(hash[where]){
                    // setStartAfter() 把该范围的开始点设置为紧邻指定节点的节点之后
                    // setStartBefore() 把该范围的开始点设置为紧邻指定节点之前
                    range[setStart](el);
                    // http://msdn.microsoft.com/zh-cn/library/hh673538(v=vs.85).aspx#createContextualFragment
                    frag = range.createContextualFragment(html); // http://www.cnblogs.com/rubylouvre/archive/2011/04/15/2016800.html
                    el.parentNode.insertBefore(frag, (beforebegin == where ? el : el.nextSibling));
                    return el[(beforebegin == where ? 'previous' : 'next') + 'Sibling'];
                } else {
                    rangeEl = (afterbegin == where ? 'first' : 'last') + 'Child';
                    if(el.firstChild){
                        range[setStart](el[rangeEl]);
                        frag = range.createContextualFragment(html);
                        if(afterbegin == where){
                            el.insertBefore(frag, el.firstChild);
                        } else {
                            el.appendChild(frag);
                        }
                    } else {
                        el.innerHTML = html;
                    }
                    return el[rangeEl];
                }
            }
            throw '非法插入点 -> "' + where + '"';
        },
        /**
         * 创建新的Dom元素并插入到el之前
         * @param el String/HTMLElement/Element 元素内容
         * @param o Object/String 指定的Dom对象（和子孙）或是裸HTML部分
         * @param returnElement Boolean true表示返回一个Ext.Element
         */
        insertBefore: function(el, o, returnElement){
            return doInsert(el, o, returnElement, beforebegin);
        },
        insertAfter: function(el, o, returnElement){
            return doInsert(el, o, returnElement, afterend, 'nextSibling');
        },
        insertFirst: function(el, o, returnElement){
            return doInsert(el, o, returnElement, afterbegin, 'firstChild');
        },
        append: function(el, o, returnElement){
            return doInsert(el, o, returnElement, beforeend, '', true);
        },
        // 创建新的 dom 元素并覆盖 el 的内容
        overwrite: function(el, o, returnElement){
            el = Ice.getDom(el);
            el.innerHTML = createHtml(o);
            return returnElement ? Ice.get(el.firstChild) : el.firstChild;
        },
        createHtml: createHtml
    };
    return pub;
}();
