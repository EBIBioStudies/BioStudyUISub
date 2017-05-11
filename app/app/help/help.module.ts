import {NgModule}  from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {HelpComponent} from './help.component';
import {HelpRoutingModule} from './help-routing.module';

@NgModule({
    imports: [
        SharedModule,
        HelpRoutingModule
    ],
    declarations: [
        HelpComponent
    ],
    exports: [
    ],
    providers: [
    ]
})
export class HelpModule {
}