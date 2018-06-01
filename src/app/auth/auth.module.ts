import {NgModule}  from '@angular/core';
import {RouterModule} from '@angular/router';

import {RecaptchaModule} from 'ng-recaptcha';
import {RecaptchaFormsModule} from 'ng-recaptcha/forms';
import {HttpCustomClientModule} from 'app/http/http-custom-client.module';
import {SharedModule} from 'app/shared/shared.module';

import {AuthService} from './auth.service';
import {UserSession} from './user-session';
import {UserData} from './user-data';

import {SignInComponent} from './signin/signin.component';
import {ActivateComponent} from './activate/activate.component';
import {ActivationLinkReqComponent} from './activate/activation-link-req.component';
import {PasswordResetReqComponent} from './password-reset/password-reset-req.component';
import {PasswordResetComponent} from './password-reset/password-reset.component';
import {SignUpComponent} from './signup/signup.component';
import {Equals2} from './password-reset/equals2.directive';

@NgModule({
    imports: [
        RouterModule,
        RecaptchaModule,
        RecaptchaFormsModule,
        HttpCustomClientModule,
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
        ActivationLinkReqComponent,
        PasswordResetReqComponent,
        PasswordResetComponent,
        Equals2
    ],
    exports: [
        SignInComponent,
        SignUpComponent,
        ActivateComponent,
        ActivationLinkReqComponent,
        PasswordResetReqComponent,
        PasswordResetComponent
    ]
})
export class AuthModule {
}