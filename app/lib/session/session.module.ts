import {NgModule}  from '@angular/core';

import {UserSession} from './user-session';

@NgModule({
    providers: [
        UserSession
    ]
})
export class SessionModule {
}