import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule}  from '@angular/platform-browser';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

import {RecaptchaModule} from 'ng2-recaptcha';

import {
    TypeaheadModule,
    TooltipModule,
    TabsModule,
    DropdownModule,
    ModalModule,
    PaginationModule,
    DatepickerModule
} from 'ng2-bootstrap';

import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './core/core.module';
import {HelpModule} from './help/help.module';
import {AuthModule} from './auth/auth.module';
import {SubmissionModule} from './submission/submission.module';
import {FileModule} from './file/file.module';
import {ConfigModule} from './config/config.module';

import {AppComponent} from './app.component';
import {AuthGuard} from './auth.guard';
import {GlobalErrorHandler} from './global-error.handler';


@NgModule({
    imports: [
        BrowserModule,
        RecaptchaModule.forRoot(),
        TypeaheadModule.forRoot(),
        TooltipModule.forRoot(),
        TabsModule.forRoot(),
        DropdownModule.forRoot(),
        ModalModule.forRoot(),
        PaginationModule.forRoot(),
        DatepickerModule.forRoot(),
        AppRoutingModule,
        CoreModule,
        HelpModule,
        AuthModule,
        SubmissionModule,
        FileModule,
        ConfigModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        AuthGuard,
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        {provide: ErrorHandler, useClass: GlobalErrorHandler}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}