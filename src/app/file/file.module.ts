import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AgGridModule} from 'ag-grid-angular/main';

import {HttpCustomClientModule} from 'app/http/http-custom-client.module';
import {SharedModule} from 'app/shared/shared.module';

import {FileService} from './file.service';
import {FileUploadService} from './file-upload.service';
import {FileUploadBadgeComponent} from './file-upload-badge.component';
import {DirectoryPathComponent} from './directory-path.component';
import {UserDirsSideBarComponent} from './user-dirs-sidebar.component';

import {
    FileListComponent, ProgressCellComponent, FileActionsCellComponent,
    FileTypeCellComponent
} from './file-list.component';

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