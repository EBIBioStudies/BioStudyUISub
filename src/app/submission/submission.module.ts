import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AgGridModule} from 'ag-grid-angular/main';

import {HttpCustomClientModule} from 'app/http/http-custom-client.module';
import {SharedModule} from 'app/shared/shared.module';
import {SubmissionSharedModule} from 'app/submission-shared/submission-shared.module';
import {SubmEditService} from 'app/submission/edit/shared/subm-edit.service';
import {AddSubmTypeModalComponent} from 'app/submission/edit/subm-sidebar/add-subm-type-modal/add-subm-type-modal.component';
import {FileModule} from '../file/file.module';

import {DirectSubmitSideBarComponent} from './direct-submit/direct-submit-sidebar.component';
import {DirectSubmitComponent} from './direct-submit/direct-submit.component';
import {DirectSubmitService} from './direct-submit/direct-submit.service';

import {SubmEditComponent} from './edit/subm-edit.component';
import {FeatureGridComponent} from './edit/subm-form/feature/feature-grid.component';
import {FeatureListComponent} from './edit/subm-form/feature/feature-list.component';
import {SubmFeatureComponent} from './edit/subm-form/feature/subm-feature.component';
import {SubmFieldComponent} from './edit/subm-form/field/subm-field.component';
import {InlineEditComponent} from './edit/subm-form/inline-edit/inline-edit.component';
import {InputValueComponent} from './edit/subm-form/input-value/input-value.component';
import {NativeElementAttachDirective} from './edit/subm-form/native-element-attach.directive';
import {SubmFormComponent} from './edit/subm-form/subm-form.component';
import {SubmNavBarComponent} from './edit/subm-navbar/subm-navbar.component';
import {SubmValidationErrorsComponent} from './edit/subm-navbar/subm-validation-errors.component';
import {SubmCheckSidebarComponent} from './edit/subm-sidebar/subm-check-sidebar/subm-check-sidebar.component';
import {SubmEditSidebarComponent} from './edit/subm-sidebar/subm-edit-sidebar/subm-edit-sidebar.component';

import {SubmSidebarComponent} from './edit/subm-sidebar/subm-sidebar.component';
import {DateFilterComponent} from './list/ag-grid/date-filter.component';
import {TextFilterComponent} from './list/ag-grid/text-filter.component';

import {SubmListComponent, ActionButtonsCellComponent, DateCellComponent} from './list/subm-list.component';
import {ResultsLogNodeComponent} from './results/results-log-node.component';
import {SubmResultsModalComponent} from './results/subm-results-modal.component';
import {SubmResultsTreeComponent} from './results/subm-results-tree.component';
import {AddSubmModalComponent} from './shared/modals/add-subm-modal.component';
import {NewSubmissionButtonDirective} from './shared/new-submission-button.directive';
import {Camelcase2LabelPipe} from './shared/pipes/camelcase-to-label.pipe';
import {SubmissionService} from './shared/submission.service';
import {UniqueValidator} from './shared/unique.directive';

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
