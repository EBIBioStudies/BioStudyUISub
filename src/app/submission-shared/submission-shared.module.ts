import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {FileModule} from 'app/file/file.module';
import {SharedModule} from 'app/shared/shared.module';

import {FileInputComponent} from './file-input.component';
import {PubMedSearchService} from './pubmedid-search/pubmedid-search.service';
import {PubMedIdSearchComponent} from './pubmedid-search/pubmedid-search.component';
import {SlideOutTipComponent} from './slide-out-tip.component';
import {TextareaAutosize} from './textarea-autosize.directive';
import {TreeViewComponent, TreeViewNodeComponent} from './tree-view.component';
import {IdLinkComponent} from './id-link/id-link.component';
import {IdLinkModule} from './id-link/id-link.module';

@NgModule({
    imports: [
        SharedModule,
        FileModule,
        RouterModule,
        IdLinkModule
    ],
    providers: [
        PubMedSearchService
    ],
    declarations: [
        FileInputComponent,
        PubMedIdSearchComponent,
        SlideOutTipComponent,
        TextareaAutosize,
        TreeViewComponent,
        TreeViewNodeComponent
    ],
    exports: [
        FileInputComponent,
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