import '../styles/app.less!';

import {NgModule}       from '@angular/core';
import {BrowserModule}  from '@angular/platform-browser';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppRoutingModule} from './app-routing.module';
import {AppHeaderComponent} from './main/header/header.component';
import {DummyComponent} from './main/dummy.component';

import {AppComponent}     from './app.component';
import {AuthModule} from './auth/auth.mdule';
import {SignInPageComponent} from "./main/signInPage.component";
@NgModule({
    imports: [
        BrowserModule,
        NgbModule,
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
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}