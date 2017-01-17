import {NgModule, ErrorHandler}     from '@angular/core';

import {
    TypeaheadModule,
    TooltipModule,
    TabsModule,
    DropdownModule,
    ModalModule,
    PaginationModule
} from 'ng2-bootstrap';

import {RouterModule} from '@angular/router';
import {RecaptchaModule} from 'ng2-recaptcha';
import {AgGridModule} from 'ag-grid-ng2/main';
import {HttpClientModule} from '../http/http-client.module';

import {SharedModule} from '../shared/shared.module';

import {AuthModule} from '../auth/auth.module';
import {SubmissionModule} from '../submission/submission.module';
import {FileModule} from '../file/file.module';
import {ConfigModule} from '../config/config.module';

import {AuthGuard} from './auth.guard';
import {GlobalErrorHandler} from './global.error.handler';

import {AppComponent}     from './app.component';
import {HelpComponent} from './help/help.component';
import {HeaderComponent} from './header/header.component';
import {SignInComponent} from './signin/signin.component';
import {ActivateComponent} from './activate/activate.component';
import {ResendActivationLinkComponent} from './activate/resend-activation-link.component';
import {PasswordResetReqComponent} from './password-reset/password-reset-req.component';
import {PasswordResetComponent} from './password-reset/password-reset.component';
import {SubmissionListComponent, ActionButtonsCellComponent, DateCellComponent} from './submission/subm-list.component';
import {SubmissionEditComponent} from './submission/subm-edit.component';
import {SubmissionViewComponent} from './submission/subm-view.component';
import {SideBarComponent} from './submission/sidebar/subm-sidebar.component';
import {SideBarItemComponent} from './submission/sidebar/subm-sidebar.component';
import {SubmissionPanelComponent} from './submission/panel/subm-panel.component';
import {SubmissionAttributesPanelComponent} from './submission/panel/subm-attributes-panel.component';
import {SubmissionAttributesComponent} from './submission/panel/subm-attributes.component';
import {SubmissionItemsComponent} from "./submission/panel/subm-items.component";
import {SubmissionItemsPanelComponent} from './submission/panel/subm-items-panel.component';
import {
    FileListComponent, ProgressCellComponent, FileActionsCellComponent,
    FileTypeCellComponent
} from './file/file-list.component';

import {InputFileComponent} from './submission/panel/input-file.component';
import {PubMedIdSearchComponent} from './submission/panel/pubmedid-search.component';
import {PropertyFilterPipe} from './submission/panel/prop-filter.pipe';

import {DummyComponent} from './dummy.component';
import {ContainerRootComponent} from './container-root.component';
import {ContainerMdComponent} from './container-md.component';
import {ORCIDInputBoxComponent} from './orcid-input-box.component';
import {SlideOutTipComponent} from './submission/panel/slide-out-tip.component';

import {APP_ROUTES} from './app-routes';
import {SignUpComponent} from './signup/signup.component';
import {Equals2} from './password-reset/equals2.directive';
import {TextareaAutosize} from './submission/textarea-autosize.directive';
import {UniqueAttrName} from './submission/panel/unique-attr-name.directive';


@NgModule({
    imports: [
        RouterModule.forRoot(APP_ROUTES),
        RecaptchaModule.forRoot(),
        TypeaheadModule.forRoot(),
        TooltipModule.forRoot(),
        TabsModule.forRoot(),
        DropdownModule.forRoot(),
        ModalModule.forRoot(),
        PaginationModule.forRoot(),
        HttpClientModule,
        AgGridModule.withComponents([
            ActionButtonsCellComponent,
            DateCellComponent,
            FileActionsCellComponent,
            FileTypeCellComponent,
            ProgressCellComponent
        ]),
        SharedModule,
        AuthModule,
        SubmissionModule,
        FileModule,
        ConfigModule
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
        ResendActivationLinkComponent,
        PasswordResetReqComponent,
        PasswordResetComponent,
        SubmissionListComponent,
        SubmissionEditComponent,
        SubmissionViewComponent,
        SubmissionPanelComponent,
        SubmissionAttributesPanelComponent,
        SubmissionAttributesComponent,
        SubmissionItemsPanelComponent,
        SubmissionItemsComponent,
        FileListComponent,
        SideBarComponent,
        SideBarItemComponent,
        InputFileComponent,
        PubMedIdSearchComponent,
        DummyComponent,
        ContainerRootComponent,
        ContainerMdComponent,
        ORCIDInputBoxComponent,
        SlideOutTipComponent,
        PropertyFilterPipe,
        Equals2,
        TextareaAutosize,
        UniqueAttrName,
        ActionButtonsCellComponent,
        DateCellComponent,
        FileActionsCellComponent,
        FileTypeCellComponent,
        ProgressCellComponent
    ],
    providers: [
        AuthGuard,
        {provide: ErrorHandler, useClass: GlobalErrorHandler}
    ]
})
export class CoreModule {
}