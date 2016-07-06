'use strict';

module.exports = function () {
    return {
        restrict: 'EA',
        templateUrl: 'templates/bsng/bsNgItem.html',
        scope: {
            bsClick : '&',
            toggle : '=',
            itemText: '@',
            itemClass: '@',
            itemHref: '@',
            disabled: '=ngDisabled'
        },
        link: function(scope, element, attrs) {
            //console.log(scope, iAttrs);
        }
    };
};
