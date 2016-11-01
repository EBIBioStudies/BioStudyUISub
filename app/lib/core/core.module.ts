import {NgModule}     from '@angular/core';

import {Ng2BootstrapModule} from 'ng2-bootstrap/ng2-bootstrap';
import {RouterModule} from '@angular/router';

import {RecaptchaModule} from 'ng2-recaptcha';

import {AgGridModule} from 'ag-grid-ng2/main';

import {SharedModule} from '../shared/shared.module.ts';

import {AuthModule} from '../auth/auth.module';
import {SubmissionModule} from '../submission/submission.module';

import {AuthGuard} from './auth.guard';

import {AppComponent}     from './app.component';
import {HelpComponent} from './help/help.component';
import {HeaderComponent} from './header/header.component';
import {SignInComponent} from './signin/signin.component';
import {SubmissionListComponent} from './submission/submissionList.component';
import {DummyComponent} from './dummy.component';
import {ContainerRootComponent} from './container-root.component';
import {ContainerMdComponent} from './container-md.component';
import {ORCIDInputBoxComponent} from './orcid-input-box.component';

import {APP_ROUTES} from './app-routes';
import {SignUpComponent} from './signup/signup.component';
import {ActionButtonsComponent} from './submission/actionButtons.component';

@NgModule({
    imports: [
        Ng2BootstrapModule,
        RouterModule.forRoot(APP_ROUTES),
        RecaptchaModule.forRoot(),
        AgGridModule.withNg2ComponentSupport(),
        SharedModule,
        AuthModule,
        SubmissionModule
    ],
    exports: [
        AppComponent
    ],
    declarations: [
        HelpComponent,
        AppComponent,
        HeaderComponent,
        SignInComponent,
        SignUpComponent,
        SubmissionListComponent,
        DummyComponent,
        ContainerRootComponent,
        ContainerMdComponent,
        ORCIDInputBoxComponent,
        ActionButtonsComponent
    ],
    providers: [
        AuthGuard
    ]
})
export class CoreModule {
}