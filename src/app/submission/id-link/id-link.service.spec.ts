import { HttpErrorResponse } from '@angular/common/http';
import { IdLinkService } from './id-link.service';
import { IdentifierNamespace } from './id-link.interfaces';
import { defer, of, throwError } from 'rxjs';

function asyncError(errorObject: any) {
  return defer(() => throwError(errorObject));
}

function asyncData<T>(data: T) {
  return defer(() => of(data));
}

function buildResponse(namespaces: Array<IdentifierNamespace>) {
  return { _embedded: { namespaces } };
}

describe('IdLinkService', () => {

  let httpClientSpy: { get: jasmine.Spy };
  let service: IdLinkService;

  beforeEach(() => {
    const namespaces = [{ prefix: 'prefix1' }, { prefix: 'prefix2' }, { prefix: 'prefix3' }];
    const response = buildResponse(namespaces);

    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    httpClientSpy.get.and.returnValue(asyncData(response));
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
    const namespaces = [{ prefix: 'p1' }, { prefix: 'p2' }, { prefix: 'p3' }];
    const resp = buildResponse(namespaces);
    const expectedPrefixes: string[] = namespaces.map(p => p.prefix);

    httpClientSpy.get.and.returnValue(asyncData(resp));

    service.suggest('prefix').subscribe(
      items => expect(items).toEqual(expectedPrefixes)
    );
    expect(httpClientSpy.get.calls.count()).toBe(2);  // one for complete list and the other the suggested prefixes
  });
});
