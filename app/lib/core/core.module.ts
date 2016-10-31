import {NgModule}     from '@angular/core';

import {Ng2BootstrapModule} from 'ng2-bootstrap/ng2-bootstrap';
import {RouterModule} from '@angular/router';

import {RecaptchaModule} from 'ng2-recaptcha';

import {SharedModule} from '../shared/shared.module.ts';

import {AuthModule} from '../auth/auth.mdule';

import {AuthGuard} from './auth.guard';

import {AppComponent}     from './app.component';
import {HelpComponent} from './help/help.component';
import {HeaderComponent} from './header/header.component';
import {SignInComponent} from './signin/signin.component';
import {DummyComponent} from './dummy.component';
import {ContainerRootComponent} from './container-root.component';
import {ContainerMdComponent} from './container-md.component';
import {ORCIDInputBoxComponent} from './orcid-input-box.component';

import {APP_ROUTES} from './app-routes';
import {SignUpComponent} from "./signup/signup.component";

@NgModule({
    imports: [
        Ng2BootstrapModule,
        RouterModule.forRoot(APP_ROUTES),
        RecaptchaModule.forRoot(),
        SharedModule,
        AuthModule
    ],
    exports: [
        AppComponent
    ],
    declarations: [
        HelpComponent,
        AppComponent,
        HeaderComponent,
        SignInComponent,
        SignUpComponent,
        DummyComponent,
        ContainerRootComponent,
        ContainerMdComponent,
        ORCIDInputBoxComponent
    ],
    providers: [
        AuthGuard
    ]
})
export class CoreModule {
}