import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared/shared.module';

import {HeaderComponent} from './header/header.component';
import {GlobalErrorComponent} from './header/global-error.component';

@NgModule({
    imports: [
        RouterModule,
        SharedModule
    ],
    exports: [
        HeaderComponent
    ],
    declarations: [
        HeaderComponent,
        GlobalErrorComponent
    ]
})
export class CoreModule {
}