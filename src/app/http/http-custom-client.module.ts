import {NgModule}  from '@angular/core';
import {
    HttpClientModule,
    HTTP_INTERCEPTORS
} from "@angular/common/http";

import {HttpCustomClient} from './http-custom-client.service';
import {UploadService} from './upload.service';
import {
    RequestStatusService, RequestStatusServiceFactory
} from "./request-status.service";

//NOTE: required if the same service instance is to be shared across all the app.
//Otherwise, a "No provider for..." exception is thrown if a conventional "useClass" entry is added.
const RequestStatusServiceFactoryProvider = {
    provide: RequestStatusService,
    useFactory: RequestStatusServiceFactory
};
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
