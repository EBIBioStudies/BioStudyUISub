'use strict';
module.exports = ['AccessLevel', function () {
    return {
        require: "ngModel",
        scope: {
            equalsTo: "=equalsTo"
        },
        link: function (scope, element, attrs, ngModel) {
            ngModel.$validators.equalsTo = function (value) {
                return value == scope.$parent.$eval(attrs.equalsTo)
            };

            var unwatch = scope.$parent.$watch(attrs.equalsTo, function () {
                ngModel.$validate();
            });

            scope.$on('destroy', unwatch);
        }
    };
}];