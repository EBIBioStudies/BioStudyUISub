import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NOT_FOUND, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { ServerError } from 'app/shared/server-error.handler';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
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

    return navigator.onLine ? resp?.error?.log?.message : 'Looks like there is no internet connection';
  }

  isNotFoundError(resp: HttpErrorResponse): boolean {
    return resp.status === NOT_FOUND;
  }
}
