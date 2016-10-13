import '../styles/app.less!';

import {NgModule}       from '@angular/core';
import {BrowserModule}  from '@angular/platform-browser';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

import {Ng2BootstrapModule} from 'ng2-bootstrap/ng2-bootstrap';

import {AppRoutingModule} from './app-routing.module';
import {AppHeaderComponent} from './main/header/header.component';
import {DummyComponent} from './main/dummy.component';

import {AppComponent}     from './app.component';
import {AuthModule} from './auth/auth.mdule';
import {SignInPageComponent} from './main/signInPage.component';
import {AuthGuard} from './auth.guard';

@NgModule({
    imports: [
        BrowserModule,
        Ng2BootstrapModule,
        AppRoutingModule,
        AuthModule
    ],
    declarations: [
        AppComponent,
        AppHeaderComponent,
        DummyComponent,
        SignInPageComponent
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        AuthGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}