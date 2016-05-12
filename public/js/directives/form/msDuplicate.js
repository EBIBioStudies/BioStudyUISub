'use strict';

module.exports = function (moduleDirective) {

    moduleDirective.directive('msDuplicate', function (_) {
        return {
            restrict: 'A',
            require: '^ngModel',
            scope: {
                msDuplicate: '=',
                msAttr: '=',
                msViewModel: '='
            },
            link: function (scope, element, attrs, ctrl) {
/*
                scope.$watch('msAttr.name', function (newVal, oldVal) {
                    if (oldVal !== newVal) {
                        scope.msViewModel.changeAttr(newVal, oldVal);
                    }
                });
*/
                ctrl.$validators.msDuplicate = function (modelValue, viewValue) {
                    if (ctrl.$isEmpty(modelValue)) {
                        // consider empty models to be valid
                        return true;
                    }

                    var index = _.findIndex(scope.msDuplicate, {name: viewValue});

                    if (index >= 0 && scope.msAttr !== scope.msDuplicate[index]) {
                        return false;
                    }
                    return true;
                }

            }
        };
    });
};