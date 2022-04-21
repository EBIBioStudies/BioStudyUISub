import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { ThemeModule } from 'app/theme/theme.module';
import { SubmissionResultsModule } from '../submission-results/submission-results.module';
import { SubmissionSharedModule } from '../submission-shared/submission-shared.module';
import { DirectSubmitSideBarComponent } from './direct-submit-sidebar.component';
import { DirectSubmitComponent } from './direct-submit.component';
import { DirectSubmitFileUploadService } from './direct-submit-file-upload.service';
import { DirectSubmitService } from './direct-submit.service';
import { DirectSubmitFileComponent } from './direct-submit-file.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule,
    SubmissionSharedModule,
    SubmissionResultsModule,
    ThemeModule
  ],
  providers: [DirectSubmitFileUploadService, DirectSubmitService],
  declarations: [DirectSubmitComponent, DirectSubmitSideBarComponent, DirectSubmitFileComponent],
  exports: [DirectSubmitComponent]
})
export class SubmissionDirectModule {}
