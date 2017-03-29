import {Inject, Component} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService, UserSession, UserSessionEvents} from '../../auth/index';
import {AppConfig} from '../../config/index';

import tmpl from './header.component.html';

@Component({
    selector: 'app-header',
    template: tmpl
})

export class HeaderComponent {
    private isNavCollapsed: boolean = true;
    private appVersion: string = '0.0.0';

    private userLoggedIn: boolean = false;

    constructor(@Inject(UserSessionEvents) sessionEvents: UserSessionEvents,
                @Inject(UserSession) private session: UserSession,
                @Inject(Router) private router: Router,
                @Inject(AuthService) private authService: AuthService) {

        this.userLoggedIn = !session.isAnonymous();

        sessionEvents.userSessionCreated$.subscribe(created => {
            this.userLoggedIn = created;
            if (!created) {
                this.router.navigate(['/signin']);
            }
        });

        this.appVersion = AppConfig.VERSION;
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