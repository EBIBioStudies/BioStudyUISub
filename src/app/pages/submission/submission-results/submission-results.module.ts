import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ResultsLogNodeComponent } from './results-log-node.component';
import { SubmErrorModalComponent } from './subm-error-modal.component';
import { SubmResultsTreeComponent } from './subm-results-tree.component';
import { TreeViewComponent, TreeViewNodeComponent } from './tree-view.component';

@NgModule({
  imports: [CommonModule, CollapseModule],
  providers: [],
  declarations: [
    TreeViewComponent,
    TreeViewNodeComponent,
    ResultsLogNodeComponent,
    SubmErrorModalComponent,
    SubmResultsTreeComponent
  ],
  exports: [SubmErrorModalComponent, SubmResultsTreeComponent],
  entryComponents: [SubmErrorModalComponent, ResultsLogNodeComponent]
})
export class SubmissionResultsModule {}
