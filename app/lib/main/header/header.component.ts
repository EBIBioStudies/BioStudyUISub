import {Component} from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: '/lib/main/header/header.component.html'
})

export class AppHeaderComponent {
    isNavCollapsed: boolean;
    appVersion: string;

    constructor() {
        this.isNavCollapsed = true;
        this.appVersion = "0.0.0";

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