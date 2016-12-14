import {NgModule}  from '@angular/core';

import {UserSession} from './user-session';
import {UserSessionEvents} from './session.events';

@NgModule({
    providers: [
        UserSession,
        UserSessionEvents
    ]
})
export class SessionModule {
}