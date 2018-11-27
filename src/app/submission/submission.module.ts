import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AgGridModule} from 'ag-grid-angular/main';

import {HttpCustomClientModule} from 'app/http/http-custom-client.module';
import {SharedModule} from 'app/shared/shared.module';
import {SubmissionSharedModule} from 'app/submission-shared/submission-shared.module';

import {SubmissionService} from './shared/submission.service';

import {
    SubmListComponent,
    ActionButtonsCellComponent,
    DateCellComponent
} from './list/subm-list.component';
import {TextFilterComponent} from './list/ag-grid/text-filter.component';
import {DateFilterComponent} from './list/ag-grid/date-filter.component';

import {SubmEditComponent} from './edit/subm-edit.component';

import {DirectSubmitSideBarComponent} from './direct-submit/direct-submit-sidebar.component';
import {DirectSubmitComponent} from './direct-submit/direct-submit.component';
import {DirectSubmitService} from './direct-submit/direct-submit.service';

import {SubmSidebarComponent} from './edit/subm-sidebar/subm-sidebar.component';
import {SubmFormComponent} from './edit/subm-form/subm-form.component';
import {SubmFieldComponent} from './edit/subm-form/field/subm-field.component';
import {SubmFeatureComponent} from './edit/subm-form/feature/subm-feature.component';
import {FeatureGridComponent} from './edit/subm-form/feature/feature-grid.component';
import {FeatureListComponent} from './edit/subm-form/feature/feature-list.component';
import {SubmNavBarComponent} from './edit/subm-navbar/subm-navbar.component';
import {SubmValidationErrorsComponent} from './edit/subm-navbar/subm-validation-errors.component';
import {SubmResultsModalComponent} from './results/subm-results-modal.component';
import {ResultsLogNodeComponent} from './results/results-log-node.component';
import {SubmResultsTreeComponent} from './results/subm-results-tree.component';

import {UniqueValidator} from './shared/unique.directive';
import {AddSubmModalComponent} from './shared/modals/add-subm-modal.component';
import {Camelcase2LabelPipe} from './shared/pipes/camelcase-to-label.pipe';
import {FileModule} from '../file/file.module';
import {InputValueComponent} from './edit/subm-form/input-value/input-value.component';
import {InlineEditComponent} from './edit/subm-form/inline-edit/inline-edit.component';
import {NativeElementAttachDirective} from './edit/subm-form/native-element-attach.directive';
import {SubmEditSidebarComponent} from './edit/subm-sidebar/subm-edit-sidebar/subm-edit-sidebar.component';
import {AddSubmTypeModalComponent} from './edit/modals/add-subm-type-modal.component';
import {SubmCheckSidebarComponent} from './edit/subm-sidebar/subm-check-sidebar/subm-check-sidebar.component';
import {SubmEditService} from './edit/subm-edit.service';
import {NewSubmissionButtonDirective} from './shared/new-submission-button.directive';


@NgModule({
    imports: [
        HttpCustomClientModule,
        AgGridModule.withComponents([
            ActionButtonsCellComponent,
            DateCellComponent,
            TextFilterComponent,
            DateFilterComponent
        ]),
        SharedModule,
        RouterModule,
        FileModule,
        SubmissionSharedModule
    ],
    providers: [
        SubmissionService,
        SubmEditService,
        DirectSubmitService
    ],
    declarations: [
        SubmListComponent,
        SubmEditComponent,
        DirectSubmitComponent,
        ResultsLogNodeComponent,
        DirectSubmitSideBarComponent,
        InputValueComponent,
        InlineEditComponent,
        SubmFormComponent,
        SubmFieldComponent,
        SubmFeatureComponent,
        SubmSidebarComponent,
        SubmEditSidebarComponent,
        SubmCheckSidebarComponent,
        SubmNavBarComponent,
        SubmValidationErrorsComponent,
        SubmResultsModalComponent,
        SubmResultsTreeComponent,
        AddSubmTypeModalComponent,
        AddSubmModalComponent,
        FeatureGridComponent,
        FeatureListComponent,
        ActionButtonsCellComponent,
        DateCellComponent,
        TextFilterComponent,
        DateFilterComponent,
        Camelcase2LabelPipe,
        UniqueValidator,
        NativeElementAttachDirective,
        NewSubmissionButtonDirective
    ],
    exports: [
        SubmListComponent,
        SubmEditComponent,
        DirectSubmitComponent,
    ],
    entryComponents: [
        ResultsLogNodeComponent,
        SubmValidationErrorsComponent,
        SubmResultsModalComponent,
        AddSubmTypeModalComponent,
        AddSubmModalComponent
    ]
})
export class SubmissionModule {
}
