import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth-guard.service';
import { ActivateComponent } from './auth/activate/activate.component';
import { ActivationLinkReqComponent } from './auth/activate/activation-link-req.component';
import { PasswordResetReqComponent } from './auth/password-reset/password-reset-req.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { SignInComponent } from './auth/signin/signin.component';
import { SignUpComponent } from './auth/signup/signup.component';
import { FileListComponent } from './file/file-list/file-list.component';
import { DirectSubmitComponent } from './submission/submission-direct/direct-submit.component';
import { SubmissionEditComponent } from './submission/submission-edit/submission-edit.component';
import { SubmListComponent } from './submission/submission-list/subm-list.component';

const appRoutes: Routes = [
    {path: '', redirectTo: 'submissions', pathMatch: 'full'},
    {path: 'signin', component: SignInComponent},
    {path: 'signup', component: SignUpComponent},
    {path: 'activate/:key', component: ActivateComponent},
    {path: 'password_reset_request', component: PasswordResetReqComponent},
    {path: 'password_reset/:key', component: PasswordResetComponent},
    {path: 'resend_activation_link', component: ActivationLinkReqComponent},
    {
        path: 'submissions',
        component: SubmListComponent,
        data: {isSent: true, reuse: true},
        canActivate: [AuthGuard]
    },
    {
        path: 'submissions/pending',
        component: SubmListComponent,
        data: {isSent: false, reuse: true},
        canActivate: [AuthGuard]
    },
    {
        path: 'submissions/direct_upload',
        component: DirectSubmitComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'submissions/edit/:accno',
        component: SubmissionEditComponent,
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always'
    },
    {
        path: 'submissions/new/:accno',
        component: SubmissionEditComponent,
        data: {isNew: true},
        canActivate: [AuthGuard]
    },
    {
        path: 'submissions/:accno',
        component: SubmissionEditComponent,
        data: {readonly: true},
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always'
    },
    {
        path: 'files',
        component: FileListComponent,
        canActivate: [AuthGuard]
    }
    // NOTE: some components should be reused instead of re-instantiated
    // when navigating to certain routes (the ones with a "reuse" data property).

    // TODO: As of now, angular does not support this feature but is soon to be
    // added (https://github.com/angular/angular/issues/12446). We should take advantage of this to save requests.
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
