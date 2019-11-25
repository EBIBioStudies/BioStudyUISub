import {
    Component,
    OnInit
} from '@angular/core';
import { UserSession } from 'app/auth/shared';
import { AppConfig } from 'app/app.config';

@Component({
    selector: 'st-root',
    template: `
        <st-app-header></st-app-header>
        <router-outlet></router-outlet>
    `
})

export class AppComponent implements OnInit {
    constructor(private userSession: UserSession, private appConfig: AppConfig) {}

    ngOnInit() {
        const bannerEl = document.createElement('script');

        // Loads the GDPR bottom panel logic.
        // NOTE: The banner should be called with 'other' to indicate a framework different from EBI's is in use.
        // NOTE: ebiFrameworkRunDataProtectionBanner is defined after the script loads.
        bannerEl.src = this.appConfig.bannerUrl;
        bannerEl.onload = function () {
            window['ebiFrameworkRunDataProtectionBanner']('other');
        };
        document.head!.appendChild(bannerEl);

        this.userSession.init();
    }
}
