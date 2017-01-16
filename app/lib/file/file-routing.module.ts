import {NgModule}             from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {FileListComponent} from './file-list.component';

const fileRoutes: Routes = [
    {path: 'files', component: FileListComponent}
];

@NgModule({
    imports: [
        RouterModule.forChild(fileRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
    ]
})
export class FileRoutingModule {
}