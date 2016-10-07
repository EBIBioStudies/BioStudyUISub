import {NgModule}     from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HelpPageComponent} from "./helpPage.component";

const HELP_ROUTES: Routes = [
    {path: '', component: HelpPageComponent},
];

@NgModule({
    imports: [
        RouterModule.forChild(HELP_ROUTES)
    ],
    declarations: [
        HelpPageComponent
    ],
    exports: [
        RouterModule
    ]
})
export class HelpModule {
}