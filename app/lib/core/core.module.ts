import {NgModule, ErrorHandler}     from '@angular/core';

import {
    TypeaheadModule,
    TooltipModule,
    TabsModule,
    DropdownModule,
    ModalModule,
    PaginationModule
} from 'ng2-bootstrap';

import {RouterModule} from '@angular/router';
import {RecaptchaModule} from 'ng2-recaptcha';

import {HttpClientModule} from '../http/http-client.module';

import {SharedModule} from '../shared/shared.module';

import {HelpModule} from '../help/help.module';
import {AuthModule} from '../auth/auth.module';
import {SubmissionModule} from '../submission/submission.module';
import {FileModule} from '../file/file.module';
import {ConfigModule} from '../config/config.module';

import {AuthGuard} from './auth.guard';
import {GlobalErrorHandler} from './global.error.handler';

import {AppComponent}     from './app.component';
import {HeaderComponent} from './header/header.component';
import {SignInComponent} from './signin/signin.component';
import {ActivateComponent} from './activate/activate.component';
import {ResendActivationLinkComponent} from './activate/resend-activation-link.component';
import {PasswordResetReqComponent} from './password-reset/password-reset-req.component';
import {PasswordResetComponent} from './password-reset/password-reset.component';


import {APP_ROUTES} from './app-routes';
import {SignUpComponent} from './signup/signup.component';
import {Equals2} from './password-reset/equals2.directive';


@NgModule({
    imports: [
        RouterModule.forRoot(APP_ROUTES),
        RecaptchaModule.forRoot(),
        TypeaheadModule.forRoot(),
        TooltipModule.forRoot(),
        TabsModule.forRoot(),
        DropdownModule.forRoot(),
        ModalModule.forRoot(),
        PaginationModule.forRoot(),
        HttpClientModule,
        SharedModule,
        HelpModule,
        AuthModule,
        SubmissionModule,
        FileModule,
        ConfigModule
    ],
    exports: [
        AppComponent
    ],
    declarations: [
        AppComponent,
        HeaderComponent,
        SignInComponent,
        SignUpComponent,
        ActivateComponent,
        ResendActivationLinkComponent,
        PasswordResetReqComponent,
        PasswordResetComponent,
        Equals2
    ],
    providers: [
        AuthGuard,
        {provide: ErrorHandler, useClass: GlobalErrorHandler}
    ]
})
export class CoreModule {
}