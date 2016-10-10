import {NgModule}  from '@angular/core';

import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';

import {SignInFormComponent} from './signin/signinForm.component'


@NgModule({
    imports: [
        HttpModule,
        JsonpModule,
        FormsModule
    ],
    declarations: [
        SignInFormComponent
    ],
})
export class AuthModule {
}