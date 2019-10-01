import {
    ErrorHandler,
    Injectable, NgZone
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { UserSession } from 'app/auth/shared';
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from 'http-status-codes';
import { LogService } from './log/log.service';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
    private errors: Subject<any> = new Subject<any>();

    anErrorDetected$ = this.errors.asObservable();

    constructor(
        private userSession: UserSession,
        private zone: NgZone,
        private logService: LogService
    ) {
        super();
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
            this.errors.next('Something went wrong from our side. Sorry for the inconvenience, we are working on it.');
        }

        this.logService.error('global-error', error);
    }
}
