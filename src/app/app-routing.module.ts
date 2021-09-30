import { RouterModule, Routes } from '@angular/router';

import { ActivateComponent } from './auth/activate/activate.component';
import { ActivationLinkReqComponent } from './auth/activate/activation-link-req.component';
import { AuthGuard } from './auth-guard.service';
import { DirectSubmitComponent } from './submission/submission-direct/direct-submit.component';
import { FileListComponent } from './file/file-list/file-list.component';
import { HelpComponent } from './help/help.component';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from 'app/not-found/not-found.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { PasswordResetReqComponent } from './auth/password-reset/password-reset-req.component';
import { SignInComponent } from './auth/signin/signin.component';
import { SignUpComponent } from './auth/signup/signup.component';
import { SubmListComponent } from './submission/submission-list/subm-list.component';
import { SubmissionEditComponent } from './submission/submission-edit/submission-edit.component';

const appRoutes: Routes = [
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'activate/:key', component: ActivateComponent },
  { path: 'password_reset_request', component: PasswordResetReqComponent },
  { path: 'password_reset/:key', component: PasswordResetComponent },
  { path: 'password_setup/:key', component: PasswordResetComponent, data: { isPassSetup: true } },
  { path: 'activation', component: ActivationLinkReqComponent },
  { path: 'help', component: HelpComponent },
  { path: 'files', component: FileListComponent, canActivate: [AuthGuard] },
  {
    path: 'draft',
    component: SubmListComponent,
    data: { isSent: false, reuse: true },
    canActivate: [AuthGuard]
  },
  { path: 'direct_upload', component: DirectSubmitComponent, canActivate: [AuthGuard] },
  { path: 'submissions', redirectTo: '' },
  {
    path: 'edit/:accno',
    component: SubmissionEditComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard]
  },
  {
    path: 'new/:accno',
    component: SubmissionEditComponent,
    data: { isNew: true },
    canActivate: [AuthGuard]
  },
  {
    path: ':accno',
    component: SubmissionEditComponent,
    data: { readonly: true },
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: SubmListComponent,
    data: { isSent: true, reuse: true },
    canActivate: [AuthGuard]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 70]
    })
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
