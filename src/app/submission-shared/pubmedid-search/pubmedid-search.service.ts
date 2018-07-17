import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {throwError} from "rxjs/index";
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import {HttpCustomClient} from 'app/http/http-custom-client.service';

@Injectable()
export class PubMedSearchService {
    constructor(private http: HttpCustomClient) {
    }

    search(pmid): Observable<any> {
        if (!pmid) {
            console.warn("PubMedSearch: no pubMedId given");
            return Observable.of({});
        }
        return this.http.get('/api/pubMedSearch/' + pmid)
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
                return throwError(err);
            });
    }
}
