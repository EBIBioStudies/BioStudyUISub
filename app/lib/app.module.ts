import '../styles/app.less!';

import {NgModule}       from '@angular/core';
import {BrowserModule}  from '@angular/platform-browser';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppRoutingModule} from './app-routing.module';
import {AppHeaderComponent} from './main/header/header.component';
import {DummyComponent} from './main/dummy.component';

import {AppComponent}     from './app.component';

@NgModule({
    imports: [
        BrowserModule,
        NgbModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        AppHeaderComponent,
        DummyComponent
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}