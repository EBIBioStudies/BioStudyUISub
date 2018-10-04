import {Observable, of} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';

export function typeaheadSource(sourceFunc: () => string[], valueChanges: Observable<string>): Observable<string[]> {
    return valueChanges.pipe(
        map((token: string) => {
            return new RegExp(token, 'ig');
        }),
        mergeMap((query: RegExp) => {
                const v = sourceFunc().filter(v => v.match(query));
                return of(v);
            }
        )
    );
}
