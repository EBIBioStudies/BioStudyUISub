import {Inject, ErrorHandler}  from '@angular/core';

import {UserSession} from './auth/user-session';


export class GlobalErrorHandler implements ErrorHandler {

    constructor(@Inject(UserSession) private userSession: UserSession) {
    }

    handleError(error) {
        if (error.status === 401) {//Unauthorized
            this.userSession.destroy();
        } else {
            console.error(error);
        }
    }
}