import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './help/help.component';
import { FileListComponent } from './file/file-list/file-list.component';
import { AuthGuard } from 'app/auth-guard.service';
import { DirectSubmitComponent } from './submission/submission-direct/direct-submit.component';
import { SubmissionEditComponent } from './submission/submission-edit/submission-edit.component';
import { SubmListComponent } from './submission/submission-list/subm-list.component';
import { PagesComponent } from './pages.component';

const pagesRoutes: Routes = [
  { path: 'help', component: HelpComponent },
  { path: 'files', component: FileListComponent, canActivate: [AuthGuard] },
  {
    path: 'submissions',
    component: PagesComponent,
    data: { isSent: true, reuse: true },
    canActivate: [AuthGuard],
    children: [
      {
        path: 'draft',
        component: SubmListComponent,
        data: { isSent: false, reuse: true }
      },
      { path: 'direct_upload', component: DirectSubmitComponent },
      {
        path: 'edit/:accno',
        component: SubmissionEditComponent,
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'new/:accno',
        component: SubmissionEditComponent,
        data: { isNew: true }
      },
      {
        path: ':accno',
        component: SubmissionEditComponent,
        data: { readonly: true },
        runGuardsAndResolvers: 'always'
      },
      {
        path: '',
        component: SubmListComponent,
        data: { isSent: true, reuse: true }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(pagesRoutes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
