class MsDuplicateDirective {
    constructor() {
        Object.assign(this, {
            restrict: 'A',
            require: '^ngModel',
            scope: {
                attributes: '=msDuplicate'
            },
            link (scope, element, attrs, ctrl) {
                ctrl.$validators.msDuplicate = function (val) {
                    if (ctrl.$isEmpty(val)) {
                        // consider empty models to be valid
                        return true;
                    }
                    var len = _.filter(scope.attributes, {name: val}).length;
                    ctrl.$setValidity('duplicate', (len === 1));
                    return val;
                };
            }
        });
    }

    static create(_) {
        "ngInject";
        return new MsDuplicateDirective(_);
    }
}

export default MsDuplicateDirective.create;
