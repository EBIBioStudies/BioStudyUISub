import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { ThemeModule } from 'app/theme/theme.module';
import { AuthService, UserSession, UserData } from 'app/auth/shared';
import { CollectionsModule } from 'app/collections/collections.module';
import { SignInComponent } from './signin/signin.component';
import { ActivateComponent } from './activate/activate.component';
import { ActivationLinkReqComponent } from './activate/activation-link-req.component';
import { ActivationLinkSuccessComponent } from './activate/activation-link-success.component';
import { PasswordResetReqComponent } from './password-reset/password-reset-req.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { SignUpComponent } from './signup/signup.component';
import { Equals2Directive } from './password-reset/equals2.directive';
import { ImpersonateModalComponent } from './impersonate/impersonate-modal.component';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    SharedModule,
    ThemeModule,
    FormsModule,
    ModalModule,
    CollectionsModule
  ],
  providers: [AuthService, UserSession, UserData, CookieService],
  declarations: [
    SignInComponent,
    SignUpComponent,
    ActivateComponent,
    ActivationLinkReqComponent,
    ActivationLinkSuccessComponent,
    PasswordResetReqComponent,
    PasswordResetComponent,
    Equals2Directive,
    ImpersonateModalComponent
  ],
  exports: [
    SignInComponent,
    SignUpComponent,
    ActivateComponent,
    ActivationLinkReqComponent,
    ActivationLinkSuccessComponent,
    PasswordResetReqComponent,
    PasswordResetComponent
  ]
})
export class AuthModule {}
