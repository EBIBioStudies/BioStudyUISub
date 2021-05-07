import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NOT_FOUND, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { ServerError } from 'app/shared/server-error.handler';
import { ErrorMessageService } from './error-message.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor(private errorMessageService: ErrorMessageService) {}

  getClientErrorMessage(error: Error): string {
    return error.message ? error.message : error.toString();
  }

  getServerErrorMessage(resp: HttpErrorResponse, isFileUpload: boolean = false): string {
    if (resp.status === INTERNAL_SERVER_ERROR && isFileUpload) {
      return ServerError.defaultUploadErrorMessage;
    }

    if (resp.status === INTERNAL_SERVER_ERROR) {
      return ServerError.defaultErrorMessage;
    }

    const errorMessage = resp?.error?.log?.message || this.errorMessageService.getMessage();

    return navigator.onLine ? errorMessage : 'Looks like there is no internet connection';
  }

  isNotFoundError(resp: HttpErrorResponse): boolean {
    return resp.status === NOT_FOUND;
  }
}
