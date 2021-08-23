import { NgModule } from '@angular/core';
import { ExtSubmissionToSubmissionService } from './ext-submission-to-submission.service';
import { SubmissionToExtSubmissionService } from './submission-to-ext-submission.service';

@NgModule({
  providers: [ExtSubmissionToSubmissionService, SubmissionToExtSubmissionService]
})
export class SubmissionTransformModule {}
