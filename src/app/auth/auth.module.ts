import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { SharedModule } from 'app/shared/shared.module';
import { AuthService, UserSession, UserData } from 'app/auth/shared';
import { SignInComponent } from './signin/signin.component';
import { ActivateComponent } from './activate/activate.component';
import { ActivationLinkReqComponent } from './activate/activation-link-req.component';
import { PasswordResetReqComponent } from './password-reset/password-reset-req.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { SignUpComponent } from './signup/signup.component';
import { Equals2Directive } from './password-reset/equals2.directive';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  imports: [RouterModule, RecaptchaModule, RecaptchaFormsModule, SharedModule],
  providers: [AuthService, UserSession, UserData, CookieService],
  declarations: [
    SignInComponent,
    SignUpComponent,
    ActivateComponent,
    ActivationLinkReqComponent,
    PasswordResetReqComponent,
    PasswordResetComponent,
    Equals2Directive
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
export class AuthModule {}
