import { Injectable } from '@angular/core';

@Injectable()
export class ErrorMessageService {
  private defaultMessage: string = `Something went wrong at our side, sorry for the inconvenience.
    Please try again later and if the problem persists drop an email to`;

  getMessage(): string {
    return this.buildErrorMessage();
  }

  getPlainMessage(): string {
    return this.buildErrorMessage('', true);
  }

  getMessageWithMailBody(errorMessage): string {
    return this.buildErrorMessage(errorMessage);
  }

  private buildErrorMessage(errorMessage?: string, plain: boolean = false): string {
    if (errorMessage) {
      return`${this.defaultMessage} <a href="mailto:biostudies@ebi.ac.uk?subject=Submission Tool error&body=${errorMessage}">biostudies@ebi.ac.uk</a>`;
    } else if (plain) {
      return`${this.defaultMessage} biostudies@ebi.ac.uk`;
    } else {
      return`${this.defaultMessage} <a href="mailto:biostudies@ebi.ac.uk?subject=Submission Tool error>biostudies@ebi.ac.uk</a>`;
    }
  }
}
