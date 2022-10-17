import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

export function typeaheadSource(sourceFunc: () => string[], valueChanges: Observable<string>): Observable<string[]> {
  return valueChanges.pipe(
    map((token) => token && token.toLowerCase()),
    mergeMap((token: string) => {
      const value = sourceFunc().filter((filterValues) => filterValues.toLowerCase().includes(token));

      return of(value);
    })
  );
}
