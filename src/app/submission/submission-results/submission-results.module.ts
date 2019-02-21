import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {CollapseModule} from 'ngx-bootstrap';
import {ResultsLogNodeComponent} from './results-log-node.component';
import {SubmResultsModalComponent} from './subm-results-modal.component';
import {SubmResultsTreeComponent} from './subm-results-tree.component';
import {TreeViewComponent, TreeViewNodeComponent} from './tree-view.component';

@NgModule({
    imports: [
        CommonModule,
        CollapseModule
    ],
    providers: [],
    declarations: [
        TreeViewComponent,
        TreeViewNodeComponent,
        ResultsLogNodeComponent,
        SubmResultsModalComponent,
        SubmResultsTreeComponent,
    ],
    exports: [
        SubmResultsModalComponent,
        SubmResultsTreeComponent
    ],
    entryComponents: [
        SubmResultsModalComponent,
        ResultsLogNodeComponent
    ]
})
export class SubmissionResultsModule {
}