import { NgModule } from '@angular/core';
import { SubmissionService } from './submission.service';
import { SubmissionStatusService } from './submission-status.service';
import { SubmissionTemplatesService } from './submission-templates.service';
import { SubmissionTransformModule } from './../submission-transform/submission-transform.module';

@NgModule({
  imports: [SubmissionTransformModule],
  providers: [SubmissionService, SubmissionStatusService, SubmissionTemplatesService],
  declarations: [],
  exports: []
})
export class SubmissionSharedModule {}
