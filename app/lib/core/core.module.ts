import {NgModule}     from '@angular/core';

import {Ng2BootstrapModule} from 'ng2-bootstrap/ng2-bootstrap';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared/shared.module.ts';

import {AuthModule} from '../auth/auth.mdule';

import {AuthGuard} from './auth.guard';

import {AppComponent}     from './app.component';
import {HelpComponent} from './help/help.component';
import {HeaderComponent} from './header/header.component';
import {SignInComponent} from './signin/signin.component';
import {DummyComponent} from './dummy.component';
import {TopContainerComponent} from './top-container.component';
import {CenteredContainerComponent} from './centered-container.component';

import {APP_ROUTES} from './app-routes';


@NgModule({
    imports: [
        Ng2BootstrapModule,
        RouterModule.forRoot(APP_ROUTES),
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
        DummyComponent,
        TopContainerComponent,
        CenteredContainerComponent
    ],
    providers: [
        AuthGuard
    ]
})
export class CoreModule {
}