import {Injectable} from '@angular/core';

import {HttpCustomClient} from '../http/http-custom-client.service'
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import * as _ from 'lodash';
import {Subscription} from "rxjs/Subscription";
import {Subject} from "rxjs/Rx";

@Injectable()
export class FileService {
    subscriptions: Subscription[] = [];

    private cache: any = null;
    private _whenFetched: Subject<any> = null;

    constructor(private http: HttpCustomClient) {}

    /**
     * Creates an observable normalised to resolve instantly if the list of files has already been retrieved.
     * @returns {Observable<any>} Observable from subject.
     */
    get whenFetched(): Observable<any> {
        if (this.cache) {
            return Observable.of(this.cache);
        } else {
            return this._whenFetched.asObservable();
        }
    }

    getUserDirs(): Observable<any> {
        return this.getFiles('/Groups', 1, false)
            .map(data => data.files)
            .map(files => _.map(files, (f) => ({name: f.name, path: '/Groups/' + f.name})))
            .map(files => [].concat([{name: 'Home', path: '/User'}], files))
    }

    /**
     * Retrieves the attributes for all files under a certain path and with a specific level of folder nesting.
     * The request can be cached, avoiding any subsequent ones unless the cache has been explicitly flushed.
     * @param {string} path - Path which the files live under.
     * @param {number} depth - Upper limit for the number of nested folders.
     * @param {boolean} showArchive - If true, it includes compressed files.
     * @param {boolean} isCached - If true, subsequent requests will draw on the cache for responses.
     * @returns {Observable<any>} Observable the request has been turned into.
     */
    getFiles(path: string = '/', depth: number = 1, showArchive: boolean = true, isCached: boolean = false): Observable<any> {
        const url = `/api/files?showArchive=${showArchive}&depth=${depth}&path=${path}`;

        //Cached mode => First request for cached list of files
        if (isCached) {
            if (!this._whenFetched) {
                this.http.get(url).subscribe(response => {
                    this.cache = response;
                    this._whenFetched.next(response);
                    this._whenFetched.complete();
                });
                this._whenFetched = new Subject<any>();
                return this.whenFetched;

            //Cached mode after first request => Subsequent calls are prevented from making more requests
            } else {
                return this.whenFetched;
            }

        //Non-cached mode => issues an additional request as normal
        } else {
            return this.http.get(url);
        }
    }

    flushCache() {
        this._whenFetched = null;
        this.cache = null;
    }

    removeFile(fullPath): Observable<any> {
        return this.http.del(`/api/files?path=${encodeURIComponent(fullPath)}`);
    }
}