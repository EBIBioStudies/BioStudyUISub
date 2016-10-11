import {NgModule}  from '@angular/core';
import {HttpModule} from '@angular/http';

import {HttpClient} from './http-client';


@NgModule({
    imports: [
        HttpModule
    ],
    exports: [
        HttpModule
    ],
    providers: [
        HttpClient
    ]
})
export class HttpClientModule {
}