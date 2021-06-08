import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth-guard.service';
import { ActivateComponent } from './auth/activate/activate.component';
import { ActivationLinkReqComponent } from './auth/activate/activation-link-req.component';
import { PasswordResetReqComponent } from './auth/password-reset/password-reset-req.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { SignInComponent } from './auth/signin/signin.component';
import { SignUpComponent } from './auth/signup/signup.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const appRoutes: Routes = [
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'activate/:key', component: ActivateComponent },
  { path: 'password_reset_request', component: PasswordResetReqComponent },
  { path: 'password_reset/:key', component: PasswordResetComponent },
  { path: 'password_setup/:key', component: PasswordResetComponent, data: { isPassSetup: true } },
  { path: 'resend_activation_link', component: ActivationLinkReqComponent },
  { path: '', component: SignInComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { onSameUrlNavigation: 'reload', scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
