import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {UserData} from './user-data';
import {AuthService} from './auth.service';
import {UserSession} from './user-session';

describe('UserData', () => {
    it('should be empty when the session is not set', () => {
        const ud = new UserData(new UserSession(), {} as AuthService);
        const contact = ud.contact;
        expect(contact['Name']).toBe('');
        expect(contact['E-mail']).toBe('');
        expect(contact['ORCID']).toBe('');
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
        const contact = ud.contact;

        setTimeout(() => {
            expect(ud['sessid']).toBe('123');
            expect(ud['username']).toBe('vasya');
            expect(contact['Name']).toBe('vasya');
            expect(ud['email']).toBe('vasya@pupkin.com');
            expect(contact['E-mail']).toBe('vasya@pupkin.com');
            expect(contact['ORCID']).toBe('');

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
        const contact = ud.contact;

        setTimeout(() => {
            expect(ud['username']).toBe('vasya');
            expect(contact['Name']).toBe('vasya');
            expect(ud['email']).toBe('vasya@pupkin.com');
            expect(contact['E-mail']).toBe('vasya@pupkin.com');
            expect(contact['ORCID']).toBe('1234-5678-9999');
            done();
        }, 1000);
    });
});
