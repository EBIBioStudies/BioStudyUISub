import {
  NgModule,
  ErrorHandler,
  APP_INITIALIZER
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { RecaptchaModule, RecaptchaSettings, RECAPTCHA_SETTINGS, RECAPTCHA_BASE_URL } from 'ng-recaptcha';
import {
  TypeaheadModule,
  TooltipModule,
  TabsModule,
  BsDropdownModule,
  ModalModule,
  PopoverModule,
  CollapseModule,
  AlertModule,
  BsDatepickerModule
} from 'ngx-bootstrap';
import { MarkdownModule } from 'ngx-markdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SortablejsModule } from 'ngx-sortablejs';
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { GlobalErrorHandler } from './global-error.handler';
import { ThemeModule } from './theme/theme.module';
import { PagesModule } from './pages/pages.module';

export function initConfig(config: AppConfig): () => Promise<any> {
  return () => config.load();
}

@NgModule({
  imports: [
    BrowserModule,
    MarkdownModule.forRoot(),
    RecaptchaModule.forRoot(),
    TypeaheadModule.forRoot(),
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    CollapseModule.forRoot(),
    AlertModule.forRoot(),
    SortablejsModule.forRoot({ animation: 150 }),
    BrowserAnimationsModule,
    PagesModule,
    AppRoutingModule,
    AuthModule,
    ThemeModule,
    CoreModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    AppConfig,
    { provide: APP_INITIALIZER, useFactory: initConfig, deps: [AppConfig], multi: true },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: RECAPTCHA_BASE_URL, useValue: 'https://recaptcha.net/recaptcha/api.js' },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: '6Lc8JN0UAAAAAN4yxc0Ms6qIZ3fml-EYuuD_cTKi', size: 'invisible' } as RecaptchaSettings
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
