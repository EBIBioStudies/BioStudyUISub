import {Routes} from '@angular/router';

import {SignInComponent} from './signin/signin.component';
import {SignUpComponent} from './signup/signup.component';
import {ActivateComponent} from './activate/activate.component';
import {ResendActivationLinkComponent} from './activate/resend-activation-link.component';
import {PasswordResetReqComponent} from './password-reset/password-reset-req.component';
import {PasswordResetComponent} from './password-reset/password-reset.component';

import {AuthGuard} from "./auth.guard";

export const APP_ROUTES: Routes = [
    {path: '', redirectTo: 'submissions', pathMatch: 'full'},
    {path: 'signin', component: SignInComponent},
    {path: 'signup', component: SignUpComponent},
    {path: 'activate/:key', component: ActivateComponent},
    {path: 'password_reset_request', component: PasswordResetReqComponent},
    {path: 'password_reset/:key', component: PasswordResetComponent},
    {path: 'resend_activation_link', component: ResendActivationLinkComponent},
    {path: 'help',  loadChildren: '../help/help.module#HelpModule'},
    {path: 'submissions', loadChildren: '../submission/submission.module#SubmissionModule', canActivate: [AuthGuard]},
    {path: 'files', loadChildren: '../file/file.module#FileModule', canActivate: [AuthGuard]}
];