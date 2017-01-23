import {NgModule}             from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from './auth.guard';

import {
    SignInComponent,
    SignUpComponent,
    ActivateComponent,
    ResendActivationLinkComponent,
    PasswordResetReqComponent, PasswordResetComponent
} from './auth/index';

import {
    SubmissionListComponent,
    SubmissionEditComponent,
    SubmissionViewComponent
} from './submission/index';

import {FileListComponent} from './file/index';

const appRoutes: Routes = [
    {path: '', redirectTo: 'submissions', pathMatch: 'full'},
    {path: 'signin', component: SignInComponent},
    {path: 'signup', component: SignUpComponent},
    {path: 'activate/:key', component: ActivateComponent},
    {path: 'password_reset_request', component: PasswordResetReqComponent},
    {path: 'password_reset/:key', component: PasswordResetComponent},
    {path: 'resend_activation_link', component: ResendActivationLinkComponent},
    {path: 'submissions', component: SubmissionListComponent, canActivate: [AuthGuard]},
    {path: 'edit/:accno', component: SubmissionEditComponent, canActivate: [AuthGuard]},
    {path: 'view/:accno', component: SubmissionViewComponent, canActivate: [AuthGuard]},
    {path: 'files', component: FileListComponent, canActivate: [AuthGuard]}
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: []
})
export class AppRoutingModule {
}
