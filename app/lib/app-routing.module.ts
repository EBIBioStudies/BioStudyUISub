import {NgModule}     from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {DummyComponent} from './main/dummy.component';
import {SignInPageComponent} from './main/signInPage.component';

import {AuthGuard} from './auth.guard';

const MAIN_ROUTES: Routes = [
    {path: '', redirectTo: 'submissions', pathMatch: 'full'},
    {path: 'signin', component: SignInPageComponent},
    {path: 'signup', component: DummyComponent},
    {path: 'help', loadChildren: './lib/help/help.module#HelpModule'},
    {path: 'submissions', component: DummyComponent, canActivate: [AuthGuard]},
    {path: 'files', component: DummyComponent, canActivate: [AuthGuard]}
];

@NgModule({
    imports: [
        RouterModule.forRoot(MAIN_ROUTES)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}