import {Observable} from 'rxjs/Observable';
import {Response} from '@angular/http';

export class ServerError {

    constructor(public status: number,
                public statusString: string,
                public data: any) {
    }

    get name(): string {
        const st = this.status ? '[' + this.status + '] ' : '';
        const stStr = this.statusString ? '[' + this.statusString + '] ' : '';
        return "ServerError: " + st + stStr;
    }

    get message(): string {
        return this.data ? (this.data.message || '') : '';
    }

    get isDataError(): boolean {
        return this.status === 422 || this.status === 400;
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

export function serverErrorHandler(error: Response): Observable<any> {
    throw ServerError.fromResponse(error);
}
