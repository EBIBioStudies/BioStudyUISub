import {
    ErrorHandler,
    Injectable, NgZone
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { UserSession } from 'app/auth/shared';
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from 'http-status-codes';
import { LogService } from './core/logger/log.service';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
    private errors: Subject<any> = new Subject<any>();

    constructor(private userSession: UserSession, private zone: NgZone, private logService: LogService) {
        super();
    }

    get errorDetected() {
        return this.errors.asObservable();
    }

    handleError(error) {
        // Invalid authentication credentials, probably due to the current session having expired => clean up and reload.
        // NOTE: the app seems to get into a limbo state whereby the digest cycle fails to detect property changes
        // any more and requests are not issued. Reloading is a workaround.
        // TODO: why is this happening?
        if (error.status === UNAUTHORIZED) {
            this.userSession.destroy();
            this.zone.runOutsideAngular(() => location.reload());
        }

        if (error.status === INTERNAL_SERVER_ERROR) {
            // An error occurred that may potentially be worth handling at a global level.

            this.errors.next(
                `Something went wrong at our side. Sorry for the inconvenience,
                we are working to fix it. Please try again later and if the problem persists,
                drop an email to <a href="mailto:biostudies@ebi.ac.uk">biostudies@ebi.ac.uk</a>`
            );
        } else {
            // TODO: post error to new logging system.
            // tslint:disable-next-line: no-console
            console.error(error);

            this.errors.next(error);
        }

        this.logService.error('global-error', error);
    }
}
