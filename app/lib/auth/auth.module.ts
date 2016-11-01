import {NgModule}  from '@angular/core';
import {HttpClientModule} from '../http/http-client.module';
import {SessionModule} from '../session/session.module';

import {AuthService} from './auth.service';
import {AuthEvents} from './auth-events';

@NgModule({
    imports: [
        HttpClientModule,
        SessionModule
    ],
    providers: [
        AuthService,
        AuthEvents
    ],
    declarations: [
    ],
})
export class AuthModule {
}