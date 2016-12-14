import {Inject, ErrorHandler}  from '@angular/core';

import {UserSession} from '../session/user-session';


export class GlobalErrorHandler implements ErrorHandler {

    constructor(@Inject(UserSession) private userSession: UserSession) {
    }

    handleError(error) {
        if (error.status === 401) {//Unauthorized
            this.userSession.destroy();
        } else {
            super.handleError(error);
        }
    }
}