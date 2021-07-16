import { Injectable } from '@angular/core';

@Injectable()
export class ErrorMessageService {
  private defaultMessage: string = `Something went wrong at our side, sorry for the inconvenience.
    Please try again later and if the problem persists drop an email to`;

  private sessionExpired: string = 'Your session has expired. Please login again to continue working.';

  getMessage(stack: string = ''): string {
    return this.buildErrorMessage(false, stack);
  }

  getPlainMessage(): string {
    return this.buildErrorMessage(true);
  }

  getSessionExpiredMessage(): string {
    return this.sessionExpired;
  }

  private buildErrorMessage(plain: boolean = false, stack: string = ''): string {
    if (plain) {
      return `${this.defaultMessage} biostudies@ebi.ac.uk`;
    } else {
      return `${this.defaultMessage} <a href="mailto:biostudies@ebi.ac.uk?subject=Submission Tool error&body=%0D%0A${stack}">biostudies@ebi.ac.uk</a>`;
    }
  }
}
