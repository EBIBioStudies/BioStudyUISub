import {Routes} from '@angular/router';

import {SignInComponent} from './signin/signin.component';
import {SignUpComponent} from './signup/signup.component';
import {ActivateComponent} from './activate/activate.component';
import {ResendActivationLinkComponent} from './activate/resend-activation-link.component';
import {PasswordResetReqComponent} from './password-reset/password-reset-req.component';
import {PasswordResetComponent} from './password-reset/password-reset.component';
import {HelpComponent} from './help/help.component';
import {SubmissionListComponent} from './submission/subm-list.component';
import {SubmissionEditComponent} from './submission/subm-edit.component';
import {SubmissionViewComponent} from './submission/subm-view.component';
import {FileListComponent} from './file/file-list.component';

import {AuthGuard} from "./auth.guard";

export const APP_ROUTES: Routes = [
    {path: '', redirectTo: 'submissions', pathMatch: 'full'},
    {path: 'signin', component: SignInComponent},
    {path: 'signup', component: SignUpComponent},
    {path: 'key_activation', component: ActivateComponent},
    {path: 'password_reset_request', component: PasswordResetReqComponent},
    {path: 'password_reset', component: PasswordResetComponent},
    {path: 'resend_activation_link', component: ResendActivationLinkComponent},
    {path: 'help', component: HelpComponent},
    {path: 'submissions', component: SubmissionListComponent, canActivate: [AuthGuard]},
    {path: 'edit/:accno', component: SubmissionEditComponent, canActivate: [AuthGuard]},
    {path: 'view/:accno', component: SubmissionViewComponent, canActivate: [AuthGuard]},
    {path: 'files', component: FileListComponent, canActivate: [AuthGuard]}
];