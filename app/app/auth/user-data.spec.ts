import {UserData} from './user-data';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {AuthService} from './auth.service';
import {UserSession} from './user-session';

describe('UserData', () => {
    it('should be empty when the session is not set', () => {
        const ud = new UserData(new UserSession(), {} as AuthService);
        expect(ud.key).toBe('');
        expect(ud.email).toBe('');
        expect(ud.name).toBe('');
        expect(ud.orcid).toBe('');
    });

    it('should return empty ORCID value when it is not set', done => {
        const checkUser = {checkUser: () => Observable.of({
             sessid: '123',
             username: 'vasya',
             email: 'vasya@pupkin.com'
         })};

        const session = new UserSession();
        const ud = new UserData(session, checkUser as AuthService);

        session.create('12345');

        setTimeout(() => {
            expect(ud.key).toBe('123');
            expect(ud.name).toBe('vasya');
            expect(ud.email).toBe('vasya@pupkin.com');
            expect(ud.orcid).toBe('');
            done();
        }, 1000);
    });

    it('should return valid ORCID value when it is set', done => {
        const checkUser = {checkUser: () => Observable.of({
            sessid: '123',
            username: 'vasya',
            email: 'vasya@pupkin.com',
            aux: {
                orcid: '1234-5678-9999'
            }
        })};

        const session = new UserSession();
        const ud = new UserData(session, checkUser as AuthService);

        session.create('123456');

        setTimeout(() => {
            expect(ud.key).toBe('123');
            expect(ud.name).toBe('vasya');
            expect(ud.email).toBe('vasya@pupkin.com');
            expect(ud.orcid).toBe('1234-5678-9999');
            done();
        }, 1000);
    });
});
