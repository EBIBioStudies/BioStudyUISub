import {Inject, ErrorHandler}  from '@angular/core';
import {Subject} from 'rxjs/Subject';

import {UserSession} from './auth/user-session';


export class GlobalErrorHandler implements ErrorHandler {

    private errors: Subject<any> = new Subject<any>();

    anErrorDetected$ = this.errors.asObservable();

    constructor(@Inject(UserSession) private userSession: UserSession) {
    }

    handleError(error) {
        if (error.status === 401) {//Unauthorized
            this.userSession.destroy();
        } else {
            console.error(error);
            this.errors.next(error);
        }
    }
}