import {Observable, of} from 'rxjs';
import {debounceTime, map, mergeMap} from 'rxjs/operators';

export function typeaheadSource(sourceFunc: () => string[], valueChanges: Observable<string>): Observable<string[]> {
    console.log('create typeahead source');
    return valueChanges.pipe(
  /*      debounceTime<string>(200),*/
        map((token: string) => new RegExp(token, 'ig')),
        mergeMap((query: RegExp) => of(sourceFunc().filter(v => query.test(v))))
    );
}
