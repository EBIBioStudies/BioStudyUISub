import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SubmissionService } from './submission.service';
import { SubmissionToPageTabService } from './submission-to-pagetab.service';
import { PageTabToSubmissionService } from './pagetab-to-submission.service';
import { SubmissionStatusService } from './submission-status.service';
import { DNAInputComponent } from './dna-input/dna-input.component';
import { ProteinInputComponent } from './protein-input/protein-input.component';
import { SelectInputComponent } from './select-input/select-input.component';
import { ORCIDInputBoxComponent } from './orcid-input-box/orcid-input-box.component';
import { DateInputComponent } from './date-input/date-input.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CKEditorModule, NgSelectModule, BsDatepickerModule],
  providers: [SubmissionService, SubmissionToPageTabService, PageTabToSubmissionService, SubmissionStatusService],
  declarations: [
    ORCIDInputBoxComponent,
    DNAInputComponent,
    ProteinInputComponent,
    SelectInputComponent,
    DateInputComponent
  ],
  exports: [
    ORCIDInputBoxComponent,
    DNAInputComponent,
    ProteinInputComponent,
    SelectInputComponent,
    DateInputComponent,
    BsDatepickerModule
  ]
})
export class SubmissionSharedModule {}
