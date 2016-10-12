import {Inject, Component} from '@angular/core';

import {AuthEvents} from '../../auth/auth-events';

import tmpl from './header.component.html';

@Component({
    selector: 'app-header',
    template: tmpl
})

export class AppHeaderComponent {
    isNavCollapsed: boolean = true;
    appVersion: string = "0.0.0";
    currentUser: boolean = false;
    userName: string = "";

    constructor(@Inject(AuthEvents) private authEvents: AuthEvents) {

        authEvents.userSignedIn$.subscribe(name => {
            this.currentUser = true;
            this.userName = name; // can be empty
        });

        authEvents.userSignedOut$.subscribe(name => {
            this.currentUser = false;
            this.userName = "";
        });

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