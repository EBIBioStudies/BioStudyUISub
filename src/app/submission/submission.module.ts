import {NgModule}  from '@angular/core';
import {RouterModule} from '@angular/router';

import {AgGridModule} from 'ag-grid-angular/main';

import {HttpClientModule} from 'app/http/http-client.module';
import {SharedModule} from 'app/shared/shared.module';
import {SubmissionModelModule} from 'app/submission-model/submission-model.module';
import {SubmissionSharedModule} from 'app/submission-shared/submission-shared.module';

import {SubmissionService} from './shared/submission.service';

import {
    SubmissionListComponent,
    ActionButtonsCellComponent,
    DateCellComponent
} from './list/subm-list.component';
import {TextFilterComponent} from './list/ag-grid/text-filter.component';
import {DateFilterComponent} from './list/ag-grid/date-filter.component';

import {SubmissionEditComponent} from './edit/subm-edit.component';
import {SubmissionViewComponent} from './edit/subm-view.component';

import {DirectSubmitSideBarComponent} from './direct-submit/direct-submit-sidebar.component';
import {DirectSubmitComponent, ResultLogNodeComponent} from './direct-submit/direct-submit.component';
import {DirectSubmitService} from './direct-submit/direct-submit.service';

import {SubmissionSideBarComponent} from './edit/subm-sidebar/subm-sidebar.component';
import {SubmissionFormComponent} from './edit/subm-form/subm-form.component';
import {SubmissionFieldComponent} from './edit/subm-form/subm-field.component';
import {SubmissionFeatureComponent} from './edit/subm-form/subm-feature.component';
import {FeatureColumnComponent} from './edit/subm-form/feature-column.component';
import {FeatureGridComponent} from './edit/subm-form/feature-grid.component';
import {FeatureListComponent} from './edit/subm-form/feature-list.component';


@NgModule({
    imports: [
        HttpClientModule,
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
        SubmissionService,
        DirectSubmitService
    ],
    declarations: [
        SubmissionListComponent,
        SubmissionEditComponent,
        SubmissionViewComponent,
        DirectSubmitComponent,
        ResultLogNodeComponent,
        DirectSubmitSideBarComponent,
        SubmissionFormComponent,
        SubmissionFieldComponent,
        SubmissionFeatureComponent,
        SubmissionSideBarComponent,
        FeatureColumnComponent,
        FeatureGridComponent,
        FeatureListComponent,
        ActionButtonsCellComponent,
        DateCellComponent,
        TextFilterComponent,
        DateFilterComponent
    ],
    exports: [
        SubmissionListComponent,
        SubmissionEditComponent,
        SubmissionViewComponent,
        DirectSubmitComponent
    ],
    entryComponents: [ResultLogNodeComponent]
})
export class SubmissionModule {
}