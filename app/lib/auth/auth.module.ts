import {NgModule}  from '@angular/core';
import {HttpClientModule} from '../http/http-client.module';
import {SessionModule} from '../session/session.module';

import {AuthService} from './auth.service';

@NgModule({
    imports: [
        HttpClientModule,
        SessionModule
    ],
    providers: [
        AuthService
    ],
    declarations: [
    ],
})
export class AuthModule {
}