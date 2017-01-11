import {NgModule}  from '@angular/core';
import {HttpClientModule} from '../http/http-client.module';
import {SessionModule} from '../session/session.module';

import {AuthService} from './auth.service';
import {UserSession} from './user-session';
import {UserSessionEvents} from './user-session.events';
import {UserData} from './user-data';

@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        AuthService,
        UserSession,
        UserSessionEvents,
        UserData
    ],
    declarations: [
    ],
})
export class AuthModule {
}