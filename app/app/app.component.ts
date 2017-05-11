import {Component, OnInit} from '@angular/core';

import {UserSession} from './auth/index';

@Component({
    selector: 'app-root',
    template: `
        <app-header></app-header>
        <router-outlet></router-outlet>
    `
})

export class AppComponent implements OnInit {
    constructor(private userSession: UserSession) {
    }

    ngOnInit() {
        this.userSession.init();
    }
}