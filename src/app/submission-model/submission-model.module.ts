import {NgModule}  from '@angular/core';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared/shared.module';
import {FileModule} from '../file/file.module';
import {SubmissionSharedModule} from '../submission-shared/submission-shared.module';

import {SubmissionPanelComponent} from './panel/subm-panel.component';

import {SubmissionAttributesPanelComponent} from './panel-attributes/subm-attributes-panel.component';
import {SubmissionAttributesComponent} from './panel-attributes/subm-attributes.component';
import {InputFileComponent} from './panel-attributes/input-file.component';
import {UniqueAttrName} from './panel-attributes/unique-attr-name.directive';

import {SubmissionItemsComponent} from './panel-items/subm-items.component';
import {SubmissionItemsPanelComponent} from './panel-items/subm-items-panel.component';
import {PropertyFilterPipe} from './panel-items/prop-filter.pipe';
import {DictionaryService} from './dictionary.service';

import {SubmissionModel} from './model/submission.model';

@NgModule({
    imports: [
        SharedModule,
        FileModule,
        SubmissionSharedModule,
        RouterModule
    ],
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
        InputFileComponent,
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