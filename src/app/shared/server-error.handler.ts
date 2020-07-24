import * as HttpStatus from 'http-status-codes';
import { throwError, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { DEFAULT_ERROR_MESSAGE } from 'app/app.constants';

export class ServerError {
  data: any;
  status: number = 0;
  statusString: string = '';

  constructor(status: number, statusString: string, data: any) {
    this.status = status;
    this.statusString = statusString;
    this.data = data;
  }

  static dataError(data: any): ServerError {
    return new ServerError(HttpStatus.UNPROCESSABLE_ENTITY, 'Unprocessable Entity', data);
  }

  /**
   * Factory-like method to turn the standard error object coming from the HTTP client to
   * the app's custom error object.
   * @param {HttpErrorResponse} error Error object as it comes from the HTTP client
   * @returns {ServerError} Converted error object
   */
  static fromResponse(response: HttpErrorResponse): ServerError {
    const { error } = response;
    const data = {
      message: DEFAULT_ERROR_MESSAGE,
      error: {}
    };

    if (error && error.log) {
      data.message = error.log.message;
      data.error = error.log;
    }

    return new ServerError(response.status, error.status, data);
  }

  get name(): string {
    const st = this.status ? '[' + this.status + '] ' : '';
    const stStr = this.statusString ? '[' + this.statusString + '] ' : '';

    return 'ServerError: ' + st + stStr;
  }

  get message(): string {
    return (this.data ? this.data.message : undefined) || this.name;
  }

  /**
   * Checks if the server error is due to correctly formatted data (for the API) yet invalid (for the database).
   * For example, the data is was sent as a JSON object as expected but it's an invalid submission.
   * @returns {boolean} True for invalid data.
   */
  get isDataError(): boolean {
    return this.status === 422 || this.status === 400;
  }
}

// TODO: come up with a generalised logic for human-readable error messages based on the info available from HttpErrorResponse.
// TODO: the global handler should be manually called up. (globalHandler.handleError(ServerError.fromResponse(error));)
export function serverErrorHandler(error: HttpErrorResponse): Observable<any> {
  return throwError(ServerError.fromResponse(error));
}
