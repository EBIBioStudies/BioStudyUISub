import {Component} from '@angular/core';

import tmpl from './header.component.html'

@Component({
    selector: 'app-header',
    template: tmpl
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