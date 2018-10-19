import {async} from '@angular/core/testing';
import {of} from 'rxjs';

import {UserData} from './user-data';
import {AuthService} from './auth.service';
import {UserSession} from './user-session';
import {UserInfo} from './model/user-info';

describe('UserData', () => {
    let submService;

    beforeEach(() => {
        submService = {
            getProjects() {
                return of([]);
            }
        };
    });

    it('should return valid user info', async(() => {
        const user: UserInfo = {
            sessid: '123',
            username: 'vasya',
            email: 'vasya@pupkin.com',
            superuser: false,
            secret: 'secret',
            aux: {
                orcid: '1234-5678-9999'
            },
            projects: []
        };

        const authService = {
            checkUser() {
                return of(user);
            }
        };

        const session = new UserSession();

        new UserData(session, authService as AuthService, submService).info$
            .subscribe(info => {
                expect(info).toEqual(user);
            });

        session.create('12345');
    }));
});
