import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { PasswordResetReqComponent } from './password-reset/password-reset-req.component';
import { SignInComponent } from './signin/signin.component';
import { SignUpComponent } from './signup/signup.component';
import { ActivateComponent } from './activate/activate.component';
import { ActivationLinkReqComponent } from './activate/activation-link-req.component';

export const authRoutes: Routes = [
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'activate/:key', component: ActivateComponent },
  { path: 'activate', component: ActivationLinkReqComponent },
  { path: 'password_reset_request', component: PasswordResetReqComponent },
  { path: 'password_reset/:key', component: PasswordResetComponent },
  { path: 'password_setup/:key', component: PasswordResetComponent, data: { isPassSetup: true } },
  { path: 'activation', component: ActivationLinkReqComponent }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
