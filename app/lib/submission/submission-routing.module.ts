import {NgModule}             from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SubmissionListComponent} from './subm-list.component';
import {SubmissionEditComponent} from './subm-edit.component';
import {SubmissionViewComponent} from './subm-view.component';

const submRoutes: Routes = [
    {path: 'submissions', component: SubmissionListComponent},
    {path: 'edit/:accno', component: SubmissionEditComponent},
    {path: 'view/:accno', component: SubmissionViewComponent}
];

@NgModule({
    imports: [
        RouterModule.forChild(submRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
    ]
})
export class SubmissionRoutingModule {
}