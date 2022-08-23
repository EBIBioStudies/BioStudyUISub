import { BrowserModule } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { RecaptchaModule } from 'ng-recaptcha';
import { AlertModule } from 'ngx-bootstrap/alert';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { MarkdownModule } from 'ngx-markdown';
import { ToastrModule } from 'ngx-toastr';
import { APP_BASE_HREF } from '@angular/common';
import { ProfileModule } from './../app/profile/profile.module';
import { HelpModule } from './../app/help/help.module';
import { CoreModule } from './../app/core/core.module';
import { ThemeModule } from './../app/theme/theme.module';
import { AuthModule } from './../app/auth/auth.module';
import { AppRoutingModule } from './../app/app-routing.module';
import { FileModule } from './../app/file/file.module';
import { SharedModule } from './../app/shared/shared.module';
import { SubmissionDirectModule } from './../app/submission/submission-direct/submission-direct.module';
import { AppComponent } from '../app/app.component';
import { SubmissionEditModule } from '../app/submission/submission-edit/submission-edit.module';
import { SubmissionListModule } from '../app/submission/submission-list/submission-list.module';
import { AppConfig } from '../app/app.config';

export const renderAppComponent = () =>
  render(AppComponent, {
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
      ToastrModule.forRoot({
        maxOpened: 1,
        positionClass: 'toast-top-left',
        preventDuplicates: true
      }),
      RecaptchaModule,
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
    providers: [AppConfig, { provide: APP_BASE_HREF, useValue: '/' }]
  });
