import {NgModule}  from '@angular/core';
import {SharedModule} from '../shared/shared.module.ts';
import {HttpClientModule} from '../http/http-client.module';

import {SignInFormComponent} from './signin/signinForm.component';
import {AuthService} from './auth.service';
import {AuthEvents} from './auth-events';
import {UserSession} from './user-session';

@NgModule({
    imports: [
        SharedModule,
        HttpClientModule
    ],
    exports: [
        SignInFormComponent
    ],
    providers: [
        AuthService,
        AuthEvents,
        UserSession
    ],
    declarations: [
        SignInFormComponent
    ],
})
export class AuthModule {
}