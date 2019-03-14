import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

const PublAttrMapping = {
    title: 'title',
    authorString: 'authors',
    pubType: 'type',
    issue: 'issue',
    journalIssn: 'issn',
    pubYear: 'year',
    journalVolume: 'volume'
};

@Injectable()
export class PubMedSearchService {
    constructor(private http: HttpClient) {
    }

    search(pmid): Observable<any> {
        if (!pmid) {
            console.warn('PubMedSearch: no pubMedId given');
            return of({});
        }
        return this.http.get<any>(`https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=ext_id:${pmid}&format=json`).pipe(
            map(resp => {
                let hitCount = resp.hitCount;
                let data = {};
                if (hitCount >= 1) {
                    let publ = resp.resultList.result[0];
                    Object.keys(PublAttrMapping).forEach(key => {
                        if (publ.hasOwnProperty(key)) {
                            data[PublAttrMapping[key]] = publ[key] + '';
                        }
                    });
                }
                return data;
            }),
            catchError((error: any) => {
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
            }));
    }
}
