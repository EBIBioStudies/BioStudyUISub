import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DirectoryPathComponent } from './file-list/directory-path/directory-path.component';
import { DirectorySidebarComponent } from './file-list/directory-sidebar/directory-sidebar.component';
import { FTPUploadButtonComponent } from './file-list/ftp-upload-button/ftp-upload-button.component';
import { FileActionsCellComponent } from './file-list/ag-grid/file-actions-cell.component';
import { FileListComponent } from './file-list/file-list.component';
import { FileSelectComponent } from './file-select/file-select.component';
import { FileService } from './shared/file.service';
import { FileTreeComponent } from './file-select/file-tree.component';
import { FileTreeStore } from './file-select/file-tree.store';
import { FileTypeCellComponent } from './file-list/ag-grid/file-type-cell.component';
import { FileUploadList } from './shared/file-upload-list.service';
import { HttpUploadClientService } from './shared/http-upload-client.service';
import { MarkdownModule } from 'ngx-markdown';
import { NgModule } from '@angular/core';
import { ProgressCellComponent } from './file-list/ag-grid/upload-progress-cell.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ThemeModule } from 'app/theme/theme.module';
import { UploadFileModalComponent } from './upload-file-modal/upload-file-modal.component';
import { UploadErrorModalComponent } from './upload-error-modal/upload-error-modal.component';
import { UserData } from 'app/auth/shared';
import { CoreModule } from 'app/core/core.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  imports: [
    CommonModule,
    MarkdownModule.forChild(),
    RouterModule,
    SharedModule,
    AgGridModule.withComponents([FileActionsCellComponent, FileTypeCellComponent, ProgressCellComponent]),
    AccordionModule.forRoot(),
    ThemeModule,
    CoreModule,
    FormsModule,
    TabsModule,
    TooltipModule
  ],
  declarations: [
    FileListComponent,
    FileActionsCellComponent,
    FileTypeCellComponent,
    ProgressCellComponent,
    DirectoryPathComponent,
    DirectorySidebarComponent,
    FileSelectComponent,
    FileTreeComponent,
    FTPUploadButtonComponent,
    UploadFileModalComponent,
    UploadErrorModalComponent
  ],
  providers: [FileService, FileTreeStore, FileUploadList, HttpUploadClientService, UserData],
  exports: [FileListComponent, FileSelectComponent],
  entryComponents: [UploadFileModalComponent]
})
export class FileModule {}
