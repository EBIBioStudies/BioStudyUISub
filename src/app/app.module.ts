import {
    NgModule,
    ErrorHandler,
    APP_INITIALIZER
} from '@angular/core';

import {BrowserModule} from '@angular/platform-browser';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

import {RecaptchaModule} from 'ng-recaptcha';

import {
    TypeaheadModule,
    TooltipModule,
    TabsModule,
    BsDropdownModule,
    ModalModule,
    PopoverModule,
    CollapseModule,
    AlertModule
} from 'ngx-bootstrap';

import {AppRoutingModule} from './app-routing.module';
import {HelpModule} from './help/help.module';
import {AuthModule} from './auth/auth.module';
import {FileModule} from './file/file.module';
import {SubmissionModule} from './submission/submission.module';

import {AppComponent} from './app.component';
import {GlobalErrorHandler} from './global-error.handler';
import {AppConfig} from './app.config';
import {HeaderModule} from './header/header.module';

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
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        CollapseModule.forRoot(),
        AlertModule.forRoot(),
        AppRoutingModule,
        HeaderModule,
        HelpModule,
        AuthModule,
        SubmissionModule,
        FileModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        AppConfig,
        {provide: APP_INITIALIZER, useFactory: initConfig, deps: [AppConfig], multi: true},
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        {provide: ErrorHandler, useClass: GlobalErrorHandler}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}