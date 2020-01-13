import {
    NgModule,
    ErrorHandler,
    APP_INITIALIZER
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { RecaptchaModule } from 'ng-recaptcha';
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
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { FileModule } from './file/file.module';
import { GlobalErrorHandler } from './global-error.handler';
import { HelpModule } from './help/help.module';
import { SubmissionDirectModule } from './submission/submission-direct/submission-direct.module';
import { SubmissionEditModule } from './submission/submission-edit/submission-edit.module';
import { SubmissionListModule } from './submission/submission-list/submission-list.module';
import { ThemeModule } from './theme/theme.module';

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
        AppRoutingModule,
        AuthModule,
        FileModule,
        HelpModule,
        SubmissionDirectModule,
        SubmissionEditModule,
        SubmissionListModule,
        ThemeModule,
        CoreModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        AppConfig,
        {provide: APP_INITIALIZER, useFactory: initConfig, deps: [AppConfig], multi: true},
        {provide: LocationStrategy, useClass: PathLocationStrategy},
        {provide: ErrorHandler, useClass: GlobalErrorHandler}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
