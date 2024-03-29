import { HttpErrorResponse } from '@angular/common/http';
import { IdLinkService } from './id-link.service';
import { IdentifierNamespace } from './id-link.interfaces';
import { of, throwError } from 'rxjs';

function buildResponse(namespaces: Array<IdentifierNamespace>): { _embedded: object } {
  return { _embedded: { namespaces } };
}

describe('IdLinkService', () => {
  let service: IdLinkService;
  const namespaces = [{ prefix: 'prefix1' }, { prefix: 'prefix2' }, { prefix: 'prefix3' }];
  const httpClient = {
    get: jest.fn()
  };

  beforeAll(() => {
    service = new IdLinkService(httpClient as any);
  });

  it('#suggest should return an empty list when the server returns a 404', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404,
      statusText: 'Not Found'
    });

    httpClient.get.mockReturnValueOnce(throwError(errorResponse));

    service.suggest('prefix').subscribe((items) => expect(items).toEqual([]));
  });

  it('#validate should return an error object when the server returns a 404', () => {
    const error = { message: 'Unknown prefix', timeStamp: 'Mon Apr 23 11:44:31 BST 2018' };
    const errorResponse = new HttpErrorResponse({
      error,
      status: 404,
      statusText: 'Not Found'
    });

    httpClient.get.mockReturnValueOnce(throwError(errorResponse));

    service.resolve('prefix:12345').subscribe((obj) => {
      return expect(obj).toEqual(error);
    });
  });

  it('#suggest should return only list of valid prefixes', () => {
    const resp = buildResponse(namespaces);
    const expectedPrefixes: string[] = namespaces.map((p) => p.prefix);

    httpClient.get.mockReturnValue(of(resp));

    service.suggest('prefix').subscribe((items) => expect(items).toEqual(expectedPrefixes));

    expect(httpClient.get).toHaveBeenCalledTimes(1);
  });
});
