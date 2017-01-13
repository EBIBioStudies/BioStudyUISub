import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppConfig } from './config/index';

import { AppModule } from './app.module';

if (AppConfig.PROD) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);