import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

export interface Org {
  id: string;
  name: string;
}

interface OrgRawData {
  number_of_results: number;
  items: Org[];
}

@Injectable()
export class OrgService {
  static ORGS_PATHNAME: string = '/organizations';

  constructor(private http: HttpClient) {}

  getOrganizations(keyword: string): Observable<Org[]> {
    return this.http.get(`${OrgService.ORGS_PATHNAME}?query=${keyword}`).pipe(
      map((data: OrgRawData) => {
        const items = data.items;

        return items.map((organization) => ({
          id: organization.id,
          name: organization.name
        }));
      }),
      catchError(() => {
        return of([]);
      })
    );
  }
}
