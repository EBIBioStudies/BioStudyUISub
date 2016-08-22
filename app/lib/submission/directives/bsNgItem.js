import tmpl from './tmpl/bsNgItem.html!ng-template'

export default class BsNgItemDirective {
    constructor() {
        Object.assign(this, {
            restrict: 'EA',
            templateUrl: tmpl.templateUrl,
            scope: {
                bsClick : '&',
                toggle : '=',
                itemText: '@',
                itemClass: '@',
                itemHref: '@',
                disabled: '=ngDisabled'
            },
        });
    }
}
