import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth-guard.service';
import { ActivateComponent } from './auth/activate/activate.component';
import { ActivationLinkReqComponent } from './auth/activate/activation-link-req.component';
import { PasswordResetReqComponent } from './auth/password-reset/password-reset-req.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { SignInComponent } from './auth/signin/signin.component';
import { SignUpComponent } from './auth/signup/signup.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'submissions', pathMatch: 'full' },
  { path: '', loadChildren: () => import('app/pages/pages.module').then(m => m.PagesModule) },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'activate/:key', component: ActivateComponent },
  { path: 'password_reset_request', component: PasswordResetReqComponent },
  { path: 'password_reset/:key', component: PasswordResetComponent },
  { path: 'resend_activation_link', component: ActivationLinkReqComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { onSameUrlNavigation: 'reload' })
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard
  ]
})
export class AppRoutingModule {
}
