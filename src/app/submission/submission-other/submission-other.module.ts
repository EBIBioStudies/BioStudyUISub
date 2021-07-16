import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AuthModule } from 'app/auth/auth.module';
import { SubmissionSharedModule } from '../submission-shared/submission-shared.module';
import { AddSubmModalComponent } from './new-submission-button/add-subm-modal.component';
import { NewSubmissionButtonDirective } from './new-submission-button/new-submission-button.directive';
import { UniqueSubmissionWarningComponent } from './unique-submission-warning/unique-submission-warning.component';
import { UniqueSubmissionModalComponent } from './unique-submission-modal/unique-submission-modal.component';

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule, ModalModule, TooltipModule, SubmissionSharedModule, AuthModule],
  providers: [],
  declarations: [
    AddSubmModalComponent,
    NewSubmissionButtonDirective,
    UniqueSubmissionWarningComponent,
    UniqueSubmissionModalComponent
  ],
  exports: [NewSubmissionButtonDirective, UniqueSubmissionWarningComponent],
  entryComponents: [AddSubmModalComponent]
})
export class SubmissionOtherModule {}
