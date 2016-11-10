import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class ProgressService {
    downloadProgress: Subject<any> = new Subject();
    uploadProgress: Subject<any> = new Subject();


    constructor() {
        console.log("ProgressService: new instance");
    }
}