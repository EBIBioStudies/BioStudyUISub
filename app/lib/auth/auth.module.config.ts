import {Injectable} from '@angular/core';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';

@Injectable()
export class AuthModuleConfig {
    httpErrorHandler: (error:any) => ErrorObservable;
}