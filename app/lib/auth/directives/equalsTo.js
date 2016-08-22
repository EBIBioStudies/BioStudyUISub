export default class EqualsToDirective {
    constructor() {
        this.require = "ngModel";
        this.scope = {
            equalsTo: "=equalsTo"
        };
    }

    link(scope, element, attrs, ngModel) {
        ngModel.$validators.equalsTo = function (value) {
            return value == scope.$parent.$eval(attrs.equalsTo)
        };

        var unwatch = scope.$parent.$watch(attrs.equalsTo, function () {
            ngModel.$validate();
        });

        scope.$on('destroy', unwatch);
    }
}