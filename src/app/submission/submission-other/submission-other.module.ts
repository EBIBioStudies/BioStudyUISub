import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AuthModule } from 'app/auth/auth.module';
import { SubmissionTransformModule } from 'app/submission/submission-transform/submission-transform.module';
import { AddSubmModalComponent } from './add-subm-modal/add-subm-modal.component';
import { NewSubmissionButtonComponent } from './new-submission-button/new-submission-button.component';
import { NewSubmissionButtonDirective } from './new-submission-button/new-submission-button.directive';
import { UniqueSubmissionWarningComponent } from './unique-submission-warning/unique-submission-warning.component';
import { UniqueSubmissionModalComponent } from './unique-submission-modal/unique-submission-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ModalModule,
    TooltipModule,
    AuthModule,
    BsDropdownModule,
    SubmissionTransformModule
  ],
  providers: [],
  declarations: [
    AddSubmModalComponent,
    NewSubmissionButtonDirective,
    UniqueSubmissionWarningComponent,
    UniqueSubmissionModalComponent,
    NewSubmissionButtonComponent
  ],
  exports: [NewSubmissionButtonDirective, UniqueSubmissionWarningComponent, NewSubmissionButtonComponent],
  entryComponents: [AddSubmModalComponent]
})
export class SubmissionOtherModule {}
