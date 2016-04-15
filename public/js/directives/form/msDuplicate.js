'use strict';

var _ = require('../../../../.build/components/lodash');

module.exports = function(moduleDirective) {

    moduleDirective.directive('msDuplicate', function () {
        return {
            restrict: 'A',
            require: '^ngModel',
            scope: {
                msDuplicate: '=',
                msAttr: '=',
                msViewModel: '='
            },
            link: function (scope, tElement, tAttrs, ctrl) {
                scope.$watch('msAttr.name', function(newVal, oldVal) {
                    if (oldVal!==newVal) {
                        scope.msViewModel.changeAttr(newVal, oldVal);
                    }
                });
                ctrl.$validators.msDuplicate = function(modelValue, viewValue) {
                    if (ctrl.$isEmpty(modelValue)) {
                        // consider empty models to be valid
                        return true;
                    }

                    var index=_.findIndex(scope.msDuplicate,{name:viewValue})

                    if (index>-1 && scope.msAttr !==scope.msDuplicate[index] ) {
                        return false;
                    }

                    // it is valid
                    return true;
                }

            }
        };
    });
}