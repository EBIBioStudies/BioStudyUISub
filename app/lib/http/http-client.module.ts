import {NgModule}  from '@angular/core';
import {HttpModule} from '@angular/http';

import {HttpClient} from './http-client';

import {SessionModule} from '../session/session.module';

@NgModule({
    imports: [
        HttpModule,
        SessionModule
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