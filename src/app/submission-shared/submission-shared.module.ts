import {NgModule}  from '@angular/core';
import {RouterModule} from '@angular/router';

import {FileModule} from 'app/file/file.module';
import {SharedModule} from 'app/shared/shared.module';

import {DateFormatDirective} from './date-format.directive';
import {DateInputComponent} from './date-input.component';
import {FileInputComponent} from './file-input.component';
import {FileSelectComponent} from './file-select/file-select.component';
import {FileTreeComponent} from './file-select/file-tree.component';
import {FileTreeDropdownComponent} from './file-select/file-tree-dropdown.component';
import {PubMedSearchService} from './pubmedid-search/pubmedid-search.service';
import {PubMedIdSearchComponent} from './pubmedid-search/pubmedid-search.component';
import {SlideOutTipComponent} from './slide-out-tip.component';
import {TextareaAutosize} from './textarea-autosize.directive';
import {TreeViewComponent, TreeViewNodeComponent} from './tree-view.component';
import {BsDatepickerModule} from "ngx-bootstrap";
import {IdLinkComponent} from "./id-link/id-link.component";
import {IdLinkModule} from "./id-link/id-link.module";
import {FileTreeStore} from './file-select/file-tree.store';

@NgModule({
    imports: [
        SharedModule,
        FileModule,
        RouterModule,
        IdLinkModule,
        BsDatepickerModule.forRoot(),
    ],
    providers: [
        PubMedSearchService,
        FileTreeStore
    ],
    declarations: [
        DateFormatDirective,
        DateInputComponent,
        FileInputComponent,
        FileSelectComponent,
        FileTreeComponent,
        FileTreeDropdownComponent,
        PubMedIdSearchComponent,
        SlideOutTipComponent,
        TextareaAutosize,
        TreeViewComponent,
        TreeViewNodeComponent
    ],
    exports: [
        DateFormatDirective,
        DateInputComponent,
        FileInputComponent,
        FileSelectComponent,
        PubMedIdSearchComponent,
        SlideOutTipComponent,
        TextareaAutosize,
        TreeViewComponent,
        TreeViewNodeComponent,
        IdLinkComponent
    ]
})
export class SubmissionSharedModule {
}