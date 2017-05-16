import {Observable} from 'rxjs/Observable';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/observable/throw';

import {Response} from '@angular/http';

export class ServerError {
    constructor(private _status: number,
                private _statusString: string,
                private _data: any) {
    }

    get name(): string {
        const st = this._status ? '[' + this._status + '] ' : '';
        const stStr = this._statusString ? '[' + this._statusString + '] ' : '';
        return "ServerError: " + st + stStr;
    }

    get message(): string {
        return this._data ? (this._data.message || '') : '';
    }

    get data(): any {
        return this._data;
    }

    get status(): number {
        return this._status;
    }

    isDataError(): boolean {
        return this._status === 422 || this._status === 400;
    }

    isUnauthorized(): boolean {
        return this._status === 401;
    }

    isForbidden(): boolean {
        return this._status === 403;
    }

    public static fromResponse(error: Response): ServerError {
        let data = {};
        if (error.json) {
            try {
                data = error.json();
            } catch (e) {
                //console.error("Can't parse error message", e);
            }
        }
        return new ServerError(error.status, error.statusText, data);
    }

    public static dataError(data: any): ServerError {
        return new ServerError(422, 'Unprocessable Entity', data);
    }
}

export function serverErrorHandler(error: Response): ErrorObservable {
    return Observable.throw(ServerError.fromResponse(error));
}
