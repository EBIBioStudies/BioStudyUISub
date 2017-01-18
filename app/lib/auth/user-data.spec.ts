import {UserData} from './user-data';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {AuthService} from './auth.service';
import {UserSessionEvents} from './user-session.events';

describe('UserData', () => {
    it('should be empty when the session is not set', () => {
        const ud = new UserData(new UserSessionEvents(), {} as AuthService);
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

        const sessionEvents = new UserSessionEvents();
        const ud = new UserData(sessionEvents, checkUser as AuthService);

        sessionEvents.userSessionCreated('blah blah blah');

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

        const sessionEvents = new UserSessionEvents();
        const ud = new UserData(sessionEvents, checkUser as AuthService);

        sessionEvents.userSessionCreated('blah blah blah');

        setTimeout(() => {
            expect(ud.key).toBe('123');
            expect(ud.name).toBe('vasya');
            expect(ud.email).toBe('vasya@pupkin.com');
            expect(ud.orcid).toBe('1234-5678-9999');
            done();
        }, 1000);
    });
});
