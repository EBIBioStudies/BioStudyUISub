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
import {SubmViewComponent} from './edit/subm-view.component';

import {DirectSubmitSideBarComponent} from './direct-submit/direct-submit-sidebar.component';
import {DirectSubmitComponent} from './direct-submit/direct-submit.component';
import {DirectSubmitService} from './direct-submit/direct-submit.service';

import {SubmSideBarComponent} from './edit/subm-sidebar/subm-sidebar.component';
import {SubmFormComponent} from './edit/subm-form/subm-form.component';
import {SubmFieldComponent} from './edit/subm-form/field/subm-field.component';
import {SubmFeatureComponent} from './edit/subm-form/feature/subm-feature.component';
import {FeatureGridComponent} from './edit/subm-form/feature/feature-grid.component';
import {FeatureListComponent} from './edit/subm-form/feature/feature-list.component';
import {SubmNavBarComponent} from './edit/subm-navbar/subm-navbar.component';
import {SubmValidationErrorsComponent} from './edit/subm-navbar/subm-validation-errors.component';
import {SubmTypeAddDialogComponent} from './edit/submtype-add/submtype-add.component';
import {SubmFormService} from './edit/subm-form/subm-form.service';
import {SubmResultsModalComponent} from './results/subm-results-modal.component';
import {ResultsLogNodeComponent} from './results/results-log-node.component';
import {SubmResultsTreeComponent} from './results/subm-results-tree.component';

import {UniqueValidator} from './shared/unique.directive';
import {SubmAddDialogComponent} from "./list/subm-add.component";
import {Camelcase2LabelPipe} from './shared/pipes/camelcase-to-label.pipe';
import {FileModule} from '../file/file.module';
import {InputValueComponent} from './edit/subm-form/input-value/input-value.component';

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
        SubmFormService,
        SubmissionService,
        DirectSubmitService
    ],
    declarations: [
        SubmListComponent,
        SubmEditComponent,
        SubmViewComponent,
        DirectSubmitComponent,
        ResultsLogNodeComponent,
        DirectSubmitSideBarComponent,
        InputValueComponent,
        SubmFormComponent,
        SubmFieldComponent,
        SubmFeatureComponent,
        SubmSideBarComponent,
        SubmNavBarComponent,
        SubmValidationErrorsComponent,
        SubmResultsModalComponent,
        SubmResultsTreeComponent,
        SubmTypeAddDialogComponent,
        SubmAddDialogComponent,
        FeatureGridComponent,
        FeatureListComponent,
        ActionButtonsCellComponent,
        DateCellComponent,
        TextFilterComponent,
        DateFilterComponent,
        UniqueValidator,
        Camelcase2LabelPipe
    ],
    exports: [
        SubmListComponent,
        SubmEditComponent,
        SubmViewComponent,
        DirectSubmitComponent,
    ],
    entryComponents: [
        ResultsLogNodeComponent,
        SubmValidationErrorsComponent,
        SubmResultsModalComponent
    ]
})
export class SubmissionModule {
}
