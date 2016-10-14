import '../styles/app.less!';

import {NgModule}       from '@angular/core';
import {BrowserModule}  from '@angular/platform-browser';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

import {CoreModule} from './core/core.module';

import {AppComponent} from './core/app.component';

@NgModule({
    imports: [
        BrowserModule,
        CoreModule
    ],
    declarations: [
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}