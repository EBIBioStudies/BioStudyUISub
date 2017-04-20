import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/throw';


export class ServiceError {
    constructor(private __status: number,
                private __statusString: string,
                private __data: any) {
    }

    get name(): string {
        const st = this.__status ? '[' + this.__status + '] ' : '';
        const stStr = this.__statusString ? '[' + this.__statusString + '] ' : '';
        return "Error: " + st + stStr;
    }

    get message(): string {
        const b = this.__data ? (this.__data.message || '') : '';
        return b;
    }

    get data(): any {
        return this.__data;
    }

    get status(): number {
        return this.__status;
    }

    isInputError(): boolean {
        return this.__status === 422 || this.__status === 400;
    }
}

@Injectable()
export class SharedService {

    public static errorHandler(error: any) {
        if (error.status && error.statusText) {
            let status = error.status;
            let statusText = error.statusText;
            let data = error.data || {};
            if (error.json) {
                try {
                    data = error.json();
                } catch (e) {
                    console.error("Can't parse error message", e);
                }
            }
            return Observable.throw(new ServiceError(status, statusText, data));
        }
        return Observable.throw(error);
    }
}