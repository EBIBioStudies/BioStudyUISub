import { AccordionModule } from 'ngx-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { DirectoryPathComponent } from './file-list/directory-path/directory-path.component';
import { DirectorySidebarComponent } from './file-list/directory-sidebar/directory-sidebar.component';
import { FTPUploadButtonComponent } from './file-list/ftp-upload-button/ftp-upload-button.component';
import { FileActionsCellComponent } from './file-list/ag-grid/file-actions-cell.component';
import { FileListComponent } from './file-list/file-list.component';
import { FileSelectComponent } from './file-select/file-select.component';
import { FileService } from './shared/file.service';
import { FileTreeComponent } from './file-select/file-tree.component';
import { FileTreeDropdownComponent } from './file-select/file-tree-dropdown.component';
import { FileTreeStore } from './file-select/file-tree.store';
import { FileTypeCellComponent } from './file-list/ag-grid/file-type-cell.component';
import { FileUploadBadgeComponent } from './file-list/file-upload-badge/file-upload-badge.component';
import { FileUploadList } from './shared/file-upload-list.service';
import { HttpUploadClientService } from './shared/http-upload-client.service';
import { MarkdownModule } from 'ngx-markdown';
import { NgModule } from '@angular/core';
import { ProgressCellComponent } from './file-list/ag-grid/upload-progress-cell.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { UserData } from 'app/auth/shared';

@NgModule({
    imports: [
        MarkdownModule.forChild(),
        RouterModule,
        SharedModule,
        AgGridModule.withComponents([
            FileActionsCellComponent,
            FileTypeCellComponent,
            ProgressCellComponent
        ]),
        AccordionModule.forRoot()
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
        FileService,
        FileTreeStore,
        FileUploadList,
        HttpUploadClientService,
        UserData
    ],
    exports: [
        FileListComponent,
        FileSelectComponent
    ]
})
export class FileModule {
}
