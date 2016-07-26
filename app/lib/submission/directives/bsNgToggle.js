import tmpl from './tmpl/bsNgToggle.html!ng-template'

export default class BsNgToggleDirective {
    constructor() {
        Object.assign(this, {
            restrict: 'E',
            replace: true,
            templateUrl: tmpl.templateUrl
        });
    }
}