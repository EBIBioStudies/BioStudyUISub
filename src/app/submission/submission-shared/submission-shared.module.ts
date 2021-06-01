import { NgModule } from '@angular/core';
import { SubmissionService } from './submission.service';
import { SubmissionToPageTabService } from './submission-to-pagetab.service';
import { PageTabToSubmissionService } from './pagetab-to-submission.service';
import { SubmissionStatusService } from './submission-status.service';

@NgModule({
  imports: [],
  providers: [SubmissionService, SubmissionToPageTabService, PageTabToSubmissionService, SubmissionStatusService],
  declarations: [],
  exports: []
})
export class SubmissionSharedModule {}
