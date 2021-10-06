import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LogService } from 'app/core/logger/log.service';
import { ErrorService } from './error.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class GlobalErrorService extends ErrorHandler {
  constructor(private injector: Injector) {
    super();
  }

  handleError(error: Error): void {
    const errorService = this.injector.get(ErrorService);
    const logger = this.injector.get(LogService);
    const notifier = this.injector.get(NotificationService);

    let message;
    if (error instanceof HttpErrorResponse) {
      message = errorService.getServerErrorMessage(error);
      logger.error(message, `${error.status} - ${error.url} - ${error.message}`);
      notifier.showError(message);
    } else {
      message = errorService.getClientErrorMessage(error);
      logger.error(message, error.stack);
      notifier.showError(message);
    }

    console.error(error);
  }
}
