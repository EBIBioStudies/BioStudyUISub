import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth-guard.service';
import { DirectSubmitComponent } from './submission/submission-direct/direct-submit.component';
import { FileListComponent } from './file/file-list/file-list.component';
import { HelpComponent } from './help/help.component';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from 'app/core/components/error/not-found.component';
import { SubmListComponent } from './submission/submission-list/subm-list.component';
import { SubmissionEditComponent } from './submission/submission-edit/submission-edit.component';
import { ProfileComponent } from './profile/profile.component';

const appRoutes: Routes = [
  { path: 'help', component: HelpComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'files', component: FileListComponent, canActivate: [AuthGuard] },
  {
    path: 'draft',
    component: SubmListComponent,
    data: { isSent: false, reuse: true },
    canActivate: [AuthGuard]
  },
  { path: 'direct_upload', component: DirectSubmitComponent, canActivate: [AuthGuard] },
  { path: 'submissions', redirectTo: '' },
  {
    path: 'edit/:accno',
    component: SubmissionEditComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard]
  },
  {
    path: 'new',
    component: SubmissionEditComponent,
    data: { isNew: true },
    canActivate: [AuthGuard]
  },
  {
    path: 'new/:accno',
    component: SubmissionEditComponent,
    data: { isNew: true },
    canActivate: [AuthGuard]
  },
  {
    path: ':accno',
    component: SubmissionEditComponent,
    data: { readonly: true },
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: SubmListComponent,
    data: { isSent: true, reuse: true },
    canActivate: [AuthGuard]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 70]
    })
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
