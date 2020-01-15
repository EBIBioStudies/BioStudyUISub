import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from 'app/shared/shared.module';
import { SubmissionOtherModule } from '../submission-other/submission-other.module';
import { SubmissionSharedModule } from '../submission-shared/submission-shared.module';
import { DateFilterComponent } from './ag-grid/date-filter.component';
import { TextFilterComponent } from './ag-grid/text-filter.component';

import { DateCellComponent, ActionButtonsCellComponent, SubmListComponent } from './subm-list.component';
import { ButtonsModule } from 'ngx-bootstrap';

@NgModule({
    imports: [
        SharedModule,
        AgGridModule.withComponents([
            ActionButtonsCellComponent,
            DateCellComponent,
            TextFilterComponent,
            DateFilterComponent
        ]),
        SubmissionSharedModule,
        SubmissionOtherModule,
        ButtonsModule
    ],
    providers: [],
    declarations: [
        SubmListComponent,
        TextFilterComponent,
        DateFilterComponent,
        ActionButtonsCellComponent,
        DateCellComponent
    ],
    exports: []
})
export class SubmissionListModule {
}
