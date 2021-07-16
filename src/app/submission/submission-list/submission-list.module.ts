import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ActionButtonsCellComponent } from './ag-grid/action-buttons-cell.component';
import { DateCellComponent } from './ag-grid/date-cell.component';
import { DateFilterComponent } from './ag-grid/date-filter.component';
import { SharedModule } from 'app/shared/shared.module';
import { StatusCellComponent } from './ag-grid/status-cell.component';
import { SubmListComponent } from './subm-list.component';
import { SubmissionOtherModule } from '../submission-other/submission-other.module';
import { SubmissionSharedModule } from '../submission-shared/submission-shared.module';
import { TextFilterComponent } from './ag-grid/text-filter.component';

@NgModule({
  imports: [
    SharedModule,
    AgGridModule.withComponents([
      ActionButtonsCellComponent,
      DateCellComponent,
      TextFilterComponent,
      DateFilterComponent,
      StatusCellComponent
    ]),
    SubmissionSharedModule,
    SubmissionOtherModule,
    ButtonsModule
  ],
  providers: [],
  declarations: [
    SubmListComponent,
    StatusCellComponent,
    TextFilterComponent,
    DateFilterComponent,
    ActionButtonsCellComponent,
    DateCellComponent
  ],
  exports: []
})
export class SubmissionListModule {}
