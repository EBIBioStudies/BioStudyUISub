import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {UIRouterModule} from "ui-router-ng2";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


import {APP_STATES} from './app.states.ts!ts'
import {AppHeaderComponent} from './nav/header/header.component.ts!ts'
import {DummyComponent} from './nav/dummy.component.ts!ts';
import {AppComponent} from './app.component.ts!ts';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';


//TODO HashLocationStrategy

@NgModule({
    imports: [
        BrowserModule,
        NgbModule,
        UIRouterModule.forRoot({
            states: APP_STATES,
            otherwise: { state: 'help', params: {} },
            useHash: true
            /*
             configClass: MyRootUIRouterConfig
             */
        })
    ],
    declarations: [
        AppComponent,
        AppHeaderComponent,
        DummyComponent
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
})
export class AppModule {
}