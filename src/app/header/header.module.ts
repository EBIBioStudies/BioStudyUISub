import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';

import {SharedModule} from 'app/shared/shared.module';

import {AppHeaderComponent} from './app-header/app-header.component';
import {GlobalErrorComponent} from './global-error/global-error.component';

@NgModule({
    imports: [
        RouterModule,
        SharedModule
    ],
    exports: [
        AppHeaderComponent
    ],
    declarations: [
        AppHeaderComponent,
        GlobalErrorComponent
    ]
})
export class HeaderModule {
}