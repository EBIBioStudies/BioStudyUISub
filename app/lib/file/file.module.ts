import {NgModule} from '@angular/core';
import {AgGridModule} from 'ag-grid-ng2/main';

import {HttpClientModule} from '../http/http-client.module';
import {SharedModule} from '../shared/shared.module';
import {FileService} from './file.service';
import {FileUploadService} from './file-upload.service';
import {FileUploadButtonComponent} from './file-upload-button.component';
import {FileRoutingModule} from './file-routing.module';
import {
    FileListComponent, ProgressCellComponent, FileActionsCellComponent,
    FileTypeCellComponent
} from './file-list.component';

@NgModule({
    imports: [
        HttpClientModule,
        SharedModule,
        FileRoutingModule,
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
        FileUploadButtonComponent
    ],
    providers: [
        FileService,
        FileUploadService
    ]
})
export class FileModule {
}