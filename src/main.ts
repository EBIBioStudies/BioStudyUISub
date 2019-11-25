import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import './app/extensions/string.extensions';
import './app/extensions/array.extensions';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule, {
    preserveWhitespaces: true
}).catch(err => {
    // tslint:disable-next-line: no-console
    console.log(err);
});
