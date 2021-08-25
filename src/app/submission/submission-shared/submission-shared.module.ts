import { NgModule } from '@angular/core';
import { SubmissionService } from './submission.service';
import { SubmissionStatusService } from './submission-status.service';
import { SubmissionTemplatesService } from './submission-templates.service';
import { SubmissionTransformModule } from './../submission-transform/submission-transform.module';
import { SubmissionTypeService } from './submission-type.service';

@NgModule({
  imports: [SubmissionTransformModule],
  providers: [
    SubmissionService,
    SubmissionStatusService,
    SubmissionTemplatesService,
    SubmissionStatusService,
    SubmissionTypeService
  ],
  declarations: [],
  exports: []
})
export class SubmissionSharedModule {}
