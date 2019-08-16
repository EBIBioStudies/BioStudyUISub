import { AgGridModule } from 'ag-grid-angular';
import { HttpCustomClientModule } from 'app/http/http-custom-client.module';
import { MarkdownModule } from 'ngx-markdown';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { FileActionsCellComponent } from './file-list/ag-grid/file-actions-cell.component';
import { FileTypeCellComponent } from './file-list/ag-grid/file-type-cell.component';
import { ProgressCellComponent } from './file-list/ag-grid/upload-progress-cell.component';
import { FileListComponent } from './file-list/file-list.component';
import { FTPUploadButtonComponent } from './file-list/ftp-upload-button/ftp-upload-button.component';
import { FileUploadList } from './shared/file-upload-list.service';
import { FileService } from './shared/file.service';
import { FileSelectComponent } from './file-select/file-select.component';
import { FileTreeDropdownComponent } from './file-select/file-tree-dropdown.component';
import { FileTreeComponent } from './file-select/file-tree.component';
import { DirectorySidebarComponent } from './file-list/directory-sidebar/directory-sidebar.component';
import { DirectoryPathComponent } from './file-list/directory-path/directory-path.component';
import { FileUploadBadgeComponent } from './file-list/file-upload-badge/file-upload-badge.component';
import { FileTreeStore } from './file-select/file-tree.store';
import { HttpUploadClientService } from './shared/http-upload-client.service';

@NgModule({
    imports: [
        MarkdownModule.forChild(),
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
        FTPUploadButtonComponent
    ],
    providers: [
        HttpUploadClientService,
        FileService,
        FileUploadList,
        FileTreeStore
    ],
    exports: [
        FileListComponent,
        FileSelectComponent
    ]
})
export class FileModule {
}
