/**
 * Created by jikey.
 * Link: jikeytang@gmail.com
 * Date: 12-4-23
 * Time: 下午1:20
 * Info:
 */
Ice.CompositeElementLite = function(els, root){
    this.el = new Ice.Element.Flyweight();
};
Ice.CompositeElementLite.prototype = {
    isComposite: true,
    clear: function(){
        this.elements = [];
    }
}