import {NgModule}     from '@angular/core';

//import {Ng2BootstrapModule} from 'ng2-bootstrap/ng2-bootstrap';
import {TypeaheadModule, TooltipModule, TabsModule, DropdownModule} from 'ng2-bootstrap/ng2-bootstrap';
import {RouterModule} from '@angular/router';
import {RecaptchaModule} from 'ng2-recaptcha';
import {AgGridModule} from 'ag-grid-ng2/main';
import {HttpClientModule} from '../http/http-client.module';

import {SharedModule} from '../shared/shared.module.ts';

import {AuthModule} from '../auth/auth.module';
import {SubmissionModule} from '../submission/submission.module';
import {FileModule} from '../file/file.module';

import {AuthGuard} from './auth.guard';

import {AppComponent}     from './app.component';
import {HelpComponent} from './help/help.component';
import {HeaderComponent} from './header/header.component';
import {SignInComponent} from './signin/signin.component';
import {ActivateComponent} from './activate/activate.component';
import {SubmissionListComponent} from './submission/subm-list.component';
import {SubmissionEditComponent} from './submission/subm-edit.component';
import {SideBarComponent} from './submission/sidebar/subm-sidebar.component';
import {SideBarItemComponent} from './submission/sidebar/subm-sidebar.component';
import {SubmissionPanelComponent} from './submission/panel/subm-panel.component';
import {SubmissionAttributesPanelComponent} from './submission/panel/subm-attributes-panel.component';
import {SubmissionAttributesComponent} from './submission/panel/subm-attributes.component';
import {SubmissionItemsComponent} from "./submission/panel/subm-items.component";
import {SubmissionItemsPanelComponent} from './submission/panel/subm-items-panel.component';
import {FileListComponent} from './file/file-list.component';

import {InputFileComponent} from './submission/panel/input-file.component';
import {PropertyFilterPipe} from './submission/panel/prop-filter.pipe';

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
        TabsModule,
        DropdownModule,
        HttpClientModule,
        AgGridModule.withNg2ComponentSupport(),
        SharedModule,
        AuthModule,
        SubmissionModule,
        FileModule
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
        ActivateComponent,
        SubmissionListComponent,
        SubmissionEditComponent,
        SubmissionPanelComponent,
        SubmissionAttributesPanelComponent,
        SubmissionAttributesComponent,
        SubmissionItemsPanelComponent,
        SubmissionItemsComponent,
        FileListComponent,
        SideBarComponent,
        SideBarItemComponent,
        InputFileComponent,
        DummyComponent,
        ContainerRootComponent,
        ContainerMdComponent,
        ORCIDInputBoxComponent,
        PropertyFilterPipe
    ],
    providers: [
        AuthGuard
    ]
})
export class CoreModule {
}