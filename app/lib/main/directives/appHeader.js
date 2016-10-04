import headerTmpl from './tmpl/header.html!ng-template'

export default function appHeaderDirective() {
    return {
        restrict: 'E',
        scope: {},
        bindToController: {
            currentUser: '='
        },
        templateUrl: headerTmpl.templateUrl,
        controller: function(APP_VERSION) {
            this.isNavCollapsed = true;
            this.toggleCollapsed = () => {
                this.isNavCollapsed = !this.isNavCollapsed;
            };

            this.appVersion = APP_VERSION;

            this.signOut = function () {
                AuthService.signOut().then(function () {
                    $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                });
            };
        },
        controllerAs: 'ctrl'
    };
}