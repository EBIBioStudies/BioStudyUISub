import {
    HTTP_INTERCEPTORS,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {of} from 'rxjs';
import {SubmissionListItem} from '../submission/shared/submission.service';
import {PageTab} from '../submission/shared/model/pagetab';

@Injectable()
export class TestBackendInterceptor implements HttpInterceptor {
    private userInfo = {
        sessid: '123456789',
        username: 'olkin',
        email: 'olkin@mail.com',
        superuser: false,
        secret: 'secret_12345',
        aux: {},
        projects: []
    };

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (req.url.endsWith('check?format=json') && req.method === 'GET') {
            // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
            //if (req.headers.get('Authorization') === 'Bearer fake-jwt-token') {
            return of(new HttpResponse({status: 200, body: this.userInfo}));
            //} else {
            //     // return 401 not authorised if token is null or invalid
            //     return throwError({ error: { message: 'Unauthorised' } });
            // }
        }

        if (req.url.endsWith('signin') && req.method === 'POST') {
            return of(new HttpResponse({
                status: 200, body: {
                    status: 'OK'
                }
            }));
        }

        if (req.url.endsWith('submissions') && req.method === 'GET') {
            return of(new HttpResponse({
                status: 200, body: {
                    submissions: [{
                        accno: '123',
                        title: 'test',
                        rtime: 123456,
                        mtime: 123456,
                        status: 'NEW'
                    }]
                }
            }));
        }

        if (req.url.endsWith('projects') && req.method === 'GET') {
            return of(new HttpResponse({
                status: 200, body: {
                    submissions: []
                }
            }));
        }

        if (req.url.match(/\/submissions\/pending\/\d+$/) && req.method === 'GET') {
            return of(new HttpResponse({
                status: 200, body: {
                    accno: '123',
                    changed: 123456,
                    data: {}
                }
            }));
        }

        if (req.url.match(/\/submissions\/pending\/\d+$/) && req.method === 'POST') {
            return of(new HttpResponse({
                status: 200, body: {}
            }));
        }
        return next.handle(req);
    }
}