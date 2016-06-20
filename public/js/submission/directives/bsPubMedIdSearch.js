'use strict';

module.exports = ['$log', function ($log) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attrs) {
           scope.$watch(attrs.ngModel, function(oldVal, newVal) {
               $log.dubg(newVal);
           });
        }
    };
}];