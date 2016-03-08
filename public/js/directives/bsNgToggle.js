'use strict';

module.exports = function ($compile, $cookieStore) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/bsng/bsNgToggle.html',
        link: function(scope, elem,attr) {
            console.log('bstogglle directive', scope, elem,attr);
        }
    };
};
