import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AgGridModule} from 'ag-grid-angular/main';

import {HttpCustomClientModule} from 'app/http/http-custom-client.module';
import {SharedModule} from 'app/shared/shared.module';
import {SubmissionModelModule} from 'app/submission-model/submission-model.module';
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
import {SubmValidationErrorsModalComponent} from './edit/subm-navbar/subm-validation-errors.component';
import {SubmAddDialogComponent} from './edit/subm-add/subm-add.component';
import {SubmFormService} from './edit/subm-form/subm-form.service';
import {SubmResultsModalComponent} from './results/subm-results-modal.component';
import {ResultsLogNodeComponent} from './results/results-log-node.component';
import {SubmResultsTreeComponent} from './results/subm-results-tree.component';

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
        SubmissionModelModule,
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
        SubmFormComponent,
        SubmFieldComponent,
        SubmFeatureComponent,
        SubmSideBarComponent,
        SubmNavBarComponent,
        SubmValidationErrorsModalComponent,
        SubmResultsModalComponent,
        SubmResultsTreeComponent,
        SubmAddDialogComponent,
        FeatureGridComponent,
        FeatureListComponent,
        ActionButtonsCellComponent,
        DateCellComponent,
        TextFilterComponent,
        DateFilterComponent,
        UniqueValidator
    ],
    exports: [
        SubmListComponent,
        SubmEditComponent,
        SubmViewComponent,
        DirectSubmitComponent
    ],
    entryComponents: [
        ResultsLogNodeComponent,
        SubmValidationErrorsModalComponent,
        SubmResultsModalComponent
    ]
})
export class SubmissionModule {
}
