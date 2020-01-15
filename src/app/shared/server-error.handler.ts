import * as HttpStatus from 'http-status-codes';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';

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
  static fromResponse(error: HttpErrorResponse): ServerError {
    const data = {
      message: 'Unknown error type', // Default error message
      error: error.error // Original error object coming from the server
    };

    if (error.error && error.error.message) {
      data.message = error.error.message;
    } else if (error.message) {
      data.message = error.message;
    }

    return new ServerError(error.status, error.statusText, data);
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
