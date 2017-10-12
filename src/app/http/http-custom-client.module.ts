import {NgModule}  from '@angular/core';
import {
    HttpClientModule,
    HTTP_INTERCEPTORS
} from "@angular/common/http";

import {HttpCustomClient} from './http-custom-client.service';
import {UploadService} from './upload.service';
import {RequestStatusService, RequestStatusServiceFactoryProvider} from "./request-status.service";


const RequestStatusServiceExistingProvider = {
    provide: HTTP_INTERCEPTORS,
    useExisting: RequestStatusService,
    multi: true
};

@NgModule({
    imports: [
        HttpClientModule
    ],
    exports: [
        HttpClientModule
    ],
    providers: [
        HttpCustomClient,
        UploadService,
        RequestStatusServiceExistingProvider,
        RequestStatusServiceFactoryProvider
    ]
})
export class HttpCustomClientModule {
}
