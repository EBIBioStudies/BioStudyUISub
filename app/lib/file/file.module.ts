import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AgGridModule} from 'ag-grid-ng2/main';

import {HttpClientModule} from '../http/http-client.module';
import {SharedModule} from '../shared/shared.module';
import {FileService} from './file.service';
import {FileUploadService} from './file-upload.service';
import {FileUploadButtonComponent} from './file-upload-button.component';
import {FileUploadBadgeComponent} from './file-upload-badge.component';
import {DirectoryPathComponent} from './directory-path.component';
import {UserDirsSideBarComponent} from './user-dirs-sidebar.component';
import {
    FileListComponent, ProgressCellComponent, FileActionsCellComponent,
    FileTypeCellComponent
} from './file-list.component';

@NgModule({
    imports: [
        HttpClientModule,
        RouterModule,
        SharedModule,
        AgGridModule.withComponents([
            FileActionsCellComponent,
            FileTypeCellComponent,
            ProgressCellComponent
        ])
    ],
    exports: [
    ],
    declarations: [
        FileListComponent,
        FileActionsCellComponent,
        FileTypeCellComponent,
        ProgressCellComponent,
        FileUploadButtonComponent,
        FileUploadBadgeComponent,
        DirectoryPathComponent,
        UserDirsSideBarComponent
    ],
    providers: [
        FileService,
        FileUploadService
    ],
    exports: [
        FileListComponent
    ]
})
export class FileModule {
}