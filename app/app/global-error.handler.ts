import {ErrorHandler, Injectable}  from '@angular/core';
import {Subject} from 'rxjs/Subject';

import {UserSession} from './auth/index';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {

    private errors: Subject<any> = new Subject<any>();

    anErrorDetected$ = this.errors.asObservable();

    constructor(private userSession: UserSession) {
        super(true);
    }

    handleError(error) {
        console.log('global error', error);
        if (error.status === 401) {//Unauthorized
            this.userSession.destroy();
        } else {
            console.error(error);
            this.errors.next(error);
        }
    }
}