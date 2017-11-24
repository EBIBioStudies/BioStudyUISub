import {NgModule} from '@angular/core';

import {
    RouterModule,
    Routes
} from '@angular/router';

import {AuthGuard} from './auth-guard.service';

import {
    SignInComponent,
    SignUpComponent,
    ActivateComponent,
    ActivationLinkReqComponent,
    PasswordResetReqComponent,
    PasswordResetComponent
} from './auth/index';

import {
    SubmListComponent,
    SubmEditComponent,
    SubmViewComponent,
    DirectSubmitComponent
} from './submission/index';

import {FileListComponent} from './file/index';

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
        data: {reuse: true},
        canActivate: [AuthGuard]
    },
    {
        path: 'submissions/sent',
        component: SubmListComponent,
        data: {isSent: true, reuse: true},
        canActivate: [AuthGuard]},
    {
        path: 'submissions/direct_upload',
        component: DirectSubmitComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'submissions/edit/:accno',
        component: SubmEditComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'submissions/new/:accno',
        component: SubmEditComponent,
        data: {isNew: true},
        canActivate: [AuthGuard]
    },
    {
        path: 'submissions/:accno',
        component: SubmViewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'files',
        component: FileListComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
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
