import { Component, Input } from '@angular/core';
import { ResultsLogNodeComponent } from './results-log-node.component';
import { TreeViewConfig } from './tree-view.component';

@Component({
  selector: 'st-subm-results-tree',
  templateUrl: './subm-results-tree.component.html'
})
export class SubmResultsTreeComponent {
  @Input() log: any;

  treeViewConfig: TreeViewConfig = {
    children(data: any = {}): any[] {
      return data.subnodes ? data.subnodes : [];
    },
    nodeComponentClass: ResultsLogNodeComponent
  };
}
