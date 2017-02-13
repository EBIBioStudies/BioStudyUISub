import {NgModule}  from '@angular/core';
import {HttpModule, BrowserXhr} from '@angular/http';

import {HttpClient} from './http-client';
import {UploadService} from './upload.service';

@NgModule({
    imports: [
        HttpModule
    ],
    exports: [
        HttpModule
    ],
    providers: [
        HttpClient,
        UploadService
    ]
})
export class HttpClientModule {
}