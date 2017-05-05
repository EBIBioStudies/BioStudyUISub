import {Injectable} from '@angular/core';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';

@Injectable()
export class SubmissionModuleConfig {
    httpErrorHandler: (error:any) => ErrorObservable;
}