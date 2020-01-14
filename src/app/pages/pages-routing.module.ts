import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './help/help.component';
import { FileListComponent } from './file/file-list/file-list.component';
import { AuthGuard } from '../auth-guard.service';

const pagesRoutes: Routes = [
  { path: 'help', component: HelpComponent },
  { path: 'files', component: FileListComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(pagesRoutes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
