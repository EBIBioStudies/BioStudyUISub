import {Component, Inject} from '@angular/core';

import {UserSession} from './auth/index';

@Component({
    selector: 'bsst-app',
    template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    `
})

export class AppComponent {

    constructor(@Inject(UserSession) private userSession: UserSession) {
    }

    ngOnInit() {
        this.userSession.init();
    }
}