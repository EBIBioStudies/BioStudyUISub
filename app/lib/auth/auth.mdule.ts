import {NgModule}  from '@angular/core';
import {HttpClientModule} from '../http/http-client.module';

import {AuthService} from './auth.service';
import {AuthEvents} from './auth-events';
import {UserSession} from './user-session';

@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        AuthService,
        AuthEvents,
        UserSession
    ],
    declarations: [
    ],
})
export class AuthModule {
}