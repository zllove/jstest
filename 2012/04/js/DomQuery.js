/**
 * Created by jikey.
 * Link: jikeytang@gmail.com
 * Date: 12-4-23
 * Time: 下午3:43
 * Info:
 */
Ice.DomQuery = function(){
    var cache = {},
        simpleCache = {};
    isIE = window.ActiveXObject ? true : false;
    return {
        jsSelect: function(){
        },
        isXML: function(el){
            var docEl = (el ? el.ownerDocument || el : 0).documentElement;
            return docEl ? docEl.nodeName !== 'HTML' : false;
        },
        select:document.querySelectorAll ? function(path, root, type){
            root = root || document;
            if(!Ice.DomQuery.isXML(root)){
                try {
                    var cs = root.querySelectorAll(path);
                    return Ice.toArray(cs);
                } catch(ex) {
                }
            }
            return Ice.DomQuery.jsSelect.call(this, path, root, type);
        } : function(path, root, type){
            return Ice.DomQuery.jsSelect.call(this, path, root, type);
        },
        selectNode: function(path, root){
            return Ice.DomQuery.select(path, root)[0];
        }
    }
}();
Ice.query = Ice.DomQuery.select;
