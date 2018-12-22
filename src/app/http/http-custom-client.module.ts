import {NgModule} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import {HttpCustomClient} from './http-custom-client.service';
import {RequestStatusService, RequestStatusServiceFactory} from './request-status.service';
import {AuthInterceptorService} from './auth-interceptor.service';
import {TestBackendInterceptor} from './test-backend-interceptor.service';

@NgModule({
    imports: [
        HttpClientModule
    ],
    exports: [
        HttpClientModule
    ],
    providers: [
        HttpCustomClient,
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
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TestBackendInterceptor,
            multi: true
        }
    ]
})
export class HttpCustomClientModule {
}
