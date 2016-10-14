import {Routes} from '@angular/router';

import {DummyComponent} from './dummy.component';
import {SignInComponent} from './signin/signin.component';
import {HelpComponent} from './help/help.component';

import {AuthGuard} from "./auth.guard";



export const APP_ROUTES: Routes = [
    {path: '', redirectTo: 'submissions', pathMatch: 'full'},
    {path: 'signin', component: SignInComponent},
    {path: 'signup', component: DummyComponent},
    {path: 'key_activation', component: DummyComponent},
    {path: 'password_reset_request', component: DummyComponent},
    {path: 'password_reset', component: DummyComponent},
    {path: 'resend_activation_link', component: DummyComponent},
    {path: 'help', loadChildren: HelpComponent},
    {path: 'submissions', component: DummyComponent, canActivate: [AuthGuard]},
    {path: 'files', component: DummyComponent, canActivate: [AuthGuard]}
];