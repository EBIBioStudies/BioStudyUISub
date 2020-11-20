import { ErrorHandler, NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LogService } from './logger/log.service';
import { RequestStatusInterceptorService, RequestStatusServiceFactory } from './interceptors/request-status-interceptor.service';
import { AuthInterceptorService } from './interceptors/auth-interceptor.service';
import { ContextPathInterceptorService } from './interceptors/context-path-interceptor.service';
import { GlobalErrorService } from './errors/global-error.service';
import { ErrorMessageService } from './errors/error-message.service';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    LogService,
    ErrorMessageService,
    {
      provide: RequestStatusInterceptorService,
      useFactory: RequestStatusServiceFactory
    },
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: RequestStatusInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: ContextPathInterceptorService,
      multi: true
    },
    { provide: ErrorHandler, useClass: GlobalErrorService },
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(`CoreModule has already been loaded. Import Core modules in the AppModule only.`);
    }
  }
}
