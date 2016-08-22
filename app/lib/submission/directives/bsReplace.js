class BsReplaceDirective {
    constructor($compile, $templateRequest) {
        "ngInject";

        Object.assign(this, {
            restrict: 'EA',
            scope: false,
            link: function (scope, elem, attrs) {
                var templateUrl = attrs.src;
                $templateRequest(templateUrl).then(function (data) {
                    elem.html(data);
                    $compile(elem.contents())(scope);
                });
            }
        });
    }
    static create($compile, $templateRequest) {
        "ngInject";
        return new BsReplaceDirective($compile, $templateRequest);
    }
}

export default BsReplaceDirective.create;