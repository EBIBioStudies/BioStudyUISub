import {Observable} from 'rxjs/Observable';
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

    isInputError(): boolean {
        return this._status === 422 || this._status === 400;
    }

    isUnauthorized(): boolean {
        return this._status === 401;
    }

    isForbidden(): boolean {
        return this._status === 403;
    }

    public static create(error: Response) {
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
}

export function serverErrorHandler(error: any) {
    return Observable.throw(ServerError.create(error));
}
