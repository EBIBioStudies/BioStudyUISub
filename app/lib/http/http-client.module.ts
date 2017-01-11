import {NgModule}  from '@angular/core';
import {HttpModule, BrowserXhr} from '@angular/http';

import {HttpClient} from './http-client';
import {ProgressService} from './progress.service';

import {CustomBrowserXhr} from './custom-browser-xhr';

const progress:ProgressService = new ProgressService();
const browserXhr:BrowserXhr = new CustomBrowserXhr(progress);

@NgModule({
    imports: [
        HttpModule
    ],
    exports: [
        HttpModule
    ],
    providers: [
        HttpClient,
        {provide: ProgressService, useValue: progress},
        {provide: BrowserXhr, useValue: browserXhr}
    ]
})
export class HttpClientModule {
}