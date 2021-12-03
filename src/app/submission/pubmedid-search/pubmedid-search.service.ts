import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const publAttrMapping = {
  title: 'title',
  authorString: 'authors',
  pubType: 'type',
  issue: 'issue',
  journalIssn: 'issn',
  pubYear: 'year',
  journalVolume: 'volume'
};

export interface PubMedResultList {
  result: object[];
}

export interface PubMedPublication {
  nextCursorMark?: string;
  request?: object;
  resultList?: PubMedResultList;
  version?: string;
}

@Injectable()
export class PubMedSearchService {
  constructor(private http: HttpClient) {}

  search(pmid): Observable<PubMedPublication[]> {
    if (!pmid) {
      return of([] as PubMedPublication[]);
    }

    return this.http
      .get<PubMedPublication>(
        `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=ext_id:${pmid}&format=json`
      )
      .pipe(
        map((resp) => {
          return (resp.resultList!.result || []).map((result) => {
            const data: PubMedPublication = {};
            Object.keys(publAttrMapping).forEach((key) => {
              if (result.hasOwnProperty(key)) {
                data[publAttrMapping[key]] = result[key];
              }
            });

            return data;
          });
        }),
        catchError((error: any) => {
          const err = { status: '', message: '' };
          try {
            const jsonError = error.json ? error.json() : error;
            err.status = jsonError.status ? jsonError.status : 'Error';
            err.message = jsonError.message ? jsonError.message : 'Server error';
          } catch (e) {
            // probably not a json
            err.status = error.status || 'Error';
            err.message = error.statusText || 'Server error';
          }

          return throwError(err);
        })
      );
  }
}
