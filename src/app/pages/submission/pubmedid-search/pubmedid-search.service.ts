import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const publAttrMapping = {
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
      return of({});
    }

    return this.http.get<any>(`https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=ext_id:${pmid}&format=json`).pipe(
      map(resp => {
        const hitCount = resp.hitCount;
        const data = {};
        if (hitCount >= 1) {
          const publ = resp.resultList.result[0];
          Object.keys(publAttrMapping).forEach(key => {
            if (publ.hasOwnProperty(key)) {
              data[publAttrMapping[key]] = publ[key] + '';
            }
          });
        }
        return data;
      }),
      catchError((error: any) => {
        const err = {status: '', message: ''};
        try {
          const jsonError = error.json ? error.json() : error;
          err.status = (jsonError.status) ? jsonError.status : 'Error';
          err.message = (jsonError.message) ? jsonError.message : 'Server error';
        } catch (e) {
          // probably not a json
          err.status = error.status || 'Error';
          err.message = error.statusText || 'Server error';
        }

        return throwError(err);
      }));
  }
}
