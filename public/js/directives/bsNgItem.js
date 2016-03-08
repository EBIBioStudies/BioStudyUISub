'use strict';

module.exports = function ($compile, $templateCache) {
    return {
        restrict: 'EA',
        //transclude: true,
        templateUrl: 'templates/bsng/bsNgItem.html',
        scope: {
            bsClick : '&',
            toggle : '=',
            itemText: '@',
            itemClass: '@',
            itemHref: '@'
        },
        link: function(scope, iElement, iAttrs) {
            //console.log(scope, iAttrs);
        }
    };
};
