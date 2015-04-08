/**
 * @author: 豪情
 * @see: <a href="mailto:jikeytang@gmail.com">豪情</a>
 * @time: 15/3/28
 * @info:
 */
var myModule = angular.module('HelloAngular', []);
myModule.controller('helloAngular', ['$scope',
    function HelloAngular($scope){
        $scope.greeting = {
            text : 'hello'
        };
    }
]);
