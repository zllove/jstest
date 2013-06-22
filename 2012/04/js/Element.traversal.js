/**
 * Created by jikey.
 * Link: jikeytang@gmail.com
 * Date: 12-4-23
 * Time: 下午3:39
 * Info:
 */
Ice.Element.addMethods(function(){
    var PARENTNODE = 'parentNode',
        NEXTSIBLING = 'nextSibling',
        PREVIOUSIBLING = 'previouSibling',
        DQ = Ice.DomQuery,
        GET = Ice.get;
    return {
        child: function(selector, returnDom){
            var n = DQ.selectNode(selector, this.dom);
            return returnDom ? n : GET(n);
        }
    }
    
});
