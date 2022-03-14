import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { HttpClientModule } from '@angular/common/http';
import { SubmissionService } from './submission.service';
import { SubmissionToPageTabService } from './submission-to-pagetab.service';
import { PageTabToSubmissionService } from './pagetab-to-submission.service';
import { SubmissionStatusService } from './submission-status.service';
import { DNAInputComponent } from './dna-input/dna-input.component';
import { ProteinInputComponent } from './protein-input/protein-input.component';
import { SelectInputComponent } from './select-input/select-input.component';
import { DateInputComponent } from './date-input/date-input.component';
import { IdLinkComponent } from './id-link/id-link.component';
import { IdLinkValueValidatorDirective } from './id-link/id-link.validator.directive';
import { IdLinkService } from './id-link/id-link.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    NgSelectModule,
    BsDatepickerModule,
    HttpClientModule,
    TypeaheadModule.forRoot()
  ],
  providers: [
    SubmissionService,
    SubmissionToPageTabService,
    PageTabToSubmissionService,
    SubmissionStatusService,
    IdLinkService
  ],
  declarations: [
    DNAInputComponent,
    ProteinInputComponent,
    SelectInputComponent,
    DateInputComponent,
    IdLinkComponent,
    IdLinkValueValidatorDirective
  ],
  exports: [
    DNAInputComponent,
    ProteinInputComponent,
    SelectInputComponent,
    DateInputComponent,
    IdLinkComponent,
    BsDatepickerModule
  ]
})
export class SubmissionSharedModule {}
