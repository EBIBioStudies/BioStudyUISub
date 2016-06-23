'use strict';

module.exports = function (moduleDirective) {

    moduleDirective.directive('msDuplicate', function (_) {
        return {
            restrict: 'A',
            require: '^ngModel',
            scope: {
                attributes: '=msDuplicate'
            },
            link: function (scope, element, attrs, ctrl) {
                ctrl.$validators.msDuplicate = function (val) {
                    if (ctrl.$isEmpty(val)) {
                        // consider empty models to be valid
                        return true;
                    }
                    var index = _.findIndex(scope.attributes, {name: val});
                    return index < 0;
                }
            }
        };
    });
};