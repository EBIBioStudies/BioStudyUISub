import {async} from '@angular/core/testing';
import {of} from 'rxjs';

import {UserData} from './user-data';
import {AuthService} from './auth.service';
import {UserSession} from './user-session';

describe('UserData', () => {
    let submService;

    beforeEach(() => {
        submService = {
            getProjects() {
                return of([]);
            }
        };
    });

    it('should be empty when the session is not set', () => {
        const ud = new UserData(new UserSession(), <AuthService>{}, submService);
        const contact = ud.contact;
        expect(contact['Name']).toBe('');
        expect(contact['E-mail']).toBe('');
        expect(contact['ORCID']).toBe('');
    });

    it('should return empty ORCID value when it is not set', async(() => {
        const user = {
            sessid: '123',
            username: 'vasya',
            email: 'vasya@pupkin.com'
        };
        const authService = {
            checkUser() {
                return of(user);
            }
        };

        const session = new UserSession();

        const _ud = new UserData(session, authService as AuthService, submService);
        _ud.whenFetched.subscribe(ud => {
            const contact = _ud.contact;
            expect(ud['sessid']).toBe(user.sessid);
            expect(ud['username']).toBe(user.username);
            expect(contact['Name']).toBe(user.username);
            expect(ud['email']).toBe(user.email);
            expect(contact['E-mail']).toBe(user.email);
            expect(contact['ORCID']).toBe('');
        });

        session.create('12345');

    }));

    it('should return valid ORCID value when it is set', async(() => {
        const user = {
            sessid: '123',
            username: 'vasya',
            email: 'vasya@pupkin.com',
            aux: {
                orcid: '1234-5678-9999'
            }
        };
        const checkUser = {
            checkUser: () => of(user)
        };
        const session = new UserSession();
        const _ud = new UserData(session, checkUser as AuthService, submService);
        _ud.whenFetched.subscribe(ud => {
            const contact = _ud.contact;
            expect(ud['username']).toBe(user.username);
            expect(contact['Name']).toBe(user.username);
            expect(ud['email']).toBe(user.email);
            expect(contact['E-mail']).toBe(user.email);
            expect(contact['ORCID']).toBe(user.aux.orcid);
        });

        session.create('123456');
    }));
});
