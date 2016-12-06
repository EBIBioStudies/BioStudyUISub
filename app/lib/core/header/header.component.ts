import {Inject, Component} from '@angular/core';
import {Router} from '@angular/router';

import {AuthEvents} from '../../auth/auth-events';
import {AuthService} from "../../auth/auth.service";

import tmpl from './header.component.html';

@Component({
    selector: 'app-header',
    template: tmpl
})

export class HeaderComponent {
    isNavCollapsed: boolean = true;
    appVersion: string = "2.0.0";//TODO: get it from config
    currentUser: boolean = false;
    userName: string = "";

    constructor(@Inject(AuthEvents) private authEvents: AuthEvents,
                @Inject(AuthService) private authService: AuthService,
                @Inject(Router) private router: Router) {
        this.currentUser = !authService.currentUser().isAnonymous();
        this.userName = authService.currentUser().name;

        authEvents.userSignedIn$.subscribe(name => {
            this.currentUser = true;
            this.userName = name; // can be empty
        });

        authEvents.userSignedOut$.subscribe(name => {
            this.currentUser = false;
            this.userName = "";
        });

        /*this.appVersion = APP_VERSION;*/

    }

    signOut() {
        this.authService.signOut().subscribe(data => {
            this.router.navigate(['/signin']);
        });
    }

    toggleCollapsed() {
        this.isNavCollapsed = !this.isNavCollapsed;
    }
}