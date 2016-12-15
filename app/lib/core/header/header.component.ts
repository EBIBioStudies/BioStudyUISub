import {Inject, Component} from '@angular/core';
import {Router} from '@angular/router';

import {SessionEvents, UserSessionEvents} from '../../session/session.events';
import {UserSession} from '../../session/user-session';
import {AuthService} from '../../auth/auth.service';
import {AppConfig} from '../../config/app.config';

import tmpl from './header.component.html';

@Component({
    selector: 'app-header',
    template: tmpl
})

export class HeaderComponent {
    isNavCollapsed: boolean = true;
    appVersion: string = '0.0.0';
    currentUser: boolean = false;
    userName: string = "";

    constructor(@Inject(UserSessionEvents) sessionEvents: UserSessionEvents,
                @Inject(UserSession) private session: UserSession,
                @Inject(Router) private router: Router,
                @Inject(AuthService) private authService: AuthService) {
        this.currentUser = !session.isAnonymous();
        this.userName = session.user.name;

        sessionEvents.userSessionCreated$.subscribe(name => {
            this.currentUser = true;
            this.userName = name; // can be empty
        });

        sessionEvents.userSessionDestroyed$.subscribe(name => {
            this.currentUser = false;
            this.userName = "";
            this.router.navigate(['/signin']);
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