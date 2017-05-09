import {NgModule, ModuleWithProviders}  from '@angular/core';
import {RouterModule} from '@angular/router';

import {RecaptchaModule} from 'ng2-recaptcha';
import {HttpClientModule} from '../http/http-client.module';
import {SharedModule} from '../shared/shared.module';

import {AuthService} from './auth.service';
import {UserSession} from './user-session';
import {UserData} from './user-data';

import {SignInComponent} from './signin/signin.component';
import {ActivateComponent} from './activate/activate.component';
import {ResendActivationLinkComponent} from './activate/resend-activation-link.component';
import {PasswordResetReqComponent} from './password-reset/password-reset-req.component';
import {PasswordResetComponent} from './password-reset/password-reset.component';
import {SignUpComponent} from './signup/signup.component';
import {Equals2} from './password-reset/equals2.directive';

@NgModule({
    imports: [
        RouterModule,
        RecaptchaModule,
        HttpClientModule,
        SharedModule
    ],
    providers: [
        AuthService,
        UserSession,
        UserData
    ],
    declarations: [
        SignInComponent,
        SignUpComponent,
        ActivateComponent,
        ResendActivationLinkComponent,
        PasswordResetReqComponent,
        PasswordResetComponent,
        Equals2
    ],
    exports: [
        SignInComponent,
        SignUpComponent,
        ActivateComponent,
        ResendActivationLinkComponent,
        PasswordResetReqComponent,
        PasswordResetComponent
    ]
})
export class AuthModule {
}