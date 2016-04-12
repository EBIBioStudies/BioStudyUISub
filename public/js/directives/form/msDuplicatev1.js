'use strict';


module.exports = function(moduleDirective) {

    moduleDirective.directive('msDuplicate', function () {
        return {
            restrict: 'A',
            require: '^ngModel',
            scope: {
                msDuplicate: '='
            },
            link: function (scope, tElement, tAttrs, ctrl) {
                console.log('Directives', ctrl);

                ctrl.$validators.msDuplicate = function(modelValue, viewValue) {
                    console.log("Validate x",viewValue, modelValue);
                    if (ctrl.$isEmpty(modelValue)) {
                        // consider empty models to be valid
                        return true;
                    }
                    if (scope.msDuplicate[viewValue]) {
                        return false;
                    }

                    // it is valid
                    return true;
                }

            }
        };
    });
}