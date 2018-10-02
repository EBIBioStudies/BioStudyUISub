import {Observable, of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

export function createTypeaheadSource(source: () => string[], value:string): Observable<string[]> {
    console.log('createTypeaheadSource');
    const valuesFor = (token: string, sourceFunc: () => string[]) => {
        const query = new RegExp(token, 'ig');
        return of(
            sourceFunc().filter((state: any) => {
                return query.test(state.name);
            })
        );
    };

    return Observable.create((observer: any) => {
        observer.next(value);
    })
        .pipe(
            mergeMap((token: string) => valuesFor(token, source))
        );
}
