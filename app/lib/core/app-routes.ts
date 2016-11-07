import {Routes} from '@angular/router';

import {DummyComponent} from './dummy.component';
import {SignInComponent} from './signin/signin.component';
import {SignUpComponent} from './signup/signup.component';
import {HelpComponent} from './help/help.component';
import {SubmissionListComponent} from './submission/subm-list.component';
import {SubmissionEditComponent} from './submission/subm-edit.component';

import {AuthGuard} from "./auth.guard";


export const APP_ROUTES: Routes = [
    {path: '', redirectTo: 'submissions', pathMatch: 'full'},
    {path: 'signin', component: SignInComponent},
    {path: 'signup', component: SignUpComponent},
    {path: 'key_activation', component: DummyComponent},
    {path: 'password_reset_request', component: DummyComponent},
    {path: 'password_reset', component: DummyComponent},
    {path: 'resend_activation_link', component: DummyComponent},
    {path: 'help', loadChildren: HelpComponent},
    {path: 'submissions', component: SubmissionListComponent, canActivate: [AuthGuard]},
    {path: 'edit/:accno', component: SubmissionEditComponent, canActivate: [AuthGuard]},
    {path: 'view/:accno', component: DummyComponent, canActivate: [AuthGuard]},
    {path: 'files', component: DummyComponent, canActivate: [AuthGuard]}
];