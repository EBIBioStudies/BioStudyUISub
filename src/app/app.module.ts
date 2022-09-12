import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { RecaptchaModule, RecaptchaSettings, RECAPTCHA_SETTINGS, RECAPTCHA_BASE_URL } from 'ng-recaptcha';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MarkdownModule } from 'ngx-markdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SortablejsModule } from 'ngx-sortablejs';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { ThemeModule } from './theme/theme.module';
import { SubmissionDirectModule } from './submission/submission-direct/submission-direct.module';
import { SubmissionEditModule } from './submission/submission-edit/submission-edit.module';
import { SubmissionListModule } from './submission/submission-list/submission-list.module';
import { FileModule } from './file/file.module';
import { SharedModule } from 'app/shared/shared.module';
import { ProfileModule } from './profile/profile.module';
import { HelpModule } from './help/help.module';

export function initConfig(config: AppConfig): () => Promise<any> {
  return () => config.load();
}

function initRecaptchaSettings(config: AppConfig): RecaptchaSettings {
  return { siteKey: config.recaptchaPublicKey, size: 'invisible' };
}

@NgModule({
  imports: [
    BrowserModule,
    MarkdownModule.forRoot(),
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
    ToastrModule.forRoot({
      maxOpened: 1,
      positionClass: 'toast-top-left',
      preventDuplicates: true
    }),
    RecaptchaModule,
    BrowserAnimationsModule,
    SubmissionDirectModule,
    SubmissionEditModule,
    SubmissionListModule,
    SharedModule,
    FileModule,
    AppRoutingModule,
    AuthModule,
    ThemeModule,
    CoreModule,
    HelpModule,
    ProfileModule
  ],
  declarations: [AppComponent],
  providers: [
    AppConfig,
    { provide: APP_INITIALIZER, useFactory: initConfig, deps: [AppConfig], multi: true },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: RECAPTCHA_BASE_URL, useValue: 'https://recaptcha.net/recaptcha/api.js' },
    { provide: RECAPTCHA_SETTINGS, useFactory: initRecaptchaSettings, deps: [AppConfig] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
