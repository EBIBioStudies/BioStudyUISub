import {NgModule}  from '@angular/core';

import {SharedModule} from 'app/shared/shared.module';
import {SubmissionSharedModule} from 'app/submission-shared/submission-shared.module';

import {SubmissionPanelComponent} from './panel/subm-panel.component';

import {SubmissionAttributesPanelComponent} from './panel-attributes/subm-attributes-panel.component';
import {SubmissionAttributesComponent} from './panel-attributes/subm-attributes.component';
import {UniqueAttrName} from './panel-attributes/unique-attr-name.directive';

import {SubmissionItemsComponent} from './panel-items/subm-items.component';
import {SubmissionItemsPanelComponent} from './panel-items/subm-items-panel.component';
import {PropertyFilterPipe} from './panel-items/prop-filter.pipe';
import {DictionaryService} from './dictionary.service';

import {SubmissionModel} from './model/submission.model';

@NgModule({
    imports: [
        SharedModule,
        SubmissionSharedModule],
    providers: [
        DictionaryService,
        SubmissionModel
    ],
    declarations: [
        SubmissionPanelComponent,
        SubmissionAttributesPanelComponent,
        SubmissionAttributesComponent,
        SubmissionItemsPanelComponent,
        SubmissionItemsComponent,
        PropertyFilterPipe,
        UniqueAttrName
    ],
    exports: [
        SubmissionPanelComponent,
        SubmissionAttributesPanelComponent,
        SubmissionItemsPanelComponent
    ]
})
export class SubmissionModelModule {
}