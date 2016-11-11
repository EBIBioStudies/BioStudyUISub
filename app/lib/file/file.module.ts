import {NgModule} from '@angular/core';

import {HttpClientModule} from '../http/http-client.module';
import {SharedModule} from '../shared/shared.module';
import {FileService} from "./file.service";
import {FileUploadService} from "./file-upload.service";
import {FileUploadButtonComponent} from "./file-upload-button.component";

@NgModule({
    imports: [
        HttpClientModule,
        SharedModule
    ],
    exports: [
        FileUploadButtonComponent
    ],
    declarations: [
        FileUploadButtonComponent
    ],
    providers: [
        FileService,
        FileUploadService
    ]
})
export class FileModule {
}