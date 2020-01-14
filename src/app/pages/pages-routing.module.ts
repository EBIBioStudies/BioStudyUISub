import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './help/help.component';
import { FileListComponent } from './file/file-list/file-list.component';
import { AuthGuard } from '../auth-guard.service';
import { DirectSubmitComponent } from './submission/submission-direct/direct-submit.component';
import { SubmissionEditComponent } from './submission/submission-edit/submission-edit.component';
import { SubmListComponent } from './submission/submission-list/subm-list.component';


const pagesRoutes: Routes = [
  { path: 'help', component: HelpComponent },
  { path: 'files', component: FileListComponent, canActivate: [AuthGuard] },
  {
    path: 'submissions',
    component: SubmListComponent,
    data: { isSent: true, reuse: true },
    canActivate: [AuthGuard]
  },
  {
    path: 'submissions/draft',
    component: SubmListComponent,
    data: { isSent: false, reuse: true },
    canActivate: [AuthGuard]
  },
  {
    path: 'submissions/direct_upload',
    component: DirectSubmitComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'submissions/edit/:accno',
    component: SubmissionEditComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'submissions/new/:accno',
    component: SubmissionEditComponent,
    data: { isNew: true },
    canActivate: [AuthGuard]
  },
  {
    path: 'submissions/:accno',
    component: SubmissionEditComponent,
    data: { readonly: true },
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  }
];

@NgModule({
  imports: [RouterModule.forChild(pagesRoutes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
