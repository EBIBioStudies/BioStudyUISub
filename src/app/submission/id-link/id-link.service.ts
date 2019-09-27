import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
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
    static REGISTRY_URL: string = 'https://registry.api.identifiers.org/restApi'; // base URL for the service endpoint
    static RESOLUTION_URL: string = 'https://resolver.api.identifiers.org';
    public prefixes: string[] = []; // all possible prefixes for formatted links
    public idUrl: string | undefined; // last URL for valid identifier
    private isFetched: boolean = false; // flags when collection data has been fetched already
    private _whenFetched: Subject<any> = new Subject<any>();

    /**
     * Caches the list of all prefixes, signalling when it's been retrieved and available.
     * @param {HttpClient} http - Client HTTP API.
     */
    constructor(private http: HttpClient) {
        this.list().subscribe(data => {
            this.prefixes = data;
            this._whenFetched.next(data);
            this.isFetched = true;
            this._whenFetched.complete();
        });
    }

    /**
     * Creates an observable normalised to resolve instantly if the list of prefixes has already been retrieved.
     * @returns {Observable<any>} Observable from subject.
     */
    get whenListed(): Observable<any> {
        if (this.isFetched) {
            return of(this.prefixes);
        } else {
            return this._whenFetched.asObservable();
        }
    }

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

        if (typeof prefix === 'undefined') {
            url = IdLinkService.REGISTRY_URL + '/namespaces';
        } else if (prefix.length) {
            url = `${IdLinkService.REGISTRY_URL}/namespaces/search/findByPrefixContaining?content=${prefix}`;
        } else {
            return of([]);
        }

        return this.http.get(url).pipe(
            map((data: IdentifierResponse) => {
                const _embedded: IdentifierEmbedded = data._embedded || {};
                const namespaces: IdentifierNamespace[] = _embedded.namespaces || [];

                return namespaces.map((namespace) => namespace.prefix);
            }),
            catchError((err) => {
                if (err.status === 404) {
                    return of([]);
                }

                // return throwError(err);
                return of([]);
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
            catchError(err => {
                if (err.status === 404) {
                    return of(err.error);
                }

                // return throwError(err);
                return of([]);
            })
        );
    }
}
