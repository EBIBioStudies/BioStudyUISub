import {Component, Inject, OnInit} from '@angular/core';

import {UserSession} from './auth/index';

@Component({
    selector: 'app-root',
    template: `
        <app-header></app-header>
        <router-outlet></router-outlet>
    `
})

export class AppComponent implements OnInit {
    constructor(@Inject(UserSession) private userSession: UserSession) {
    }

    ngOnInit() {
        this.userSession.init();
    }
}