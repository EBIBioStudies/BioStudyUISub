import * as HttpStatus from 'http-status-codes';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
   * @param http - Client HTTP API.
   */
  constructor(
    private http: HttpClient
  ) {}

  /**
   * Pseudonym for the "suggest" method without parameters to retrieve the complete list of prefixes.
   */
  list(): Observable<string[]> {
    return this.suggest();
  }

  /**
   * Retrieves the list of identifier prefixes matching the user-defined partial string.
   * @param [prefix] - Partial prefix for identifier. If not provided, the full list is retrieved.
   * @returns Observable the request has been turned into.
   */
  suggest(prefix?: string): Observable<string[]> {
    let url;

    if (typeof prefix === 'undefined' || prefix.length === 0) {
      url = `${IdLinkService.REGISTRY_URL}/namespaces`;
    } else if (prefix.length) {
      const formattedPrefix: string = prefix.toLowerCase().trim();

      url = `${IdLinkService.REGISTRY_URL}/namespaces/search/findByPrefixContaining?content=${formattedPrefix}`;
    } else {
      return of([]);
    }

    return this.http.get(url).pipe(
      map((data: IdentifierResponse) => {
        const embedded: IdentifierEmbedded = data._embedded || {};
        const namespaces: IdentifierNamespace[] = embedded.namespaces || [];

        return namespaces.map((namespace) => {
          return namespace.prefix === 'chebi' ? namespace.prefix.toUpperCase() : namespace.prefix;
        });
      }),
      catchError(err => {
        if (err.status === HttpStatus.NOT_FOUND) {
          return of([]);
        }
        return throwError(err);
      })
    );
  }

  /**
   * Checks if a prefix:id string is among the allowed ones.
   *
   * @param identifier - Identifier to be validated against identifiers.org.
   * @returns Observable the request has been turned into.
   */
  validate(identifier: string): Observable<IdentifierResolvedResource>  {
    return this.http.get(`${IdLinkService.RESOLUTION_URL}/${identifier}`).pipe(
      map((response: IdentifierResolverResponse) => {
        const payload: IdentifierResolverPayload = response.payload || {};
        const resolvedResources: IdentifierResolvedResource = payload.resolvedResources[0] || {};

        return resolvedResources;
      }),
      catchError((err) => {
        if (err.status === HttpStatus.BAD_REQUEST) {
          return throwError(`INVALID resolution request for ${identifier}`);
        }

        return throwError(err);
      })
    );
  }
}
