import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HttpClientModule } from '@angular/common/http';
import { SubmissionService } from './submission.service';
import { SubmissionToPageTabService } from './submission-to-pagetab.service';
import { PageTabToSubmissionService } from './pagetab-to-submission.service';
import { SubmissionStatusService } from './submission-status.service';
import { DNAInputComponent } from './dna-input/dna-input.component';
import { ProteinInputComponent } from './protein-input/protein-input.component';
import { SelectInputComponent } from './select-input/select-input.component';
import { DateInputComponent } from './date-input/date-input.component';
import { OrgInputComponent } from './org-input/org-input.component';
import { OrgService } from './org-input/org.service';
import { SelectValqualsInputComponent } from './select-valquals-input/select-valquals-input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    NgSelectModule,
    BsDatepickerModule,
    HttpClientModule
  ],
  providers: [
    SubmissionService,
    SubmissionToPageTabService,
    PageTabToSubmissionService,
    SubmissionStatusService,
    OrgService
  ],
  declarations: [
    DNAInputComponent,
    ProteinInputComponent,
    SelectInputComponent,
    DateInputComponent,
    OrgInputComponent,
    SelectValqualsInputComponent
  ],
  exports: [
    DNAInputComponent,
    ProteinInputComponent,
    SelectInputComponent,
    DateInputComponent,
    OrgInputComponent,
    BsDatepickerModule,
    SelectValqualsInputComponent
  ]
})
export class SubmissionSharedModule {}
