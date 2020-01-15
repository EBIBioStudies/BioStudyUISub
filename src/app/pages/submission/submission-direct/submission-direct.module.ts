import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { SubmissionResultsModule } from '../submission-results/submission-results.module';
import { SubmissionSharedModule } from '../submission-shared/submission-shared.module';
import { DirectSubmitSideBarComponent } from './direct-submit-sidebar.component';
import { DirectSubmitComponent } from './direct-submit.component';
import { DirectSubmitFileUploadService } from './direct-submit-file-upload.service';
import { DirectSubmitService } from './direct-submit.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    SubmissionSharedModule,
    SubmissionResultsModule
  ],
  providers: [
    DirectSubmitFileUploadService,
    DirectSubmitService
  ],
  declarations: [
    DirectSubmitComponent,
    DirectSubmitSideBarComponent
  ],
  exports: [
    DirectSubmitComponent
  ]
})
export class SubmissionDirectModule {
}
