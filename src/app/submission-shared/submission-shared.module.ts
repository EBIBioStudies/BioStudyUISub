import {NgModule}  from '@angular/core';
import {SharedModule} from 'app/shared/shared.module';

import {DateFormatDirective} from './date-format.directive';
import {DateInputBoxComponent} from './date-input-box';
import {PubMedSearchService} from './pubmedid-search/pubmedid-search.service';
import {PubMedIdSearchComponent} from './pubmedid-search/pubmedid-search.component';
import {SlideOutTipComponent} from './slide-out-tip.component';
import {TextareaAutosize} from './textarea-autosize.directive';
import {TreeViewComponent, TreeViewNodeComponent} from './tree-view.component';

@NgModule({
    imports: [
        SharedModule
    ],
    providers: [
        PubMedSearchService,
    ],
    declarations: [
        DateFormatDirective,
        DateInputBoxComponent,
        PubMedIdSearchComponent,
        SlideOutTipComponent,
        TextareaAutosize,
        TreeViewComponent,
        TreeViewNodeComponent
    ],
    exports: [
        DateFormatDirective,
        DateInputBoxComponent,
        PubMedIdSearchComponent,
        SlideOutTipComponent,
        TextareaAutosize,
        TreeViewComponent,
        TreeViewNodeComponent
    ]
})
export class SubmissionSharedModule {
}