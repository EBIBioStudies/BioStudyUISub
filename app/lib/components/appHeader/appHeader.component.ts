import {Component} from 'angular2/core';

@Component({
    selector: 'app-header',
    templateUrl: 'appHeader.component.html'
})

export class AppHeaderComponent {
    isNavCollapsed: boolean;

    constructor() {
        this.isNavCollapsed = true;

        /*this.appVersion = APP_VERSION;

        this.signOut = function () {
            AuthService.signOut().then(function () {
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            });
        };*/
    }

    toggleCollapsed() {
        this.isNavCollapsed = !this.isNavCollapsed;
    }
}