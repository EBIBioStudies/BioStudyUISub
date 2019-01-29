import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {of, throwError} from 'rxjs';

@Injectable()
export class IdLinkService {
    static BASE_URL: string = 'https://identifiers.org/rest';   //base URL for the service endpoint
    public prefixes: string[] = [];                             //all possible prefixes for formatted links
    public idUrl: string | undefined;                                       //last URL for valid identifier
    private isFetched: boolean = false;                         //flags when collection data has been fetched already
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
            url = IdLinkService.BASE_URL + '/collections';
        } else if (prefix.length) {
            url = `${IdLinkService.BASE_URL}/collections/name/${prefix}`;
        } else {
            return of([]);
        }

        return this.http.get(url).map((data: Array<any>) => data.map(d => d.prefix))
            .catch((err) => {
                if (err.status === 404) {
                    return of([]);
                }
                return throwError(err);
            }
        );
    }

    /**
     * Checks if a prefix:id string is among the allowed ones.
     * @param {string} prefix - Section of the string containg just the prefix.
     * @param {string} id - Section of the string containing just the identifier.
     * @returns {Observable<boolean>} Observable the request has been turned into.
     */
    validate(prefix: string, id: string): Observable<boolean> {
        return this.http.get(`${IdLinkService.BASE_URL}/identifiers/validate/${prefix}:${id}`)
            .map((response) => {
                this.idUrl = response['url'];
                return response;
            })
            .catch((err) => {
                if (err.status === 404) {
                    return of(err.error);
                }
                return throwError(err);
            }
        );
    }
}
