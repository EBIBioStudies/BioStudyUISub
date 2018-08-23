import {NgModule} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import {HttpCustomClient} from './http-custom-client.service';
import {UploadService} from './upload.service';
import {RequestStatusService, RequestStatusServiceFactory} from './request-status.service';
import {AuthInterceptorService} from './auth-interceptor.service';

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
        {
            provide: RequestStatusService,
            useFactory: RequestStatusServiceFactory
        },
        {
            provide: HTTP_INTERCEPTORS,
            useExisting: RequestStatusService,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true
        }
    ]
})
export class HttpCustomClientModule {
}
