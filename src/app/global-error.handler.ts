import {
    ErrorHandler,
    Injectable, NgZone
} from '@angular/core';

import {Subject} from 'rxjs/Subject';

import {UserSession} from './auth/index';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {

    private errors: Subject<any> = new Subject<any>();

    anErrorDetected$ = this.errors.asObservable();

    constructor(private userSession: UserSession, private zone: NgZone) {
        super();
    }

    handleError(error) {

        //Invalid authentication credentials, probably due to the current session having expired => clean up and reload.
        //NOTE: the app seems to get into a limbo state whereby the digest cycle fails to detect property changes
        //any more and requests are not issued. Reloading is a workaround.
        //TODO: why is this happening?
        if (error.status === 401) {
            this.userSession.destroy();
            this.zone.runOutsideAngular(() => {
                location.reload();
            });

        //An error occurred that may potentially be worth handling at a global level.
        } else {
            console.error(error);
            this.errors.next(error);
        }
    }
}