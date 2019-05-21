import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

export function typeaheadSource(sourceFunc: () => string[], valueChanges: Observable<string>): Observable<string[]> {
    return valueChanges.pipe(
        map(token => token.toLowerCase()),
        mergeMap((token: string) => {
                const v = sourceFunc().filter(v => v.toLowerCase().includes(token));
                return of(v);
            }
        )
    );
}
