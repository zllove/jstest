/**
 * @author: 豪情
 * @see: <a href="mailto:jikeytang@gmail.com">豪情</a>
 * @time: 15/3/24
 * @info:
 */
var aMailServices = angular.module('AMail',[]);
function emailRouteConfig($routeProvider){
    $routeProvider.when('/',{
        controller:ListController,
        templateUrl:'list.html'
    }).when('/view/:id', {
        controller:DetailController,
        templateUrl:'detail.html'
    }).otherwise({
        redirectTo: '/'
    })
}
aMailServices.config(emailRouteConfig);
messages = [{
        id:0, sender:'jean@somcompay.com',
        subject:'Hi there,old friend',
        date:'Dec 7,2013',
        recipients:['greg@somcompany.com'],
        message:'Hey, we should get together for lunch'
    },{
        id:1, sender:'jean@somcompay.com',
        subject:'Hi there,old friend',
        date:'Dec 7,2013',
        recipients:['greg@somcompany.com'],
        message:'Hey, we should get together for lunch'
    },
    {
        id:2, sender:'jean@somcompay.com',
        subject:'Hi there,old friend',
        date:'Dec 7,2013',
        recipients:['greg@somcompany.com'],
        message:'Hey, we should get together for lunch'
    }
]
function ListController($scope){
    $scope.messages = messages;
}
function DetailController($scope, $routeParams){
    $scope.message = message[$routeParams.id];
}
