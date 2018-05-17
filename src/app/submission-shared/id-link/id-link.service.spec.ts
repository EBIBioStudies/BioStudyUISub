import {IdLinkService} from './id-link.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {defer} from 'rxjs/observable/defer';
import 'rxjs/add/observable/throw';

function asyncError<T>(errorObject: any) {
  return defer(() => Observable.throw(errorObject));
}

function asyncData<T>(data: T) {
  return defer(() => Observable.of(data));
}

describe('IdLinkService', () => {

  let httpClientSpy: { get: jasmine.Spy };
  let service: IdLinkService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    httpClientSpy.get.and.returnValue(asyncData(['prefix1', 'prefix2', 'prefix3']));
    service = new IdLinkService(<any> httpClientSpy);
  });

  it('fetches the list of prefixes after instantiation', () => {
    service.whenListed.subscribe(() => {
      expect(service.prefixes.length).toBe(3);
    });
  });

  it('#suggest should return an empty list when the server returns a 404', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404,
      statusText: 'Not Found'
    });

    httpClientSpy.get.and.returnValue(asyncError(errorResponse));

    service.suggest('prefix').subscribe(
      items => expect(items).toEqual([])
    );
  });

  it('#validate should return an error object when the server returns a 404', () => {
    const error = {message: 'Unknown prefix', timeStamp: 'Mon Apr 23 11:44:31 BST 2018'};
    const errorResponse = new HttpErrorResponse({
      error: error,
      status: 404,
      statusText: 'Not Found'
    });

    httpClientSpy.get.and.returnValue(asyncError(errorResponse));

    service.validate('prefix', '12345').subscribe(
      (obj: Object) => {
        return expect(obj).toEqual(error);
      }
    );
  });

  it('#suggest should return only list of valid prefixes', () => {
    const resp = [{prefix: 'p1'}, {prefix: 'p2'}, {prefix: 'p3'}];
    const expectedPrefixes: string[] = resp.map(p => p.prefix);

    httpClientSpy.get.and.returnValue(asyncData(resp));

    service.suggest('prefix').subscribe(
      items => expect(items).toEqual(expectedPrefixes)
    );
    expect(httpClientSpy.get.calls.count()).toBe(2);  //one for complete list and the other the suggested prefixes
  });

});
