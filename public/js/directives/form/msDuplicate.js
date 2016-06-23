'use strict';

module.exports = function (moduleDirective) {

    moduleDirective.directive('msDuplicate', function (_) {
        return {
            restrict: 'A',
            require: '^ngModel',
            scope: {
                attributes: '=msDuplicate',
                savedValue: '=ngModel'
            },
            link: function (scope, element, attrs, ctrl) {
                ctrl.$validators.msDuplicate = function (val) {
                    if (ctrl.$isEmpty(val)) {
                        // consider empty models to be valid
                        return true;
                    }
                    var len = _.filter(scope.attributes, {name: val}).length;
                    var edited = scope.savedValue != val;
                    ctrl.$setValidity('duplicate', (edited ? len === 0 : len === 1));
                    return val;
                };
            }
        };
    });
};