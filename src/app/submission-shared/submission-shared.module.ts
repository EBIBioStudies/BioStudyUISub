import {NgModule}  from '@angular/core';
import {RouterModule} from '@angular/router';

import {FileModule} from 'app/file/file.module';
import {SharedModule} from 'app/shared/shared.module';

import {DateFormatDirective} from './date-format.directive';
import {DateInputComponent} from './date-input.component';
import {FileInputComponent} from './file-input.component';
import {PubMedSearchService} from './pubmedid-search/pubmedid-search.service';
import {PubMedIdSearchComponent} from './pubmedid-search/pubmedid-search.component';
import {SlideOutTipComponent} from './slide-out-tip.component';
import {TextareaAutosize} from './textarea-autosize.directive';
import {TreeViewComponent, TreeViewNodeComponent} from './tree-view.component';
import {BsDatepickerModule} from "ngx-bootstrap";

@NgModule({
    imports: [
        SharedModule,
        FileModule,
        RouterModule,
        BsDatepickerModule.forRoot(),
    ],
    providers: [
        PubMedSearchService,
    ],
    declarations: [
        DateFormatDirective,
        DateInputComponent,
        FileInputComponent,
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
        PubMedIdSearchComponent,
        SlideOutTipComponent,
        TextareaAutosize,
        TreeViewComponent,
        TreeViewNodeComponent
    ]
})
export class SubmissionSharedModule {
}