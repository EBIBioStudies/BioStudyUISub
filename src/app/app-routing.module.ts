import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from './auth-guard.service';

import {
    ActivateComponent,
    ActivationLinkReqComponent,
    PasswordResetComponent,
    PasswordResetReqComponent,
    SignInComponent,
    SignUpComponent
} from './auth/index';

import {DirectSubmitComponent, SubmEditComponent, SubmListComponent, SubmViewComponent} from './submission/index';

import {FileListComponent} from './file/file-list/file-list.component';

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
        data: {reuse: true},
        canActivate: [AuthGuard]
    },
    {
        path: 'files',
        component: FileListComponent,
        canActivate: [AuthGuard]
    }

    //NOTE: some components should be reused instead of re-instantiated when navigating to certain routes (the ones with a "reuse" data property).
    //TODO: As of now, angular does not support this feature but is soon to be added (https://github.com/angular/angular/issues/12446). We should take advantage of this to save requests.
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
