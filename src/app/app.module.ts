import {
    NgModule,
    ErrorHandler,
    APP_INITIALIZER
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF, PathLocationStrategy, LocationStrategy } from '@angular/common';
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
import { AppRoutingModule } from './app-routing.module';
import { HelpModule } from './help/help.module';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { AppComponent } from './app.component';
import { GlobalErrorHandler } from './global-error.handler';
import { AppConfig } from './app.config';
import { HeaderModule } from './header/header.module';
import { SubmissionDirectModule } from './submission/submission-direct/submission-direct.module';
import { SubmissionEditModule } from './submission/submission-edit/submission-edit.module';
import { SubmissionListModule } from './submission/submission-list/submission-list.module';

export function initConfig(config: AppConfig): () => Promise<any> {
    return () => config.load();
}

@NgModule({
    imports: [
        BrowserModule,
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
        HeaderModule,
        HelpModule,
        AuthModule,
        SubmissionListModule,
        SubmissionEditModule,
        SubmissionDirectModule,
        FileModule
        // AgGridModule.withComponents([])
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        AppConfig,
        {provide: APP_INITIALIZER, useFactory: initConfig, deps: [AppConfig], multi: true},
        {provide: LocationStrategy, useClass: PathLocationStrategy},
        {provide: ErrorHandler, useClass: GlobalErrorHandler},
        { provide: APP_BASE_HREF, useValue: '/' }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
