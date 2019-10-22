import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { SharedModule } from 'app/shared/shared.module';
import { AuthService, UserSession, UserData } from 'app/auth/shared';
import { SignInComponent } from './signin/signin.component';
import { ActivateComponent } from './activate/activate.component';
import { ActivationLinkReqComponent } from './activate/activation-link-req.component';
import { PasswordResetReqComponent } from './password-reset/password-reset-req.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { SignUpComponent } from './signup/signup.component';
import { Equals2 } from './password-reset/equals2.directive';

@NgModule({
    imports: [
        RouterModule,
        RecaptchaModule,
        RecaptchaFormsModule,
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
