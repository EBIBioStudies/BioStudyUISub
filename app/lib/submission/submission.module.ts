import {NgModule}  from '@angular/core';
import {RouterModule} from '@angular/router';

import {AgGridModule} from 'ag-grid-ng2/main';

import {HttpClientModule} from '../http/http-client.module';
import {FileModule} from '../file/file.module';
import {SharedModule} from '../shared/shared.module';

import {SubmissionService} from './submission.service';
import {SubmissionUploadService} from './submission-upload.service';
import {DictionaryService} from './dictionary.service';
import {SubmissionModel} from './submission.model';
import {PubMedSearchService} from './pubMedSearch.service';

import {SubmissionListComponent, ActionButtonsCellComponent, DateCellComponent} from './subm-list.component';
import {SubmissionEditComponent} from './subm-edit.component';
import {SubmissionViewComponent} from './subm-view.component';
import {SubmissionUploadComponent, SubmitLogNodeComponent} from './subm-upload.component';
import {SubmissionUploadSideBarComponent} from './sidebar/subm-upload-sidebar.component';
import {SideBarComponent} from './sidebar/subm-sidebar.component';
import {SideBarItemComponent} from './sidebar/subm-sidebar.component';
import {SubmissionPanelComponent} from './panel/subm-panel.component';
import {SubmissionAttributesPanelComponent} from './panel/subm-attributes-panel.component';
import {SubmissionAttributesComponent} from './panel/subm-attributes.component';
import {SubmissionItemsComponent} from './panel/subm-items.component';
import {SubmissionItemsPanelComponent} from './panel/subm-items-panel.component';
import {InputFileComponent} from './panel/input-file.component';
import {PubMedIdSearchComponent} from './panel/pubmedid-search.component';
import {PropertyFilterPipe} from './panel/prop-filter.pipe';
import {SlideOutTipComponent} from './panel/slide-out-tip.component';
import {TextareaAutosize} from './textarea-autosize.directive';
import {UniqueAttrName} from './panel/unique-attr-name.directive';
import {DateFormatDirective} from './date-format.directive';
import {DateInputBoxComponent} from './date-input-box';
import {SubmTypeComponent} from './subm-type.component';
import {TextFilterComponent} from './ag-grid/text-filter.component';
import {DateFilterComponent} from './ag-grid/date-filter.component';

import {TreeViewComponent, TreeViewNodeComponent} from './results/tree-view.component';

@NgModule({
    imports: [
        HttpClientModule,
        AgGridModule.withComponents([
            ActionButtonsCellComponent,
            DateCellComponent,
            TextFilterComponent,
            DateFilterComponent
        ]),
        SharedModule,
        RouterModule,
        FileModule
    ],
    providers: [
        SubmissionService,
        SubmissionUploadService,
        PubMedSearchService,
        DictionaryService,
        SubmissionModel
    ],
    declarations: [
        SubmissionListComponent,
        SubmissionEditComponent,
        SubmissionViewComponent,
        SubmissionUploadComponent,
        SubmitLogNodeComponent,
        SubmissionUploadSideBarComponent,
        SubmissionPanelComponent,
        SubmissionAttributesPanelComponent,
        SubmissionAttributesComponent,
        SubmissionItemsPanelComponent,
        SubmissionItemsComponent,
        SideBarComponent,
        SideBarItemComponent,
        InputFileComponent,
        PubMedIdSearchComponent,
        SlideOutTipComponent,
        PropertyFilterPipe,
        TextareaAutosize,
        UniqueAttrName,
        ActionButtonsCellComponent,
        DateCellComponent,
        DateFormatDirective,
        DateInputBoxComponent,
        SubmTypeComponent,
        TextFilterComponent,
        DateFilterComponent,
        TreeViewComponent,
        TreeViewNodeComponent
    ],
    exports: [
        SubmissionListComponent,
        SubmissionEditComponent,
        SubmissionViewComponent,
        SubmissionUploadComponent
    ],
    entryComponents: [SubmitLogNodeComponent]
})
export class SubmissionModule {
}