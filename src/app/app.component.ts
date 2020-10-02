import {
  Component,
  OnInit
} from '@angular/core';
import { UserSession } from 'app/auth/shared';
import { AppConfig } from 'app/app.config';
import { setTheme } from 'ngx-bootstrap/utils';

@Component({
  selector: 'st-root',
  template: `
    <st-header></st-header>
    <router-outlet></router-outlet>
  `
})

export class AppComponent implements OnInit {
  constructor(private userSession: UserSession, private appConfig: AppConfig) {
    setTheme('bs4');
  }

  ngOnInit(): void {
    const bannerEl = document.createElement('script');

    // Loads the GDPR bottom panel logic.
    // NOTE: The banner should be called with 'other' to indicate a framework different from EBI's is in use.
    // NOTE: ebiFrameworkRunDataProtectionBanner is defined after the script loads.
    bannerEl.src = this.appConfig.bannerUrl;
    bannerEl.onload = () => {
      if (window.ebiFrameworkRunDataProtectionBanner !== undefined) {
        window.ebiFrameworkRunDataProtectionBanner('other');
      }
    };

    if (document.head !== undefined) {
      document.head.appendChild(bannerEl);
    }

    this.userSession.init();
  }
}
