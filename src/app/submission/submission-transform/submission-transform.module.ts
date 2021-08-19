import { NgModule } from '@angular/core';
import { ExtSubmissionToSubmissionService } from './ext-submission-to-submission.service';
import { SubmissionToExtSubmissionService } from './submittion-to-ext-submission.service';

@NgModule({
  providers: [ExtSubmissionToSubmissionService, SubmissionToExtSubmissionService]
})
export class SubmissionTransformModule {}
