import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HelpComponent } from './help/help.component';
import { PagesRoutingModule } from './pages-routing.module';
import { SubmissionDirectModule } from './submission/submission-direct/submission-direct.module';
import { SubmissionEditModule } from './submission/submission-edit/submission-edit.module';
import { SubmissionListModule } from './submission/submission-list/submission-list.module';
import { FileModule } from './file/file.module';

@NgModule({
  imports: [
    SharedModule,
    FileModule,
    PagesRoutingModule,
    SubmissionDirectModule,
    SubmissionEditModule,
    SubmissionListModule
  ],
  declarations: [PagesComponent, HelpComponent, NotFoundComponent]
})
export class PagesModule {}
