import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import {
  IdentifierEmbedded,
  IdentifierNamespace,
  IdentifierResponse,
  IdentifierResolverResponse,
  IdentifierResolverPayload,
  IdentifierResolvedResource,
} from './id-link.interfaces';

@Injectable()
export class IdLinkService {
  static REGISTRY_URL: string = '/identifiers/registry'; // base URL for the service endpoint
  static RESOLUTION_URL: string = '/identifiers/resolver';

  idUrl: string | undefined; // last URL for valid identifier
  prefixes: string[] = []; // all possible prefixes for formatted links

  /**
   * Caches the list of all prefixes, signalling when it's been retrieved and available.
   * @param {HttpClient} http - Client HTTP API.
   */
  constructor(
    private http: HttpClient
  ) {}

  /**
   * Pseudonym for the "suggest" method without parameters to retrieve the complete list of prefixes.
   * @returns {Observable<string[]>}
   */
  list(): Observable<string[]> {
    return this.suggest();
  }

  /**
   * Retrieves the list of identifier prefixes matching the user-defined partial string.
   * @param {string} [prefix] - Partial prefix for identifier. If not provided, the full list is retrieved.
   * @returns {Observable<string[]>} Observable the request has been turned into.
   */
  suggest(prefix?: string): Observable<string[]> {
    let url;

    if (typeof prefix === 'undefined' || prefix.length === 0) {
      url = `${IdLinkService.REGISTRY_URL}/namespaces`;
    } else if (prefix.length) {
      url = `${IdLinkService.REGISTRY_URL}/namespaces/search/findByPrefixContaining?content=${prefix}`;
    } else {
      return of([]);
    }

    return this.http.get(url).pipe(
      map((data: IdentifierResponse) => {
        const _embedded: IdentifierEmbedded = data._embedded || {};
        const namespaces: IdentifierNamespace[] = _embedded.namespaces || [];

        return namespaces.map((namespace) => {
          return namespace.prefix === 'chebi' ? namespace.prefix.toUpperCase() : namespace.prefix;
        });
      }),
      catchError(err => {
        if (err.status === 404) {
          return of([]);
        }
        return throwError(err);
      })
    );
  }

  /**
   * Checks if a prefix:id string is among the allowed ones.
   *
   * @param {string} prefix - Section of the string containg just the prefix.
   * @param {string} id - Section of the string containing just the identifier.
   * @returns {Observable<boolean>} Observable the request has been turned into.
   */
  validate(prefix: string, id: string): Observable<boolean> {
    return this.http.get(`${IdLinkService.RESOLUTION_URL}/${prefix}:${id}`).pipe(
      map((response: IdentifierResolverResponse) => {
        const payload: IdentifierResolverPayload = response.payload || {};
        const resolvedResources: IdentifierResolvedResource = payload.resolvedResources[0] || {};

        return resolvedResources;
      }),
      catchError((err) => {
        if (err.status === 404) {
          return of(err.error);
        }

        if (err.status === 400) {
          return of(`INVALID resolution request for ${prefix}:${id}`);
        }

        return throwError(err);
      })
    );
  }
}
