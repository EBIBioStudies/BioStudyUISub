import {NgModule}     from '@angular/core';

//import {Ng2BootstrapModule} from 'ng2-bootstrap/ng2-bootstrap';
import {TypeaheadModule, TooltipModule} from 'ng2-bootstrap/ng2-bootstrap';
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
import {SubmissionListComponent} from './submission/subm-list.component';
import {SubmissionEditComponent} from './submission/subm-edit.component';
import {SideBarComponent} from './submission/sidebar/subm-sidebar.component';
import {SideBarItemComponent} from './submission/sidebar/subm-sidebar.component';
import {SubmissionPanelComponent} from './submission/panel/subm-panel.component';
import {SubmissionAttributesPanelComponent} from './submission/panel/subm-attributes-panel.component';
import {SubmissionAttributesComponent} from './submission/panel/subm-attributes.component';
import {InputFileComponent} from './submission/panel/input-file.component';

import {DummyComponent} from './dummy.component';
import {ContainerRootComponent} from './container-root.component';
import {ContainerMdComponent} from './container-md.component';
import {ORCIDInputBoxComponent} from './orcid-input-box.component';

import {APP_ROUTES} from './app-routes';
import {SignUpComponent} from './signup/signup.component';

@NgModule({
    imports: [
        RouterModule.forRoot(APP_ROUTES),
        RecaptchaModule.forRoot(),
        TypeaheadModule,
        TooltipModule,
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
        SubmissionEditComponent,
        SubmissionPanelComponent,
        SubmissionAttributesPanelComponent,
        SubmissionAttributesComponent,
        SideBarComponent,
        SideBarItemComponent,
        InputFileComponent,
        DummyComponent,
        ContainerRootComponent,
        ContainerMdComponent,
        ORCIDInputBoxComponent
    ],
    providers: [
        AuthGuard
    ]
})
export class CoreModule {
}