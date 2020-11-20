import { Injectable } from '@angular/core';

@Injectable()
export class ErrorMessageService {
  private defaultMessage: string = `Something went wrong at our side, sorry for the inconvenience.
    Please try again later and if the problem persists drop an email to`;

  getMessage(): string {
    return this.buildErrorMessage();
  }

  getPlainMessage(): string {
    return this.buildErrorMessage(true);
  }

  private buildErrorMessage(plain: boolean = false): string {
    if (plain) {
      return`${this.defaultMessage} biostudies@ebi.ac.uk`;
    } else {
      return`${this.defaultMessage} <a href="mailto:biostudies@ebi.ac.uk?subject=Submission Tool error">biostudies@ebi.ac.uk</a>`;
    }
  }
}
