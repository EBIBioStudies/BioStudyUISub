import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AgGridModule} from 'ag-grid-angular/main';

import {HttpCustomClientModule} from 'app/http/http-custom-client.module';
import {SharedModule} from 'app/shared/shared.module';

import {FileActionsCellComponent} from './file-list/ag-grid/file-actions-cell.component';
import {FileTypeCellComponent} from './file-list/ag-grid/file-type-cell.component';
import {ProgressCellComponent} from './file-list/ag-grid/upload-progress-cell.component';
import {FileListComponent} from './file-list/file-list.component';
import {FileUploadService} from './shared/file-upload.service';
import {FileService} from './shared/file.service';
import {FileSelectComponent} from './file-select/file-select.component';
import {FileTreeDropdownComponent} from './file-select/file-tree-dropdown.component';
import {FileTreeComponent} from './file-select/file-tree.component';
import {DirectorySidebarComponent} from './file-list/directory-sidebar/directory-sidebar.component';
import {DirectoryPathComponent} from './file-list/directory-path/directory-path.component';
import {FileUploadBadgeComponent} from './file-list/file-upload-badge/file-upload-badge.component';
import {FileTreeStore} from './file-select/file-tree.store';
import {XhrUploadService} from './shared/xhr-upload.service';

@NgModule({
    imports: [
        HttpCustomClientModule,
        RouterModule,
        SharedModule,
        AgGridModule.withComponents([
            FileActionsCellComponent,
            FileTypeCellComponent,
            ProgressCellComponent
        ])
    ],
    declarations: [
        FileListComponent,
        FileActionsCellComponent,
        FileTypeCellComponent,
        ProgressCellComponent,
        FileUploadBadgeComponent,
        DirectoryPathComponent,
        DirectorySidebarComponent,
        FileSelectComponent,
        FileTreeComponent,
        FileTreeDropdownComponent,
    ],
    providers: [
        XhrUploadService,
        FileService,
        FileUploadService,
        FileTreeStore
    ],
    exports: [
        FileListComponent,
        FileSelectComponent
    ]
})
export class FileModule {
}