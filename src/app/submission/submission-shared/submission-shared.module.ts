import { NgModule } from '@angular/core';
import { SubmissionService } from './submission.service';
import { SubmissionToPageTabService } from './submission-to-pagetab.service';
import { ExtSubmissionToSubmissionService } from './ext-submission-to-submission.service';
import { SubmissionToExtSubmissionService } from './submittion-to-ext-submission.service';
import { PageTabToSubmissionService } from './pagetab-to-submission.service';
import { SubmissionStatusService } from './submission-status.service';

@NgModule({
  imports: [],
  providers: [
    SubmissionService,
    SubmissionToPageTabService,
    ExtSubmissionToSubmissionService,
    PageTabToSubmissionService,
    SubmissionStatusService,
    SubmissionToExtSubmissionService
  ],
  declarations: [],
  exports: []
})
export class SubmissionSharedModule {}
