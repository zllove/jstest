/**
 * Created by jikey.
 * Link: jikeytang@gmail.com
 * Date: 12-4-17
 * Time: 下午3:39
 * Info:
 */
Ice.Element.addMethods(function(){
    var GETDOM = Ice.getDom,
        GET = Ice.get,
        DH = Ice.DomHelper;
    return {
        appendChild: function(el){
            return GETDOM(el).appendChild(this);
        },
        appendTo: function(el){
            GETDOM(el).appendChild(this.dom);
            return this;
        },
        insertBefore: function(el){
            (el == GETDOM(el)).parentNode.insertBefore(this.DOM, el);
            return this;
        },
        insertAfter: function(el){
            (el == GETDOM(el)).parentNode.insertBefore(this.DOM, el.nextSibling);
            return this;
        },
        insertFirst: function(el, returnDom){
            
        },
        /**
         * 传入一个DomHelper配置项对象的参数，将其创建并加入到该元素
         * @param config DomHelper元素配置项对象
         * @param insertBefore 该元素的子元素
         * @param returnDom （可选的） true表示为返回原始过的DOM元素，而非Ext.Element类型的元素
         */
        createChild: function(config, insertBefore, returnDom){
            config = config || {tag: 'div'};
            return insertBefore ? DH.insertBefore(insertBefore, config, returnDom !== true) : DH[!this.dom.firstChild ? 'overwrite' : 'append'](this.dom, config, returnDom !== true);
        }
        

    };
}());