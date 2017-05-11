import {Injectable} from '@angular/core';
import {Response} from '@angular/http';

import {HttpClient} from '../../http/http-client';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class PubMedSearchService {
    constructor(private http: HttpClient) {
    }

    search(pmid): Observable<any> {
        if (!pmid) {
            console.warn("PubMedSearch: no pubMedId given");
            return Observable.of({});
        }
        return this.http.get('/api/pubMedSearch/' + pmid)
            .map((resp: Response) => resp.json())
            .catch((error: any) => {
                let err = {status: '', message: ''};
                try {
                    let jsonError = error.json ? error.json() : error;
                    err.status = (jsonError.status) ? jsonError.status : 'Error';
                    err.message = (jsonError.message) ? jsonError.message : 'Server error';
                } catch (e) {
                    // probably not a json
                    err.status = error.status || 'Error';
                    err.message = error.statusText || 'Server error';
                }
                console.error(err);
                return Observable.throw(err);
            });
    }
}
