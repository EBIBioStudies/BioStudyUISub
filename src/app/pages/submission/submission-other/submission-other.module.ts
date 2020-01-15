import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalModule, TooltipModule } from 'ngx-bootstrap';
import { AuthModule } from 'app/auth/auth.module';
import { SubmissionSharedModule } from '../submission-shared/submission-shared.module';
import { AddSubmModalComponent } from './new-submission-button/add-subm-modal.component';
import { NewSubmissionButtonDirective } from './new-submission-button/new-submission-button.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ModalModule,
    TooltipModule,
    SubmissionSharedModule,
    AuthModule
  ],
  providers: [],
  declarations: [
    AddSubmModalComponent,
    NewSubmissionButtonDirective
  ],
  exports: [
    NewSubmissionButtonDirective
  ],
  entryComponents: [
    AddSubmModalComponent
  ]
})
export class SubmissionOtherModule {
}
