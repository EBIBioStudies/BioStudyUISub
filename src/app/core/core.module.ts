import { ErrorHandler, NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {
  RequestStatusInterceptorService,
  RequestStatusServiceFactory
} from './interceptors/request-status-interceptor.service';
import { AuthInterceptorService } from './interceptors/auth-interceptor.service';
import { ContextPathInterceptorService } from './interceptors/context-path-interceptor.service';
import { ServerErrorInterceptor } from './interceptors/server-error.interceptor';
import { GlobalErrorService } from './errors/global-error.service';
import { ErrorMessageService } from './errors/error-message.service';
import { NotificationService } from './notification/notification.service';
import { ErrorService } from './errors/error.service';
import { LogService } from './logger/log.service';
import { DateFormatDirective } from './directives/date-format.directive';
import { PluralPipe } from './pipes/plural.pipe';
import { StripHtmlPipe } from './pipes/strip-html.pipe';
import { ValidateOnBlurDirective } from './directives/validate-onblur.directive';
import { NotFoundComponent } from './components/error/not-found.component';
import { ForbiddenComponent } from './components/error/forbidden.component';
import { ErrorComponent } from './components/error/error.component';

@NgModule({
  imports: [HttpClientModule, RouterModule],
  declarations: [
    DateFormatDirective,
    ValidateOnBlurDirective,
    StripHtmlPipe,
    PluralPipe,
    NotFoundComponent,
    ErrorComponent,
    ForbiddenComponent
  ],
  exports: [
    DateFormatDirective,
    ValidateOnBlurDirective,
    StripHtmlPipe,
    PluralPipe,
    NotFoundComponent,
    ErrorComponent,
    ForbiddenComponent
  ],
  providers: [
    ErrorMessageService,
    NotificationService,
    ErrorService,
    LogService,
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
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ContextPathInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorInterceptor,
      multi: true
    },
    { provide: ErrorHandler, useClass: GlobalErrorService }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(`CoreModule has already been loaded. Import Core modules in the AppModule only.`);
    }
  }
}
