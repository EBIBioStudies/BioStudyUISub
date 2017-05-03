import {Component, Inject} from '@angular/core';

import {UserSession} from './auth/index';

@Component({
    selector: 'app-root',
    template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    
    <!-- THOR INTEGRATION BEGIN -->
    <iframe id="thor" name="thor" src="thor-integration.html" style="display: none;"></iframe>
    <!-- THOR INTEGRATION END -->
    `
})

export class AppComponent {

    constructor(@Inject(UserSession) private userSession: UserSession) {
    }

    ngOnInit() {
        this.userSession.init();
    }
}