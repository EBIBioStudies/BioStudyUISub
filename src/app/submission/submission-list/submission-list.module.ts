import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ActionButtonsCellComponent } from './ag-grid/action-buttons-cell.component';
import { DateCellComponent } from './ag-grid/date-cell.component';
import { DateFilterComponent } from './ag-grid/date-filter.component';
import { SharedModule } from 'app/shared/shared.module';
import { StatusCellComponent } from './ag-grid/status-cell.component';
import { SubmListComponent } from './subm-list.component';
import { SubmissionOtherModule } from '../submission-other/submission-other.module';
import { SubmissionSharedModule } from '../submission-shared/submission-shared.module';
import { TextFilterComponent } from './ag-grid/text-filter.component';
import { TextCellComponent } from './ag-grid/text-cell.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    TabsModule,
    AgGridModule.withComponents([
      ActionButtonsCellComponent,
      DateCellComponent,
      TextFilterComponent,
      DateFilterComponent,
      StatusCellComponent,
      TextCellComponent
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
    TextCellComponent,
    ActionButtonsCellComponent,
    DateCellComponent
  ],
  exports: []
})
export class SubmissionListModule {}
