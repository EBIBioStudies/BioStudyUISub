class CompileDirective {
    constructor($compile) {
        Object.assign(this, {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.cellTemplateScope = scope.$eval(attrs.cellTemplateScope);

                // Watch for changes to expression.
                scope.$watch(attrs.compile, function (new_val) {
                    /*
                     * Compile creates a linking function
                     * that can be used with any scope.
                     */
                    var link = $compile(new_val);

                    /*
                     * Executing the linking function
                     * creates a new element.
                     */
                    var new_elem = link(scope);

                    // Which we can then append to our DOM element.
                    element.append(new_elem);
                });
            }
        });
    }

    static create($compile) {
        "ngInject";

        return new CompileDirective($compile);
    }
}

export default CompileDirective.create;
