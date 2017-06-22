import {NgModule}  from '@angular/core';
import {RouterModule} from '@angular/router';

import {AgGridModule} from 'ag-grid-angular/main';

import {HttpClientModule} from 'app/http/http-client.module';
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
import {DirectSubmitComponent, ResultLogNodeComponent} from './direct-submit/direct-submit.component';
import {DirectSubmitService} from './direct-submit/direct-submit.service';

import {SubmSideBarComponent} from './edit/subm-sidebar/subm-sidebar.component';
import {SubmFormComponent} from './edit/subm-form/subm-form.component';
import {SubmFieldComponent} from './edit/subm-form/field/subm-field.component';
import {SubmFeatureComponent} from './edit/subm-form/feature/subm-feature.component';
import {FeatureGridComponent} from './edit/subm-form/feature/feature-grid.component';
import {FeatureListComponent} from './edit/subm-form/feature/feature-list.component';
import {FeatureValueComponent} from './edit/subm-form/feature/feature-value.component';
import {SubmNavBarComponent} from './edit/subm-navbar/subm-navbar.component';
import {SubmAddDialogComponent} from "./edit/subm-add/subm-add.component";


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
        SubmListComponent,
        SubmEditComponent,
        SubmViewComponent,
        DirectSubmitComponent,
        ResultLogNodeComponent,
        DirectSubmitSideBarComponent,
        SubmFormComponent,
        SubmFieldComponent,
        SubmFeatureComponent,
        SubmSideBarComponent,
        SubmNavBarComponent,
        SubmAddDialogComponent,
        FeatureValueComponent,
        FeatureGridComponent,
        FeatureListComponent,
        ActionButtonsCellComponent,
        DateCellComponent,
        TextFilterComponent,
        DateFilterComponent
    ],
    exports: [
        SubmListComponent,
        SubmEditComponent,
        SubmViewComponent,
        DirectSubmitComponent
    ],
    entryComponents: [ResultLogNodeComponent]
})
export class SubmissionModule {
}