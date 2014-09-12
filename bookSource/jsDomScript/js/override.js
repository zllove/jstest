/**
 * Created by JetBrains PhpStorm.
 * User: jikey
 * Date: 12-2-7
 * Time: 上午11:44
 * To change this template use File | Settings | File Templates.
 */
function override(){
    var alert = function(message){
        window.alert('overrider: ' + message);
    };
    alert('alert');
    window.alert('window.alert');
}
override();
alert('alert from outside.');
