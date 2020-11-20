import {
  ErrorHandler,
  Injectable,
  Injector,
  NgZone
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from 'http-status-codes';
import { ToastrService } from 'ngx-toastr';
import { UserSession } from 'app/auth/shared';
import { ErrorMessageService } from './error-message.service';

@Injectable()
export class GlobalErrorService extends ErrorHandler {
  private errors: Subject<any> = new Subject<any>();

  constructor(
    private userSession: UserSession,
    private zone: NgZone,
    private injector: Injector,
    private errorMessage: ErrorMessageService
  ) {
    super();
  }

  get errorDetected(): Observable<any> {
    return this.errors.asObservable();
  }

  private get toastr(): ToastrService {
    return this.injector.get(ToastrService);
  }

  private showErrorToast(): void {
    const message = this.errorMessage.getMessage();

    this.toastr.error(message, '', {
      closeButton: true,
      timeOut: 7000,
      enableHtml: true,
      tapToDismiss: false
    });
  }

  handleError(error): void {
    // Invalid authentication credentials, probably due to the current session having expired => clean up and reload.
    if (error.status === UNAUTHORIZED) {
      this.userSession.destroy();
      this.zone.runOutsideAngular(() => location.reload());
    }

    if (error.status === INTERNAL_SERVER_ERROR) {
      // An error occurred that may potentially be worth handling at a global level.
      this.showErrorToast();
    } else {
      // tslint:disable-next-line: no-console
      console.error(error);
      this.showErrorToast();
    }
  }
}
