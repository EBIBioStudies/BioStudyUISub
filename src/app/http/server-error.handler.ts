import {Observable} from 'rxjs/Observable';
import {HttpErrorResponse} from "@angular/common/http";


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
        return (this.data ? this.data.message : undefined) || this.name;
    }

    get isDataError(): boolean {
        return this.status === 422 || this.status === 400;
    }

    public static fromResponse(error: HttpErrorResponse): ServerError {
        let data = {};
        if (error.error.message) {
            try {
                data['message'] = error.error.message;
            } catch (e) {
                console.error("Unknown error type", e);
            }
        }
        return new ServerError(error.status, error.statusText, data);
    }

    public static dataError(data: any): ServerError {
        return new ServerError(422, 'Unprocessable Entity', data);
    }
}

export function serverErrorHandler(error: HttpErrorResponse): Observable<any> {
    throw ServerError.fromResponse(error);
}
